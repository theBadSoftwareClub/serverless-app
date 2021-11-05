# serverless-example

An Example of Leveraging AWS to host a Simple, scalable web Application

# Prerequisites:

- Aws Account
- Root Domain Name with record sets in Route 53  

  (need doman and hosted zone id)
- SSL Cert for route domain Stored in ACM 
- Docker and IDE on local machine (tested using PyCharm)

# Getting Started

1. Clone Repo
2. Open up the SAM template at Serverless\template.yaml
   - substitute the values for the domain name and certificate ARN
   - (optional) enter arn of a dependencies layer or make a new one from functions/dependencies
3. Deploy Serverless App to AWS with SAM CLI (or IDE plugins)
    - After deploying, a final detail is to manually make the A record in Route 53 for the auth domain. This is only required pending the resolution of this issue: https://github.com/aws-cloudformation/cloudformation-coverage-roadmap/issues/241. The value can be located by looking for the app domain settings under the Cognito user pool in the console
4. Open docker-compose.yml
   - replace environment variables (Cognito ID and Client ID will not be available until after the serverless app is deployed)
   - build and run with *docker compose up*

When the Docker services are running, a development server will be running at localhost and a production-ready build will be available in Client/build

To push the build up to AWS: *aws s3 sync ./Client/build s3://exampleapp.root.domain.com --delete*  


