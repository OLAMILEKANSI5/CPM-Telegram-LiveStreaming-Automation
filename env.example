import psycopg
from psycopg.rows import dict_row
from datetime import datetime
from .config import settings


async def get_conn():
    return await psycopg.AsyncConnection.connect(settings.DATABASE_URL, row_factory=dict_row)


# ---------- logs ----------
async def add_log(level: str, category: str, message: str, details: str | None = None):
    async with await get_conn() as conn:
        await conn.execute(
            """INSERT INTO logs (level, category, message, details, timestamp)
               VALUES (%s, %s, %s, %s, now())""",
            (level, category, message, details),
        )
        await conn.commit()


# ---------- telegram_config ----------
async def get_telegram_config():
    async with await get_conn() as conn:
        cur = await conn.execute("SELECT * FROM telegram_config LIMIT 1")
        return await cur.fetchone()


async def set_telegram_connected(connected: bool):
    async with await get_conn() as conn:
        await conn.execute(
            """UPDATE telegram_config
               SET connected = %s, last_connected_at = CASE WHEN %s THEN now() ELSE last_connected_at END,
                   updated_at = now()""",
            (connected, connected),
        )
        await conn.commit()


async def save_telegram_session(session_string: str):
    async with await get_conn() as conn:
        await conn.execute(
            "UPDATE telegram_config SET session_string = %s, updated_at = now()",
            (session_string,),
        )
        await conn.commit()


# ---------- schedules ----------
async def get_enabled_schedules():
    async with await get_conn() as conn:
        cur = await conn.execute("SELECT * FROM schedules WHERE enabled = true")
        return await cur.fetchall()


# ---------- audios ----------
async def get_audio(audio_id: int):
    async with await get_conn() as conn:
        cur = await conn.execute("SELECT * FROM audios WHERE id = %s", (audio_id,))
        return await cur.fetchone()


async def get_default_audio():
    async with await get_conn() as conn:
        cur = await conn.execute(
            "SELECT * FROM audios WHERE is_default = true ORDER BY id LIMIT 1"
        )
        row = await cur.fetchone()
        if row:
            return row
        cur = await conn.execute("SELECT * FROM audios ORDER BY id LIMIT 1")
        return await cur.fetchone()


# ---------- audios (list / create / delete / default) ----------
async def list_audios():
    async with await get_conn() as conn:
        cur = await conn.execute(
            "SELECT * FROM audios ORDER BY is_default DESC, filename ASC"
        )
        return await cur.fetchall()


async def create_audio_row(filename: str, original_name: str, file_path: str,
                            mime_type: str | None, duration_seconds: float,
                            file_size_bytes: int, is_default: bool = False):
    async with await get_conn() as conn:
        if is_default:
            await conn.execute("UPDATE audios SET is_default = false")
        cur = await conn.execute(
            """INSERT INTO audios (filename, original_name, file_path, mime_type,
               duration_seconds, file_size_bytes, is_default, created_at)
               VALUES (%s, %s, %s, %s, %s, %s, %s, now()) RETURNING *""",
            (filename, original_name, file_path, mime_type, duration_seconds,
             file_size_bytes, is_default),
        )
        row = await cur.fetchone()
        await conn.commit()
        return row


async def delete_audio_row(audio_id: int):
    async with await get_conn() as conn:
        cur = await conn.execute("SELECT * FROM audios WHERE id = %s", (audio_id,))
        row = await cur.fetchone()
        await conn.execute("DELETE FROM audios WHERE id = %s", (audio_id,))
        await conn.commit()
        return row


async def set_default_audio_row(audio_id: int):
    async with await get_conn() as conn:
        await conn.execute("UPDATE audios SET is_default = false")
        await conn.execute("UPDATE audios SET is_default = true WHERE id = %s", (audio_id,))
        await conn.commit()


# ---------- history ----------
async def create_history(schedule_id: int | None, audio_id: int | None, audio_name: str, triggered_by: str) -> int:
    async with await get_conn() as conn:
        cur = await conn.execute(
            """INSERT INTO history (started_at, status, audio_id, audio_name, schedule_id, triggered_by)
               VALUES (now(), 'running', %s, %s, %s, %s) RETURNING id""",
            (audio_id, audio_name, schedule_id, triggered_by),
        )
        row = await cur.fetchone()
        await conn.commit()
        return row["id"]


async def finish_history(history_id: int, status: str, duration_seconds: float,
                          error_message: str | None = None, telegram_log: str | None = None):
    async with await get_conn() as conn:
        await conn.execute(
            """UPDATE history SET ended_at = now(), status = %s, duration_seconds = %s,
               error_message = %s, telegram_log = %s WHERE id = %s""",
            (status, duration_seconds, error_message, telegram_log, history_id),
        )
        await conn.commit()


async def get_last_history_started_today(schedule_id: int):
    async with await get_conn() as conn:
        cur = await conn.execute(
            """SELECT * FROM history WHERE schedule_id = %s
               AND started_at::date = now()::date
               AND status IN ('running', 'completed')
               ORDER BY started_at DESC LIMIT 1""",
            (schedule_id,),
        )
        return await cur.fetchone()
