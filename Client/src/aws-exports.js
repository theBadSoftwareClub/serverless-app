const awsmobile = {
    "aws_project_region": `${process.env.REACT_APP_AWS_REGION}`,
    "aws_cognito_region": `${process.env.REACT_APP_AWS_REGION}`,
    "aws_user_pools_id": `${process.env.REACT_APP_AWS_REGION}_${process.env.REACT_APP_AWS_USERPOOLID}`,
    "aws_user_pools_web_client_id": `${process.env.REACT_APP_AWS_USERPOOLCLIENTID}`,
    "oauth": {
        "domain": `${process.env.REACT_APP_AWS_USERPOOLDOMAIN}`,
        "scope": [
            "email",
            "openid",
            "profile"
        ],
        "redirectSignIn": `${process.env.REACT_APP_APP_URL}`,
        "redirectSignOut": `${process.env.REACT_APP_APP_URL}`,
        "responseType": "token"
    },
    "federationTarget": "COGNITO_USER_POOLS"
};


export default awsmobile;
