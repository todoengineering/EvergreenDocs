#!/usr/bin/env sh
# set-database-url.sh

if [ -z "$SST_STAGE" ]
then
    echo "SST_STAGE environment variable not set. Aborting."
    exit 1
fi

if [ -z "$AWS_PROFILE" ]
then
    AWS_PROFILE="default"
fi

AWS_REGION=eu-west-1

SECRET_NAME="$SST_STAGE/rds"

# Retrieve the secret ARN
secret_arn=$(aws secretsmanager describe-secret --region $AWS_REGION --query 'ARN' --output text --secret-id $SECRET_NAME --profile $AWS_PROFILE)

# Retrieve the secrets JSON
secrets=$(aws secretsmanager get-secret-value --region $AWS_REGION --secret-id $secret_arn --query SecretString --output text --profile $AWS_PROFILE)

# Extract the values from the secrets JSON
host=$(echo $secrets | jq -r '.host')
username=$(echo $secrets | jq -r '.username')
password=$(echo $secrets | jq -r '.password')
database=$(echo $secrets | jq -r '.database')

# Create the MySQL database URL string
db_url="mysql://${username}:${password}@${host}/${database}?sslaccept=strict"

echo $db_url