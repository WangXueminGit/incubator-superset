"""empty message

Revision ID: 0aa1a3cd3e97
Revises: 897a393a7025
Create Date: 2017-04-28 16:51:35.092360

"""

# revision identifiers, used by Alembic.
revision = '0aa1a3cd3e97'
down_revision = '897a393a7025'

from alembic import op
import sqlalchemy as sa


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(u'slices_table_id_fkey', 'slices', type_='foreignkey')
    op.drop_constraint(u'slices_druid_datasource_id_fkey', 'slices', type_='foreignkey')
    op.drop_column('slices', 'druid_datasource_id')
    op.drop_column('slices', 'table_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('slices', sa.Column('table_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('slices', sa.Column('druid_datasource_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key(u'slices_druid_datasource_id_fkey', 'slices', 'datasources', ['druid_datasource_id'], ['id'])
    op.create_foreign_key(u'slices_table_id_fkey', 'slices', 'tables', ['table_id'], ['id'])
    # ### end Alembic commands ###
