"""add_hex_to_druid

Revision ID: 8eeb592d5c06
Revises: 6c6a820f1c94
Create Date: 2018-04-06 08:24:48.284628

"""

# revision identifiers, used by Alembic.
revision = '8eeb592d5c06'
down_revision = '6c6a820f1c94'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('columns', sa.Column('is_hex', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('columns', 'is_hex')
    # ### end Alembic commands ###
