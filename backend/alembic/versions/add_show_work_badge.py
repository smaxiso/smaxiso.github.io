"""add show_work_badge to site_config

Revision ID: add_show_work_badge
Revises: 
Create Date: 2026-01-07 22:46:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_show_work_badge'
down_revision = None  # Update this if you have previous migrations
branch_labels = None
depends_on = None


def upgrade():
    # Add show_work_badge column to site_config table
    op.add_column('site_config', sa.Column('show_work_badge', sa.Boolean(), nullable=True, server_default='true'))


def downgrade():
    # Remove show_work_badge column
    op.drop_column('site_config', 'show_work_badge')
