"""merge heads

Revision ID: b3fd4c7a7529
Revises: add_project_category, d6dfc9f6ca2f
Create Date: 2026-01-21 11:59:34.764173

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b3fd4c7a7529'
down_revision: Union[str, Sequence[str], None] = ('add_project_category', 'd6dfc9f6ca2f')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
