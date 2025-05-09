from entities.access_right import AccessRight
from enums.access_action import AccessAction
from enums.group_type import GroupType

class AccessRightFactory:
    @staticmethod
    def get_matrix() -> list[AccessRight]:
        return [
            AccessRight(GroupType.Admin, [
                AccessAction.CreateCompany,
                AccessAction.UpdateCompany,
                AccessAction.DeleteCompany,
                AccessAction.ViewCompany,
                AccessAction.CreateUser,
                AccessAction.UpdateUser,
                AccessAction.DeleteUser,
                AccessAction.ViewUser,
                AccessAction.CreateGroup,
                AccessAction.UpdateGroup,
                AccessAction.DeleteGroup,
                AccessAction.ViewGroup,
                AccessAction.CreateProject,
                AccessAction.UpdateProject,
                AccessAction.DeleteProject,
                AccessAction.ViewProject,
            ]),
        ]

    @staticmethod
    def get_actions(group_type: GroupType) -> list[AccessAction]:
        for right in AccessRightFactory.get_matrix():
            if right.group_type == group_type:
                return right.access_actions
        return []
