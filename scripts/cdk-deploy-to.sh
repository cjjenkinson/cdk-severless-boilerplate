#!/usr/bin/env bash

echo "AWS_ACCESS_KEY_ID $AWS_ACCESS_KEY_ID"
echo "AWS_SECRET_ACCESS_KEY $AWS_SECRET_ACCESS_KEY"

if [[ $# -ge 2 ]]; then
    export CDK_DEFAULT_ACCOUNT=$1
    export CDK_DEFAULT_REGION=$2
    export CDK_ENVIRONMENT_NAME=$3
    export AWS_ACCESS_KEY_ID=$4
    export AWS_SECRET_ACCESS_KEY=$5
    export AWS_DEFAULT_REGION=$2
    shift; shift; shift; shift; shift; shift
    npx cdk deploy --all --require-approval never "$@" 
    exit $?
else
    echo 1>&2 "Provide account and region as first two args."
    echo 1>&2 "Additional args are passed through to cdk deploy."
    exit 1
fi