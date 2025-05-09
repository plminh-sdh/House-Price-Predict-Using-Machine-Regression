from sqlalchemy import Column, Enum as PgEnum, String
from sqlalchemy.ext.hybrid import hybrid_property
from database import Base
from enums.group_type import GroupType
from enums.access_action import AccessAction

class AccessRight(Base):
    __tablename__ = "access_rights"

    group_type = Column(PgEnum(GroupType), primary_key=True)
    _access_actions = Column("access_actions", String(500), nullable=False)

    def __init__(self, group_type: GroupType, actions: list[AccessAction]):
        self.group_type = group_type
        self.access_actions = actions

    @hybrid_property
    def access_actions(self) -> list[AccessAction]:
        return [AccessAction(action) for action in self._access_actions.split('|') if action]

    @access_actions.setter
    def access_actions(self, actions: list[AccessAction]):
        self._access_actions = '|'.join(action.value for action in actions)

    def __repr__(self):
        return f"<AccessRight {self.group_type} -> {self.access_actions}>"
