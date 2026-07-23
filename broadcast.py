import os
import subprocess
import uuid
import time
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from pydantic import BaseModel
from . import db, broadcast, telegram_client as tg
from .config import settings

app = FastAPI(title="Prayer Broadcast Backend")

ALLOWED_AUDIO_EXT = {".mp3", ".wav", ".aac", ".ogg", ".m4a", ".flac"}


def _safe_ext(filename: str) -> str:
    ext = os.path.splitext(filename or "")[1].lower()
    return ext if ext in ALLOWED_AUDIO_EXT else ".mp3"


def _probe_duration_seconds(path: str) -> float:
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", path],
            capture_output=True, text=True, timeout=30,
        )
        return float(result.stdout.strip())
    except Exception:
        return 0.0


@app.get("/")
async def root():
    return {"service": "prayer-broadcast-backend", "status": "up"}


class StartRequest(BaseModel):
    audio_id: int | None = None
    duration_minutes: int = 60


@app.get("/health")
async def health():
    return {"ok": True}


@app.get("/status")
async def status():
    cfg = await db.get_telegram_config()
    elapsed = None
    if tg.state["started_at"] and tg.state["broadcast_active"]:
        elapsed = time.time() - tg.state["started_at"]
    return {
        "connected": bool(cfg and cfg["connected"]),
        "inVoiceChat": tg.state["in_voice_chat"],
        "broadcastActive": tg.state["broadcast_active"],
        "currentAudio": tg.state["current_audio"],
        "elapsedSeconds": elapsed,
    }


@app.post("/broadcast/start")
async def broadcast_start(req: StartRequest):
    cfg = await db.get_telegram_config()
    if not cfg or not cfg["voice_chat_id"]:
        raise HTTPException(400, "Telegram voice_chat_id is not configured")
    try:
        await broadcast.start_broadcast(
            chat_id=int(cfg["voice_chat_id"]),
            audio_id=req.audio_id,
            duration_minutes=req.duration_minutes,
            triggered_by="manual",
        )
    except RuntimeError as e:
        raise HTTPException(409, str(e))
    return {"ok": True}


@app.post("/broadcast/stop")
async def broadcast_stop():
    await broadcast.stop_broadcast()
    return {"ok": True}


# ---------------------------------------------------------------------------
# Audio library
# ---------------------------------------------------------------------------

@app.get("/audio")
async def audio_list():
    rows = await db.list_audios()
    return {"audios": rows}


@app.post("/audio")
async def audio_upload(file: UploadFile = File(...), is_default: bool = False):
    if not file.filename:
        raise HTTPException(400, "No file provided")

    ext = _safe_ext(file.filename)
    os.makedirs(settings.AUDIO_DIR, exist_ok=True)
    stored_filename = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(settings.AUDIO_DIR, stored_filename)

    size_bytes = 0
    with open(dest_path, "wb") as out:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            size_bytes += len(chunk)
            out.write(chunk)

    duration = await asyncio_to_thread_probe(dest_path)

    row = await db.create_audio_row(
        filename=stored_filename,
        original_name=file.filename,
        file_path=dest_path,
        mime_type=file.content_type,
        duration_seconds=duration,
        file_size_bytes=size_bytes,
        is_default=is_default,
    )
    await db.add_log("info", "system", f"Audio uploaded: {file.filename}")
    return {"ok": True, "audio": row}


@app.delete("/audio/{audio_id}")
async def audio_delete(audio_id: int):
    row = await db.delete_audio_row(audio_id)
    if row and row.get("file_path") and os.path.exists(row["file_path"]):
        try:
            os.remove(row["file_path"])
        except Exception:
            pass
    return {"ok": True}


@app.post("/audio/{audio_id}/default")
async def audio_set_default(audio_id: int):
    await db.set_default_audio_row(audio_id)
    return {"ok": True}


@app.get("/audio/{audio_id}/file")
async def audio_file(audio_id: int):
    audio = await db.get_audio(audio_id)
    if not audio or not os.path.exists(audio["file_path"]):
        raise HTTPException(404, "Audio file not found")
    return FileResponse(
        audio["file_path"],
        media_type=audio.get("mime_type") or "audio/mpeg",
        filename=audio["original_name"],
    )


async def asyncio_to_thread_probe(path: str) -> float:
    import asyncio
    return await asyncio.to_thread(_probe_duration_seconds, path)
