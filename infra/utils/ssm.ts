import * as cdk from '@aws-cdk/core';
import {
  StringParameter,
  ParameterType,
  ParameterTier,
} from '@aws-cdk/aws-ssm';

interface Props {
  scope: cdk.Construct;
  keyValues: Record<string, string>;
  envName: string;
}

const createSsmParameters = (props: Props): Record<string, string> => {
  const { scope, keyValues, envName } = props;

  const ssmParameters: Record<string, string> = Object.entries(
    keyValues
  ).reduce((acc, cur) => {
    const [key, value] = cur;

    // cloudformation output
    new cdk.CfnOutput(scope, key, { value });

    // add output to ssm and make available to other services
    new StringParameter(scope, `param-${key}`, {
      parameterName: `/${envName}${key}`,
      stringValue: value,
      type: ParameterType.STRING,
      tier: ParameterTier.STANDARD,
    });

    return {
      ...acc,
      [key]: value,
    };
  }, {});

  return ssmParameters;
};

export { createSsmParameters };
