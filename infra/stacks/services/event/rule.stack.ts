import * as cdk from '@aws-cdk/core';
import { EventBus, Rule } from '@aws-cdk/aws-events';
import {
  LambdaFunction as LambdaTarget,
} from '@aws-cdk/aws-events-targets';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';

interface Props {
  scope: cdk.Construct;
  envName: string;
  eventBus: EventBus;
  lambdas: Record<string, NodejsFunction>;
}

const EventStack = (props: Props): Rule[] => {
  const { envName, scope, eventBus, lambdas } = props;
  
  const rules = [
    /**
     *
     * Data
     */

     {
      name: 'DispatchDataEvent',
      source: ['data.dispatchEvent'],
      lambda: lambdas.dataEventDispatcher,
    },
  ]

  return rules;
};

export default EventStack;
