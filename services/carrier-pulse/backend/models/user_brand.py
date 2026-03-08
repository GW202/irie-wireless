"""Many-to-many relationship between users and brands for access control."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class UserBrand(Base):
    __tablename__ = "user_brands"
    __table_args__ = (UniqueConstraint("user_id", "brand_id", name="uq_user_brand"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    brand_id: Mapped[int] = mapped_column(Integer, ForeignKey("brands.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
