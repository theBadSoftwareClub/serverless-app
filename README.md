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
2. Open up the SAM template at Serverless\template.yaml and complete the parameters:
     - **Root Domain**: the top level domain name already registered in AWS
     - **AWS Account Id**: numerical Id of the account used in the certificate ARN
     - **Certificate Id**: alphanumerical Id for an ssl cert stored in ACM (CloudFront requires this cert to be in the us-east-1 Region)
     - **Hosted Zone Id**: for the Root Domain
     - **Domain Names**: for the Application, Auth Service, and API
     - **CfHostedZoneId**, which can keep its value, (unless the value specified in the AWS doc has changed: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html)
3. (optional) Update the functions in the Template to include an existing dependencies layer or make a new one from functions/dependencies
4. Deploy Serverless App to AWS with SAM CLI (or IDE plugins)
5. make the A record in Route 53 for the auth domain. (This is only required untill this roadmap issue is resolved: https://github.com/aws-cloudformation/cloudformation-coverage-roadmap/issues/241) The value can be located by looking for the app domain settings under the Cognito user pool in the console

##### Now the Serverless App should be functioning in AWS, but there is not a Client-Side App yet, for that we will use a React App: #####

6. Edit docker-compose.yml to contain Environment Variables for both the Development and Production Services: (All env variables for React must be prefixed 'REACT_APP_')
   - **Root Domain**: the same as the *Root Domain* used in the template.yaml file
   - **App Domain**: the same as the *App Domain Name* used in the template.yaml file
   - **Api Domain**: the same as the *API Domain Name* used in the template.yaml file
   - **AWS Region**: the AWS Region (e.g. us-east-1) containing the User Pool
   - **AWS User Pool Id**: the Id of the Cognito User Pool created in our template file (in the Console the 'Pool Id' value is formatted Region_Id, we want just the Id string)
   - **AWS User Pool Client Id**: the Id of the Cognito User Pool Client created in our template file (in the Console this is under the User Pool > App Client Settings as 'Id')

7. Run the Development Server from the terminal with *docker compose run development*, this will run the React App in a Dev Server at Localhost.
8. After Editing the App in development mode, a production build can be produced with *docker compose run production* 
9. To push your local build into production, run *aws s3 sync ./Client/build s3://app.domain.com --delete* , using your app domain name, which will be the same as your S3 bucket name
