"""Add knowledge_revisions table for RAG freshness tracking

Revision ID: a1b2c3d4e5f6
Revises: b3fd4c7a7529
Create Date: 2026-07-13 14:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = 'a1b2c3d4e5f6'
down_revision = '3333dd175a0f'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'knowledge_revisions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('version', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.execute(
        "INSERT INTO knowledge_revisions (id, version) VALUES (1, 1) "
        "ON CONFLICT (id) DO NOTHING"
    )


def downgrade():
    op.drop_table('knowledge_revisions')
