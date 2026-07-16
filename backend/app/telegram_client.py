import asyncio
from pyrogram import Client
from pytgcalls import PyTgCalls
from pytgcalls.types import MediaStream
from .config import settings
from . import db

# Global singleton state -----------------------------------------------------
pyro_client: Client | None = None
call_client: PyTgCalls | None = None

state = {
    "in_voice_chat": False,
    "broadcast_active": False,
    "current_audio": None,
    "current_chat_id": None,
    "started_at": None,
    "current_history_id": None,
}


async def init_clients():
    """Start the Pyrogram user client and PyTgCalls binding. Call once at process start."""
    global pyro_client, call_client

    cfg = await db.get_telegram_config()
    session_string = cfg["session_string"] if cfg else None

    if session_string:
        pyro_client = Client(
            settings.SESSION_NAME,
            api_id=settings.TG_API_ID,
            api_hash=settings.TG_API_HASH,
            session_string=session_string,
            in_memory=True,
        )
    else:
        # Falls back to a local .session file created by login.py (run that first)
        pyro_client = Client(
            settings.SESSION_NAME,
            api_id=settings.TG_API_ID,
            api_hash=settings.TG_API_HASH,
            phone_number=settings.TG_PHONE_NUMBER,
        )

    await pyro_client.start()

    call_client = PyTgCalls(pyro_client)
    await call_client.start()

try:
    await db.set_telegram_connected(True)
    await db.add_log(
        "info",
        "telegram",
        "Connected to Telegram as user client"
    )
except Exception as e:
    print("Warning:", e)
    return pyro_client, call_client


async def join_and_play(chat_id: int, file_path: str):
    global state
    if call_client is None:
        raise RuntimeError("Telegram client not initialized")

    await call_client.play(chat_id, MediaStream(file_path))
    state["in_voice_chat"] = True
    state["broadcast_active"] = True
    state["current_chat_id"] = chat_id
    state["current_audio"] = file_path


async def leave_call(chat_id: int):
    global state
    if call_client is None:
        return
    try:
        await call_client.leave_call(chat_id)
    except Exception:
        pass
    state["in_voice_chat"] = False
    state["broadcast_active"] = False
    state["current_chat_id"] = None
    state["current_audio"] = None


async def shutdown_clients():
    if call_client:
        try:
            await call_client.stop()
        except Exception:
            pass
    if pyro_client:
        try:
            await pyro_client.stop()
        except Exception:
            pass
    try:
    await db.set_telegram_connected(False)
except Exception:
    pass


