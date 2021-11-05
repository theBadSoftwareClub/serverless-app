const awsmobile = {
    "aws_project_region": "us-west-2",
    "aws_cognito_region": "us-west-2",
    "aws_user_pools_id": "us-west-2_r2ZIrzDVd",
    "aws_user_pools_web_client_id": "6nbmjlj7bdoc3d2lf6n316n8t3",
    "oauth": {
        "domain": "exampleauth.thebadsoftwareclub.net",
        "scope": [
            "email",
            "openid",
            "profile"
        ],
        "redirectSignIn": "http://exampleapp.thebadsoftwareclub.net/",
        "redirectSignOut": "http://exampleapp.thebadsoftwareclub.net/",
        "responseType": "token"
    },
    "federationTarget": "COGNITO_USER_POOLS"
};


export default awsmobile;
