"""
Run this ONCE, interactively, before starting the backend for the first time.

It logs into Telegram with your user account (the account that will join the
voice chat and stream prayer audio), then saves the resulting session string
into the telegram_config table so the backend can reconnect headlessly from
then on (no more OTP prompts on every restart).

Usage:
    cd backend
    pip install -r requirements.txt
    python login.py
"""
import asyncio
from pyrogram import Client
from app.config import settings
from app import db


async def main():
    client = Client(
        "login_session",
        api_id=settings.TG_API_ID,
        api_hash=settings.TG_API_HASH,
        phone_number=settings.TG_PHONE_NUMBER,
        in_memory=True,
    )
    await client.start()
    session_string = await client.export_session_string()
    await client.stop()

    await db.save_telegram_session(session_string)
    print("\nLogin successful. Session string saved to telegram_config.session_string.")
    print("You can now start the backend normally with: python -m app.main")


if __name__ == "__main__":
    asyncio.run(main())
