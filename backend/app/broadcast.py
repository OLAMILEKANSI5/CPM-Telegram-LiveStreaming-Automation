import asyncio
import os
import subprocess
import tempfile
import time
from . import db, telegram_client as tg


def _ffmpeg_loop_to_duration(src_path: str, duration_seconds: int) -> str:
    """Uses ffmpeg to loop/trim the source audio to exactly duration_seconds.
    Returns path to the generated temp file."""
    fd, out_path = tempfile.mkstemp(suffix=".mp3")
    os.close(fd)
    cmd = [
        "ffmpeg", "-y",
        "-stream_loop", "-1",
        "-i", src_path,
        "-t", str(duration_seconds),
        "-c:a", "libmp3lame", "-b:a", "128k",
        out_path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg failed: {result.stderr[-2000:]}")
    return out_path


async def run_broadcast(chat_id: int, audio_path: str, audio_id: int | None,
                         audio_name: str, duration_minutes: int,
                         schedule_id: int | None, triggered_by: str):
    duration_seconds = duration_minutes * 60
    history_id = await db.create_history(schedule_id, audio_id, audio_name, triggered_by)
    tg.state["current_history_id"] = history_id
    tg.state["started_at"] = time.time()

    try:
        await db.add_log("info", "broadcast", f"Preparing audio for {duration_minutes} min broadcast: {audio_name}")
        looped_path = await asyncio.to_thread(_ffmpeg_loop_to_duration, audio_path, duration_seconds)

        await db.add_log("info", "telegram", f"Joining voice chat {chat_id}")
        await tg.join_and_play(chat_id, looped_path)
        await db.add_log("info", "broadcast", "Broadcast started")

        await asyncio.sleep(duration_seconds)

        await tg.leave_call(chat_id)
        await db.add_log("info", "broadcast", "Broadcast finished, left voice chat")
        await db.finish_history(history_id, "completed", duration_seconds)

    except asyncio.CancelledError:
        await tg.leave_call(chat_id)
        await db.finish_history(history_id, "stopped", time.time() - tg.state["started_at"])
        await db.add_log("warning", "broadcast", "Broadcast manually stopped")
        raise
    except Exception as e:
        await tg.leave_call(chat_id)
        await db.finish_history(history_id, "failed", time.time() - tg.state["started_at"], error_message=str(e))
        await db.add_log("error", "broadcast", f"Broadcast failed: {e}")
    finally:
        tg.state["current_history_id"] = None
        try:
            os.remove(looped_path)
        except Exception:
            pass


# Tracks the currently running asyncio task so it can be cancelled by /broadcast/stop
current_task: asyncio.Task | None = None


async def start_broadcast(chat_id: int, audio_id: int | None, duration_minutes: int,
                           schedule_id: int | None = None, triggered_by: str = "manual"):
    global current_task
    if current_task and not current_task.done():
        raise RuntimeError("A broadcast is already running")

    if audio_id:
        audio = await db.get_audio(audio_id)
    else:
        audio = await db.get_default_audio()
    if not audio:
        raise RuntimeError("No audio available to broadcast")

    current_task = asyncio.create_task(
        run_broadcast(chat_id, audio["file_path"], audio["id"], audio["original_name"],
                      duration_minutes, schedule_id, triggered_by)
    )
    return current_task


async def stop_broadcast():
    global current_task
    if current_task and not current_task.done():
        current_task.cancel()
        try:
            await current_task
        except asyncio.CancelledError:
            pass
