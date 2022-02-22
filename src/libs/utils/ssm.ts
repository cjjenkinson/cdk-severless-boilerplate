import { SSM } from 'aws-sdk';

const ssm = new SSM();

/**
 *
 * Multiple parameters
 * @param keys
 * @returns {key, value}
 */
const getParameters = async (
  keys: string[]
): Promise<Record<string, string>> => {
  const { ENV: env } = process.env;

  const keysWithEnvPrefix = keys.map((key) => {
    // if key leads with a slash it should not be prefixed with the env name
    // i.e. it already has it
    return key.charAt(0) === '/' ? key : `/${env}/${key}`;
  });

  const ssmResult = await ssm
    .getParameters({ Names: keysWithEnvPrefix })
    .promise();

  const { Parameters } = ssmResult;

  if (!Parameters) {
    throw Error('Failed to get parameters');
  }

  const params = Parameters.reduce((acc, cur) => {
    const { Name = '', Value } = cur;
    const _name = Name.replace(`/${env}/`, '');

    return { ...acc, [_name]: Value };
  }, {}) as Record<string, string>;

  console.log('ssm', JSON.stringify(params, null, 2));

  return params;
};

/**
 *
 * Single parameter
 * @param key
 * @returns param value
 */

const getParameter = async (key: string): Promise<string> => {
  const { ENV } = process.env;

  const keyWithEnvPrefix = `/${ENV}/${key}`;

  const { Parameter } = await ssm
    .getParameter({
      Name: keyWithEnvPrefix,
    })
    .promise();

  console.log('ssm', JSON.stringify(Parameter, null, 2));

  return Parameter?.Value || '';
};

export { getParameters, getParameter };
