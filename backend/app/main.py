import asyncio
import uvicorn
from . import db, telegram_client as tg, scheduler
from .api import app
from .config import settings


async def _run():
    await tg.init_clients()
    await db.add_log("info", "system", "Prayer broadcast backend started")

    sched_task = asyncio.create_task(scheduler.scheduler_loop())

    config = uvicorn.Config(app, host="0.0.0.0", port=settings.BACKEND_PORT, log_level="info")
    server = uvicorn.Server(config)

    try:
        await server.serve()
    finally:
        sched_task.cancel()
        await tg.shutdown_clients()


if __name__ == "__main__":
    asyncio.run(_run())
