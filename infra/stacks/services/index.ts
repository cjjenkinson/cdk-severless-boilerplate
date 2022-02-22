import * as cdk from '@aws-cdk/core';
import { LayerVersion, Function as LambdaFunction } from '@aws-cdk/aws-lambda';
import LambdaStack from './lambda.stack';
import EventBusStack from './event/bus.stack';
import EventRuleStack from './event/rule.stack';
import { CentralStack } from '../central';
import { createSsmParameters } from '../../utils/ssm';

interface ExtendedEnvironment extends cdk.Environment {
  name: string;
}

interface ExtendedStackProps extends cdk.StackProps {
  env: ExtendedEnvironment;
  centralStack: CentralStack;
}

export class ServicesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ExtendedStackProps) {
    super(scope, id, props);

    const {
      env: { name: envName, region = '' },
      centralStack,
    } = props;

    const {
      userPoolId,
      lambdaAccessRoleForAuthPoolsArn,
    } = centralStack;
   
  
    /**
     *
     * Event bus: EventBridge
     */

    const { eventBus } = EventBusStack({
      scope: this,
      envName,
    });


    /**
     *
     * Lambda functions
     */

    const lambdas = LambdaStack({
      scope: this,
      envName,
      lambdaAccessRoleForAuthPoolsArn,
    }) as Record<string, LambdaFunction>;

    const eventRules = EventRuleStack({
      scope: this,
      envName,
      lambdas,
      eventBus,
    });
      

    /**
     *
     * Stack outputs
     */

    createSsmParameters({
      scope: this,
      envName,
      keyValues: {
        '/services/event/eventBusArn': eventBus.eventBusArn,
        '/services/event/eventBusName': eventBus.eventBusName,
      },
    });

     /**
     *
     * Stack Tags
     */

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    cdk.Tags.of(this).add('app', 'truman');
    cdk.Tags.of(this).add('project', 'backend');
    cdk.Tags.of(this).add('stack', 'services');
    cdk.Tags.of(this).add('env', envName);
    cdk.Tags.of(this).add('date', today.toDateString());
  }
}