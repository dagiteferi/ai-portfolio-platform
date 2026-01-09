"""Add category to projects

Revision ID: add_project_category
Revises: 
Create Date: 2025-12-08 18:20:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_project_category'
down_revision = None  # Update this if you have previous migrations
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add category column to projects table."""
    # Add category column
    op.add_column('projects', sa.Column('category', sa.String(), nullable=True))
    
    # Create index for better query performance
    op.create_index(
        'ix_projects_category',
        'projects',
        ['category'],
        unique=False
    )


def downgrade() -> None:
    """Remove category column from projects table."""
    op.drop_index('ix_projects_category', table_name='projects')
    op.drop_column('projects', 'category')
