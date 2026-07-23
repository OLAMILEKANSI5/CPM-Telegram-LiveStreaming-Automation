import asyncio
from datetime import datetime
from zoneinfo import ZoneInfo
from . import db, broadcast
from .config import settings


async def scheduler_loop():
    """Every SCHEDULER_POLL_SECONDS, check enabled schedules and fire any that are due
    and haven't already run today."""
    while True:
        try:
            schedules = await db.get_enabled_schedules()
            for sched in schedules:
                await _maybe_run(sched)
        except Exception as e:
            await db.add_log("error", "scheduler", f"Scheduler loop error: {e}")
        await asyncio.sleep(settings.SCHEDULER_POLL_SECONDS)


async def _maybe_run(sched):
    tz = ZoneInfo(sched["timezone"] or "Africa/Lagos")
    now = datetime.now(tz)

    days = {int(d) for d in (sched["days_of_week"] or "0,1,2,3,4,5,6").split(",") if d != ""}
    # Python: Monday=0..Sunday=6. Schema: 0=Sun..6=Sat. Convert.
    python_to_schema = (now.weekday() + 1) % 7
    if python_to_schema not in days:
        return

    if now.hour != sched["hour"] or now.minute != sched["minute"]:
        return

    already = await db.get_last_history_started_today(sched["id"])
    if already:
        return

    cfg = await db.get_telegram_config()
    if not cfg or not cfg["voice_chat_id"]:
        await db.add_log("error", "scheduler", f"Schedule '{sched['name']}' due but no voice_chat_id configured")
        return

    await db.add_log("info", "scheduler", f"Triggering scheduled broadcast: {sched['name']}")
    await broadcast.start_broadcast(
        chat_id=int(cfg["voice_chat_id"]),
        audio_id=sched["audio_id"],
        duration_minutes=sched["duration_minutes"],
        schedule_id=sched["id"],
        triggered_by="scheduler",
    )
