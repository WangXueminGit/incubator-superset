"""empty message

Revision ID: e1baae175dfa
Revises: 32022a75076c
Create Date: 2017-04-26 16:00:34.755097

"""

# revision identifiers, used by Alembic.
revision = 'e1baae175dfa'
down_revision = '32022a75076c'

from alembic import op
import sqlalchemy as sa


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('tables', 'parquet_path')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('tables', sa.Column('parquet_path', sa.VARCHAR(length=1000), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
