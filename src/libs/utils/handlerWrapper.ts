import { APIGatewayEvent, Context } from "aws-lambda";

import { createLogger, Logger } from "./logger";

type LambdaOptions = {
  name: string;
};

export type EnhancedContext = Context & {
  logger: Logger;
  sentry: unknown;
};

export const lambdaWrapper = (lambda: any, options: LambdaOptions) => {
  const { name } = options;

  const logger = createLogger(name);

  return (event: APIGatewayEvent, context: Context) => {
    logger.info(`Event received - ${JSON.stringify(event)}}`);

    return lambda(event, {
      logger,
      ...context,
    });
  }
};