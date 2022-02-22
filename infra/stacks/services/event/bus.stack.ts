import * as cdk from '@aws-cdk/core';
import { EventBus } from '@aws-cdk/aws-events';

interface Props {
  scope: cdk.Construct;
  envName: string;
}

const EventStack = (props: Props) => {
  const { envName, scope } = props;

  const eventBus = new EventBus(scope, 'TrumanEventBus', {
    eventBusName: `domainDBEventBus-${envName}`,
  });

  return {
    eventBus,
  };
};

export default EventStack;