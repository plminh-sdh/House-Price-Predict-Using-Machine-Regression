"""Seed Admin User Data

Revision ID: aa98d3391cb3
Revises: ddc0bea41aa5
Create Date: 2025-05-04 02:38:48.223827

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aa98d3391cb3'
down_revision: Union[str, None] = 'ddc0bea41aa5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    conn = op.get_bind()

    # Seed Companies
    conn.execute(sa.text("""
        SET IDENTITY_INSERT companies ON;
        INSERT INTO companies (id, name) VALUES (1, 'HCMUT');
        SET IDENTITY_INSERT companies OFF;
    """))

    # Seed Projects
    conn.execute(sa.text("""
        SET IDENTITY_INSERT projects ON;
        INSERT INTO projects (id, name, company_id) VALUES (1, 'Loan Checker', 1);
        SET IDENTITY_INSERT projects OFF;
    """))

    # Seed Groups
    conn.execute(sa.text("""
        SET IDENTITY_INSERT groups ON;
        INSERT INTO groups (id, name, type, active) VALUES (1, 'HCMUT Admin', 'Admin', 1);
        SET IDENTITY_INSERT groups OFF;
    """))

    # Seed User
    user_data = {
        'id': '67f707da-daf4-4408-1e61-08dd1b3cecd8',
        'full_name': 'Admin HCMUT',
        'email': 'admin@hcmut.edu.vn',
        'username': 'admin@hcmut.edu.vn',
        'password_hash': '$2b$12$llw5qjtlMmwqV4DP52ctU.dEWW7n7dh.xN.akuwrtxo7BB/nIs2ya',
        'active': 1,
        'company_id': 1
    }

    conn.execute(sa.text("""
        INSERT INTO users (
            id, full_name, email, username, password_hash, active, company_id
        ) VALUES (
            :id, :full_name, :email, :username, :password_hash, :active, :company_id
        )
    """), user_data)

    # Group-User mapping
    conn.execute(sa.text("""
        INSERT INTO user_groups (group_id, user_id) VALUES (1, :user_id)
    """), {"user_id": user_data['id']})

    # Company-Group mapping
    conn.execute(sa.text("""
        INSERT INTO company_groups (group_id, company_id) VALUES (1, 1)
    """))

    # Claims
    claims = [
        "CreateCompany", "UpdateCompany", "DeleteCompany", "ViewCompany",
        "CreateUser", "UpdateUser", "DeleteUser", "ViewUser",
        "CreateGroup", "UpdateGroup", "DeleteGroup", "ViewGroup",
        "CreateProject", "UpdateProject", "DeleteProject", "ViewProject",
        "ViewComment", "UploadComment", "DownloadComment", "DeleteComment", "AssignCommentsToUser"
    ]

    conn.execute(sa.text("SET IDENTITY_INSERT user_claims ON;"))
    for i, claim in enumerate(claims, start=1):
        conn.execute(sa.text("""
            INSERT INTO user_claims (id, user_id, claim_type, claim_value, group_id)
            VALUES (:id, :user_id, :claim_type, 'True', 1)
        """), {"id": i, "user_id": user_data['id'], "claim_type": claim})
    conn.execute(sa.text("SET IDENTITY_INSERT user_claims OFF;"))


def downgrade():
    # Optional: remove inserted data by ID
    pass
