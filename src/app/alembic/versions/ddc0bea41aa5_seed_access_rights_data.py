"""Seed Access Rights Data

Revision ID: ddc0bea41aa5
Revises: 9e9b7e42a391
Create Date: 2025-05-04 02:18:39.813998

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ddc0bea41aa5'
down_revision: Union[str, None] = '9e9b7e42a391'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

access_rights_table = sa.table(
    'access_rights',
    sa.column('group_type', sa.Enum(name='grouptype')),
    sa.column('access_actions', sa.String(length=500)),
)

def upgrade() -> None:
    """Insert initial access rights."""
    op.bulk_insert(access_rights_table, [
        {
            "group_type": "Admin",
            "access_actions": "|".join([
                "CreateCompany", "UpdateCompany", "DeleteCompany", "ViewCompany",
                "CreateUser", "UpdateUser", "DeleteUser", "ViewUser",
                "CreateGroup", "UpdateGroup", "DeleteGroup", "ViewGroup",
                "CreateProject", "UpdateProject", "DeleteProject", "ViewProject"
            ])
        }
    ])

def downgrade() -> None:
    """Remove seeded access rights."""
    op.execute("DELETE FROM access_rights")
