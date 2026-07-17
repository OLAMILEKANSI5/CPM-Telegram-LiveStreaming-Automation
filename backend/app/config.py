import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Only truly essential-for-the-web-server-to-start settings are read eagerly.
    # Telegram/DB credentials are read lazily (as properties) so a missing or
    # malformed value NEVER crashes the process at import time -- the web
    # server (and its healthcheck endpoint) must always be able to start.
    AUDIO_DIR = os.getenv("AUDIO_DIR", "./uploads/audio")
    BACKEND_PORT = int(os.getenv("PORT", os.getenv("BACKEND_PORT", "8081")))
    SCHEDULER_POLL_SECONDS = int(os.getenv("SCHEDULER_POLL_SECONDS", "30"))
    SESSION_NAME = "prayer_broadcast_session"

    @property
    def DATABASE_URL(self) -> str:
        val = os.getenv("DATABASE_URL")
        if not val:
            raise RuntimeError("Missing required env var: DATABASE_URL")
        return val

    @property
    def TG_API_ID(self) -> int:
        val = os.getenv("TG_API_ID")
        if not val:
            raise RuntimeError("Missing required env var: TG_API_ID")
        return int(val)

    @property
    def TG_API_HASH(self) -> str:
        val = os.getenv("TG_API_HASH")
        if not val:
            raise RuntimeError("Missing required env var: TG_API_HASH")
        return val

    @property
    def TG_PHONE_NUMBER(self) -> str:
        val = os.getenv("TG_PHONE_NUMBER")
        if not val:
            raise RuntimeError("Missing required env var: TG_PHONE_NUMBER")
        return val


settings = Settings()
