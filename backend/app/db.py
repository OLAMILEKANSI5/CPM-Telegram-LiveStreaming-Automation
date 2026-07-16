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

        cur = await conn.execute(
            "SELECT * FROM telegram_config LIMIT 1"
        )

        row = await cur.fetchone()

        if row:
            return row

        await conn.execute("""
            INSERT INTO telegram_config (connected)
            VALUES(FALSE)
        """)

        await conn.commit()

        cur = await conn.execute(
            "SELECT * FROM telegram_config LIMIT 1"
        )

        return await cur.fetchone()

# ---------- telegram status ----------
async def set_telegram_connected(connected: bool):
    async with await get_conn() as conn:
        await conn.execute(
            """
            UPDATE telegram_config
            SET connected = %s,
                last_connected_at = CASE
                    WHEN %s THEN NOW()
                    ELSE last_connected_at
                END,
                updated_at = NOW()
            """,
            (connected, connected),
        )
        await conn.commit()

     # ---------- save_telegram_session ----------
async def save_telegram_session(session_string: str):
    async with await get_conn() as conn:

        cur = await conn.execute(
            "SELECT id FROM telegram_config LIMIT 1"
        )

        row = await cur.fetchone()

        if row is None:

            await conn.execute("""
                INSERT INTO telegram_config
                (
                    connected,
                    session_string,
                    last_connected_at,
                    updated_at
                )
                VALUES
                (
                    TRUE,
                    %s,
                    NOW(),
                    NOW()
                )
            """, (session_string,))

        else:

            await conn.execute("""
                UPDATE telegram_config
                SET
                    connected = TRUE,
                    session_string = %s,
                    last_connected_at = NOW(),
                    updated_at = NOW()
                WHERE id = %s
            """, (session_string, row["id"]))

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


async def initialize_database():
    async with await get_conn() as conn:

        await conn.execute("""
        CREATE TABLE IF NOT EXISTS telegram_config (
            id SERIAL PRIMARY KEY,
            api_id TEXT,
            api_hash TEXT,
            phone_number TEXT,
            session_string TEXT,
            connected BOOLEAN DEFAULT FALSE,
            last_connected_at TIMESTAMP,
            updated_at TIMESTAMP DEFAULT now()
        );
        """)

        await conn.execute("""
        CREATE TABLE IF NOT EXISTS logs (
            id SERIAL PRIMARY KEY,
            level TEXT,
            category TEXT,
            message TEXT,
            details TEXT,
            timestamp TIMESTAMP DEFAULT now()
        );
        """)

        await conn.execute("""
        CREATE TABLE IF NOT EXISTS audios (
            id SERIAL PRIMARY KEY,
            name TEXT,
            file_path TEXT,
            is_default BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT now()
        );
        """)

        await conn.execute("""
        CREATE TABLE IF NOT EXISTS schedules (
            id SERIAL PRIMARY KEY,
            title TEXT,
            start_time TIME,
            end_time TIME,
            audio_id INTEGER,
            enabled BOOLEAN DEFAULT TRUE
        );
        """)

        await conn.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id SERIAL PRIMARY KEY,
            schedule_id INTEGER,
            audio_id INTEGER,
            audio_name TEXT,
            started_at TIMESTAMP,
            ended_at TIMESTAMP,
            status TEXT,
            duration_seconds DOUBLE PRECISION,
            error_message TEXT,
            telegram_log TEXT,
            triggered_by TEXT
        );
        """)

        cur = await conn.execute(
            "SELECT COUNT(*) AS total FROM telegram_config"
        )

        row = await cur.fetchone()

        if row["total"] == 0:
            await conn.execute("""
                INSERT INTO telegram_config
                (connected)
                VALUES (FALSE)
            """)

        await conn.commit()
