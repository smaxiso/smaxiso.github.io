"""Add education fields to site_config

Revision ID: add_education_fields
Revises: 
Create Date: 2026-01-20

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_education_fields'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Add education columns to site_config table
    op.add_column('site_config', sa.Column('education_degree', sa.String(), nullable=True))
    op.add_column('site_config', sa.Column('education_institution', sa.String(), nullable=True))
    op.add_column('site_config', sa.Column('education_years', sa.String(), nullable=True))

def downgrade():
    # Remove education columns
    op.drop_column('site_config', 'education_years')
    op.drop_column('site_config', 'education_institution')
    op.drop_column('site_config', 'education_degree')
