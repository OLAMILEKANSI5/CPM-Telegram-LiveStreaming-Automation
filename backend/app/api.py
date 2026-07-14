import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from . import db, broadcast, telegram_client as tg

app = FastAPI(title="Prayer Broadcast Backend")


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
