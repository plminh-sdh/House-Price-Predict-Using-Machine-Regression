enum AdminActions {
  "CreateCompany" = "CreateCompany",
  "UpdateCompany" = "UpdateCompany",
  "DeleteCompany" = "DeleteCompany",
  "ViewCompany" = "ViewCompany",

  "CreateUser" = "CreateUser",
  "UpdateUser" = "UpdateUser",
  "DeleteUser" = "DeleteUser",
  "ViewUser" = "ViewUser",

  "CreateGroup" = "CreateGroup",
  "UpdateGroup" = "UpdateGroup",
  "DeleteGroup" = "DeleteGroup",
  "ViewGroup" = "ViewGroup",

  "CreateProject" = "CreateProject",
  "UpdateProject" = "UpdateProject",
  "DeleteProject" = "DeleteProject",
  "ViewProject" = "ViewProject",

  // "ViewComment" = "ViewComment",
}

enum InitiatorActions {
  "ViewComment" = "ViewComment",
  "UploadComment" = "UploadComment",
  "AssignCommentsToUser" = "AssignCommentsToUser",
  "DownloadComment" = "DownloadComment",
  "DeleteComment" = "DeleteComment",
  "ReopenComment" = "ReopenComment",
  "EditComment" = "EditComment",
}

enum WorkflowActions {
  "ViewComment" = "ViewComment",
  "RespondToComment" = "RespondToComment",
  "AssignToAnotherSME" = "AssignToAnotherSME",
  "SubmitForReview" = "SubmitForReview",
  "DownloadComment" = "DownloadComment",
  "EditComment" = "EditComment",
}

enum EAReviewActions {
  "ViewComment" = "ViewComment",
  "RespondToComment" = "RespondToComment",
  "EditResponse" = "EditResponse",
  "AddComment" = "AddComment",
  "CompleteReviewRound" = "CompleteReviewRound",
  "DownloadComment" = "DownloadComment",
  "EditComment" = "EditComment",
}

enum PMReviewActions {
  "ViewComment" = "ViewComment",
  "RespondToComment" = "RespondToComment",
  "EditResponse" = "EditResponse",
  "AddComment" = "AddComment",
  "CompleteReviewRound" = "CompleteReviewRound",
  "DownloadComment" = "DownloadComment",
  "AssignToAnotherPM" = "AssignToAnotherPM",
  "EditComment" = "EditComment",
}

enum ClientReviewActions {
  "ViewComment" = "ViewComment",
  "RespondToComment" = "RespondToComment",
  "EditResponse" = "EditResponse",
  "AddComment" = "AddComment",
  "CompleteReview" = "CompleteReview",
  "SubmitForReview" = "SubmitForReview",
  "AssignToAnotherSME" = "AssignToAnotherSME",
  "DownloadComment" = "DownloadComment",
  "EditComment" = "EditComment",
}

export {
  AdminActions,
  InitiatorActions,
  WorkflowActions,
  EAReviewActions,
  PMReviewActions,
  ClientReviewActions,
};
