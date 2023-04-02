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

PARAMETER_PATH="/$SST_STAGE/evergreendocs/rds"


echo "AWS_PROFILE: ${PARAMETER_PATH}/host"

# Retrieve the parameter values
host=$(aws ssm get-parameter --region $AWS_REGION --name "${PARAMETER_PATH}/host" --query 'Parameter.Value' --output text --with-decryption --profile $AWS_PROFILE)
username=$(aws ssm get-parameter --region $AWS_REGION --name "${PARAMETER_PATH}/username" --query 'Parameter.Value' --output text --with-decryption --profile $AWS_PROFILE)
password=$(aws ssm get-parameter --region $AWS_REGION --name "${PARAMETER_PATH}/password" --query 'Parameter.Value' --output text --with-decryption --profile $AWS_PROFILE)
database=$(aws ssm get-parameter --region $AWS_REGION --name "${PARAMETER_PATH}/database" --query 'Parameter.Value' --output text --with-decryption --profile $AWS_PROFILE)

# Create the MySQL database URL string
db_url="mysql://${username}:${password}@${host}/${database}?sslaccept=strict"

echo $db_url