# Auth

Staff sign-in for ToneOp Workspace.

Phase 1 posts to the Django Workspace API (`/api/auth/login`, `/api/auth/session`). The client stores `access_token` and `workspace_user` cookies from the JSON response. Google Workspace OIDC replaces the development Google stub later.
