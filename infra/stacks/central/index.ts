import * as cdk from '@aws-cdk/core';
// import SecretsStack from './secrets.stack';
import StorageStack from './storage.stack';
import { createSsmParameters } from '../../utils/ssm';

interface ExtendedEnvironment extends cdk.Environment {
  name: string;
}

interface ExtendedStackProps extends cdk.StackProps {
  env: ExtendedEnvironment;
}

const ssmKeys = {
  USER_ASSETS_BUCKET_NAME: '/central/storage/userAssetsBucketName',
  USER_ASSETS_BUCKET_ARN: '/central/storage/userAssetsBucketArn',
};
export class CentralStack extends cdk.Stack {
  public readonly userPoolId;
  public readonly lambdaAccessRoleForAuthPoolsArn;
  public readonly buckets;

  constructor(scope: cdk.Construct, id: string, props: ExtendedStackProps) {
    super(scope, id, props);

    const {
      env: { name: envName, account },
    } = props;

    /**
     *
     * Storage stack
     */

    const {
      userAssetsBucket,
      // Bucket Policies
      userAssetsReadPolicy,
    } = StorageStack({ scope: this, envName });

    const buckets = {
      userAssetsBucket,
    }

    this.buckets = buckets;

  
    /**
     *
     * SSM outputs
     */

    createSsmParameters({
      scope: this,
      envName,
      keyValues: {  
        // Generated
        [ssmKeys.USER_ASSETS_BUCKET_NAME]: userAssetsBucket.bucketName,
        [ssmKeys.USER_ASSETS_BUCKET_ARN]: userAssetsBucket.bucketArn,
      },
    });

    /**
     *
     * Tags
     */
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    cdk.Tags.of(this).add('app', 'truman');
    cdk.Tags.of(this).add('project', 'backend');
    cdk.Tags.of(this).add('stack', 'central');
    cdk.Tags.of(this).add('env', envName);
    cdk.Tags.of(this).add('date', today.toDateString());
  }
}

export { ssmKeys };
