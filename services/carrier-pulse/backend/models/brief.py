"""Generated weekly intelligence brief."""

from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Brief(Base):
    __tablename__ = "briefs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    run_id: Mapped[int] = mapped_column(Integer, ForeignKey("run_logs.id"), nullable=False)
    week_of: Mapped[date] = mapped_column(Date, nullable=False)
    brief_markdown: Mapped[str] = mapped_column(Text, nullable=False)
    top_priorities: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON
    recommendations: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON
    finding_count: Mapped[int] = mapped_column(Integer, default=0)
    action_count: Mapped[int] = mapped_column(Integer, default=0)
    brand_id: Mapped[int] = mapped_column(Integer, ForeignKey("brands.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
