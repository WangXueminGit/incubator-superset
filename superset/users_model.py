from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

from flask_appbuilder.security.sqla.models import User, assoc_permissionview_role
from sqlalchemy import Column, String, ForeignKey, Sequence, UniqueConstraint
from sqlalchemy import Integer, Table, desc
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declared_attr
from flask_appbuilder import Model

assoc_permissionview_coverage = Table('ab_permission_view_coverage',
                                Model.metadata,
                                Column('id',
                                    Integer,
                                    Sequence('ab_permission_view_coverage_id_seq'),
                                    primary_key=True),
                                Column('permission_view_id',
                                    Integer,
                                    ForeignKey('ab_permission_view.id')),
                                Column('coverage_id',
                                    Integer,
                                    ForeignKey('ab_coverage.id')),
                                UniqueConstraint('permission_view_id',
                                    'coverage_id')
)

class Coverage(Model):
    __tablename__ = 'ab_coverage'

    id = Column(Integer, Sequence('ab_coverage_id_seq'), primary_key=True)
    name = Column(String(64), unique=True, nullable=False)
    permissions = relationship('PermissionView',
        secondary=assoc_permissionview_coverage, backref='coverage')

    def __repr__(self):
        return self.name


assoc_permissionview_function = Table('ab_permission_view_function',
                                Model.metadata,
                                Column('id', Integer,
                                    Sequence('ab_permission_view_function_id_seq'),
                                    primary_key=True),
                                Column('permission_view_id', Integer,
                                    ForeignKey('ab_permission_view.id')),
                                Column('function_id', Integer,
                                    ForeignKey('ab_function.id')),
                                UniqueConstraint('permission_view_id',
                                    'function_id')
)

class Function(Model):
    __tablename__ = 'ab_function'

    id = Column(Integer, Sequence('ab_function_id_seq'), primary_key=True)
    name = Column(String(64), unique=True, nullable=False)
    permissions = relationship('PermissionView',
        secondary=assoc_permissionview_function,
        backref='function')

    def __repr__(self):
        return self.name


class MyUser(User):
    coverage_id = Column(Integer, ForeignKey('ab_coverage.id'), nullable=True)
    function_id = Column(Integer, ForeignKey('ab_function.id'), nullable=True)
    coverage = relationship('Coverage', order_by="asc(Coverage.name)")
    function = relationship('Function', order_by="asc(Function.name)")
