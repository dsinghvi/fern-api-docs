At DevRev, we are building OneCRM that brings developers ("devs") closer to their customers ("revs"). In the coming decade, we believe developers will be capable of running their entire business with code and that DevRev will be the platform to enable this via its APIs.

Never used a DevRev API before? You’re at the right place. Let’s get started!

### DevRev object ID

Every object in DevRev is uniquely identified by an id. This globally unique id field can be found in the API response. The value SELF can be passed in as id to reference the logged in user.

The display-id visible on the DevRev UI is also accepted in the id field for better usability. ISS-69 in the below image is an example of display-id for Issues.

### Make your first API call

In this guide, we’ll make a call to the dev-users.self API to retrieve the user object created for your account on DevRev. This user object contains information such as unique identifier, full name, display name, and profile picture.

To do this, make a GET request to the DevRev server ("https://api.devrev.ai/dev-users.self") and include the PAT created in the Authorization header of the request.

In this example, we’re using curl to make the requests but you can use any tool you prefer.

```curl
curl --location --request GET 'https://api.devrev.ai/dev-users.self' \
     --header 'Authorization: <PAT>'
```

For a user named "John Smith Doe", we receive the following json response that contains all the details for this user

```json
{
  "dev_user": {
    "display_handle": "John Doe",
    "created_date": "2022-01-28T10:45:53.698Z",
    "modified_date": "2022-01-28T10:45:53.698Z",
    "profile_picture": "<logo-url-here>",
    "auth0_user_ids": ["auth0|abcd1234eca43c006913f97d"],
    "id": "don:identity:dvrv-us-1:devo/20:devu/40",
    "display_id": "DEVU-40",
    "state": "active",
    "full_name": "John Smith Doe",
    "email": "JohnDoe@devrev.ai"
  }
}
```

Congratulations! You’re all set to explore our platform.
