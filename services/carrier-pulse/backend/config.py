"""Application configuration loaded from environment variables."""

import os
from pathlib import Path

from pydantic_settings import BaseSettings

# Resolve .env relative to this file: backend/config.py → project root/.env
_ENV_FILE = Path(__file__).resolve().parent.parent / ".env"

# Only use .env file if it actually exists (Railway sets real env vars)
_USE_ENV_FILE = str(_ENV_FILE) if _ENV_FILE.exists() else None

# Remove empty ANTHROPIC_API_KEY from shell env so .env file value is used
# (shell may export it as empty string which overrides the .env value)
if os.environ.get("ANTHROPIC_API_KEY", None) == "":
    del os.environ["ANTHROPIC_API_KEY"]


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    database_url: str = "sqlite+aiosqlite:///./data/intel.db"

    # Email
    email_to: str = ""
    email_from: str = ""
    smtp_server: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_password: str = ""

    # JWT Auth
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_hours: int = 24

    # Initial superadmin seed
    initial_admin_email: str = "admin@carrierpulse.com"
    initial_admin_password: str = "admin"
    initial_admin_name: str = "Admin"

    # Service-to-service auth (platform proxy)
    service_key: str = ""

    # Agent schedule
    agent_schedule_day: str = "friday"
    agent_schedule_hour: int = 7
    agent_schedule_timezone: str = "America/New_York"

    model_config = {"env_file": _USE_ENV_FILE, "env_file_encoding": "utf-8"}


settings = Settings()
