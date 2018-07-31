#Apollo GraphQL server on lambda with DynamoDB

npm install -g serverless
Create an user in AWS IAM and generate an access key and secret for that user.
pip install awscli --upgrade --user
export PATH=~/.local/bin:$PATH (Note: The aws binary could also be in the python directory if not in /.local/bin. 'which python' cmd to get the path. In that case add that to the PATH)
aws configure
[Enter your access key, secret and region]
serverless deploy
