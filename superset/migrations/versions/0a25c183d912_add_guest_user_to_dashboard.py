"""add guest user to dashboard

Revision ID: 0a25c183d912
Revises: f40b61083a53
Create Date: 2017-10-27 04:02:22.139461

"""

# revision identifiers, used by Alembic.
revision = '0a25c183d912'
down_revision = 'f40b61083a53'

from alembic import op

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import (Column, Integer, ForeignKey, Table,
                        ForeignKeyConstraint, PrimaryKeyConstraint)

Base = declarative_base()


dashboard_guest = Table(
    'dashboard_guest', Base.metadata,
    Column('id', Integer, primary_key=True),
    Column('user_id', Integer, ForeignKey('ab_user.id')),
    Column('dashboard_id', Integer, ForeignKey('dashboards.id'))
)


def upgrade():
    op.create_table('dashboard_guest',
        Column('id', Integer, nullable=False),
        Column('user_id', Integer, nullable=True),
        Column('dashboard_id', Integer, nullable=True),
        ForeignKeyConstraint(['dashboard_id'], ['dashboards.id'], ),
        ForeignKeyConstraint(['user_id'], ['ab_user.id'], ),
        PrimaryKeyConstraint('id'),
    )


def downgrade():
    op.drop_table('dashboard_guest')
