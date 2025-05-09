from enum import Enum

class AccessAction(str, Enum):
    CreateCompany = "CreateCompany"
    UpdateCompany = "UpdateCompany"
    DeleteCompany = "DeleteCompany"
    ViewCompany = "ViewCompany"
    CreateUser = "CreateUser"
    UpdateUser = "UpdateUser"
    DeleteUser = "DeleteUser"
    ViewUser = "ViewUser"
    CreateGroup = "CreateGroup"
    UpdateGroup = "UpdateGroup"
    DeleteGroup = "DeleteGroup"
    ViewGroup = "ViewGroup"
    CreateProject = "CreateProject"
    UpdateProject = "UpdateProject"
    DeleteProject = "DeleteProject"
    ViewProject = "ViewProject"
