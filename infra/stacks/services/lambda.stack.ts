import * as cdk from '@aws-cdk/core';
import { Bucket, EventType } from '@aws-cdk/aws-s3';
import { LayerVersion } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import {
  Role,
  ServicePrincipal,
  Policy,
  PolicyStatement,
  PolicyDocument,
  Effect,
} from '@aws-cdk/aws-iam';
import {
  StringParameter,
} from '@aws-cdk/aws-ssm';
import {
  RetentionDays
} from '@aws-cdk/aws-logs';
import {
  LambdaDestination
} from '@aws-cdk/aws-s3-notifications';
import {
  HttpApi, 
  HttpMethod,
} from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations'

import { ssmKeys } from '../central';

interface Account {
  name: string;
  awsAccountId: number;
}

interface Props {
  scope: cdk.Construct;
  envName: string;
  lambdaAccessRoleForAuthPoolsArn: string;
}

/**
 *
 * Stack
 */

const LambdaStack = (props: Props) => {
  const {
    envName,
    scope,
    httpApi,
  } = props;


  /**
   *
   * Lambda generic access role
   */

   const lambdaAccessRoleName = `LambdaBaselineAccessRole-${envName}`;

  const lambdaAccessRole = new Role(scope, lambdaAccessRoleName, {
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    description: 'Lambda baseline access role',
    roleName: lambdaAccessRoleName,
    inlinePolicies: {
      editMemberRole: new PolicyDocument({
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['lambda:*'],
            resources: ['*'],
          }),
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['cognito-idp:*'],
            resources: ['*'],
          }),
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['events:*'],
            resources: ['*'],
          }),
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['ssm:*'],
            resources: ['*'],
          }),
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['sts:AssumeRole'],
            resources: ['*'],
          }),
        ],
      }),
    },
    managedPolicies: [
      {
        managedPolicyArn:
          'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      },
      {
        managedPolicyArn: 'arn:aws:iam::aws:policy/AmazonSSMFullAccess',
      },
    ],
  });

  /**
   *
   * Lambda Config
   */

  const commonConfig = {
    handler: 'handler',
    memorySize: 1024,
    timeout: cdk.Duration.seconds(120),
    environment: {
      ENV: envName,
    },
    logRetention: RetentionDays.ONE_WEEK,
    role: lambdaAccessRole
  }

  /**
   *
   * Data
   */

   const dataEventDispatcherName = `dataEventDispatcher-${envName}`;
   const dataEventDispatcher = new NodejsFunction(scope, dataEventDispatcherName, {
     entry: 'src/lambda/data/eventDispatcher/index.ts',
     functionName: dataEventDispatcherName,
     ...commonConfig
   });



  return {
    dataEventDispatcher,
  };
}

export default LambdaStack;


