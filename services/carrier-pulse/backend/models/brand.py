"""Brand / company profile for multi-brand intelligence."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Brand(Base):
    __tablename__ = "brands"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    company_context: Mapped[str] = mapped_column(Text, nullable=False)
    analysis_instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    email_subject_prefix: Mapped[str | None] = mapped_column(String, nullable=True)
    categories: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON array of category defs
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    onboarded_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    onboarded_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
