import asyncio
import uvicorn
from . import db, telegram_client as tg, scheduler
from .api import app
from .config import settings


async def _connect_telegram_background():
    """Runs after the web server is already listening, so Railway's healthcheck
    passes immediately regardless of how long Telegram login takes (or whether
    it fails). Retries on failure instead of crashing the whole process."""
    while True:
        try:
            await tg.init_clients()
            await db.add_log("info", "system", "Prayer broadcast backend connected to Telegram")
            sched_task = asyncio.create_task(scheduler.scheduler_loop())
            await sched_task
            break
        except Exception as e:
            print(f"[telegram] init failed, retrying in 30s: {e}")
            try:
                await db.add_log("error", "telegram", f"Telegram init failed: {e}")
            except Exception:
                pass  # DB might also be unreachable; don't crash on top of it
            await asyncio.sleep(30)


async def _run():
    bg_task = asyncio.create_task(_connect_telegram_background())

    config = uvicorn.Config(app, host="0.0.0.0", port=settings.BACKEND_PORT, log_level="info")
    server = uvicorn.Server(config)

    try:
        await server.serve()
    finally:
        bg_task.cancel()
        await tg.shutdown_clients()


if __name__ == "__main__":
    asyncio.run(_run())
