#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CentralStack } from './stacks/central';
import { ServicesStack } from './stacks/services';

import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../.env` });

const app = new cdk.App();

const {
  CDK_DEFAULT_ACCOUNT = '',
  CDK_DEFAULT_REGION = '',
  CDK_ENVIRONMENT_NAME = '',
} = process.env;

const config = {
  env: {
    account: CDK_DEFAULT_ACCOUNT || '',
    region: CDK_DEFAULT_REGION || '',
    name: CDK_ENVIRONMENT_NAME || '',
  },
};

if (config?.env?.account !== '352158704087') {
  throw new Error("Invalid AWS account ID");
}
 
const centralStack = new CentralStack(
  app,
  `CentralBackendStack-${CDK_ENVIRONMENT_NAME}`,
  config
);

const serviceStack = new ServicesStack(
  app,
  `ServicesBackendStack-${CDK_ENVIRONMENT_NAME}`,
  {
    ...config,
    centralStack,
  }
);

serviceStack.node.addDependency(centralStack);
