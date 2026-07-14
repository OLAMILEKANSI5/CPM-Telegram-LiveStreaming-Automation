import os
from dotenv import load_dotenv

load_dotenv()


def _require(name: str) -> str:
    val = os.getenv(name)
    if not val:
        raise RuntimeError(f"Missing required env var: {name}")
    return val


class Settings:
    DATABASE_URL = _require("DATABASE_URL")
    TG_API_ID = int(_require("TG_API_ID"))
    TG_API_HASH = _require("TG_API_HASH")
    TG_PHONE_NUMBER = _require("TG_PHONE_NUMBER")
    AUDIO_DIR = os.getenv("AUDIO_DIR", "./uploads/audio")
    BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8081"))
    SCHEDULER_POLL_SECONDS = int(os.getenv("SCHEDULER_POLL_SECONDS", "30"))
    SESSION_NAME = "prayer_broadcast_session"


settings = Settings()
