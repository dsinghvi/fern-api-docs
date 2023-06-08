Authentication to DevRev APIs requires a personal access token (PAT). A PAT is used to uniquely identify a dev user in context of a dev org and can be used by external third-party applications to access DevRev APIs on behalf of the corresponding dev user. A PAT has the same set of privileges that the owner of the PAT has on the DevRev platform.

The validity duration of a PAT is set when it is created. You cannot renew a PAT; you can only create a new PAT and update your code to use it.

For example, a VS Code plugin that pulls issues from the DevRev platform pertaining to a particular dev user will need to rely on that user’s PAT to authenticate the DevRev APIs.

If you are receiving an `invalid token` error, you can check whether the token is valid at jwt.io.

### Generate a Personal Access Token (PAT)

1. In the DevRev app, go to the relevant dev org.

2. Go to Settings > Account > Personal Access Token.

3. Click New token and follow the workflow to create your PAT.
