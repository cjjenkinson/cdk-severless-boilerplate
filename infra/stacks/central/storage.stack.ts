


import * as cdk from '@aws-cdk/core';
import {
  Bucket,
  BlockPublicAccess,
  StorageClass
} from '@aws-cdk/aws-s3';
import {
  Policy,
  PolicyStatement,
} from '@aws-cdk/aws-iam';

/**
 *
 * Interfaces
 */

interface Props {
  scope: cdk.Construct;
  envName: string;
}

/**
 *
 * Stack
 */

const StorageStack = (props: Props) => {
  const { envName, scope } = props;

  /**
   *
   * User Uploaded Assets
   */

   const userAssetsBucketName = `truman-user-assets-${envName}`;

   const userAssetsBucket = new Bucket(scope, userAssetsBucketName, {
     versioned: false,
     bucketName: userAssetsBucketName,
     publicReadAccess: false,
     blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
     lifecycleRules: [
       {
         expiration: cdk.Duration.days(365),
         transitions: [
           {
             storageClass: StorageClass.INFREQUENT_ACCESS,
             transitionAfter: cdk.Duration.days(60),
           },
         ],
       },
     ],
   });

  const userAssetsBucketReadPolicyName = `truman-user-assets-read-${envName}`;

  const userAssetsReadPolicy = new Policy(scope, userAssetsBucketReadPolicyName, {
    policyName: userAssetsBucketReadPolicyName,
    statements: [
      new PolicyStatement({
        actions: [
          's3:ListBucket', 
          's3:GetObject' , 
          's3:GetBucketLocation'
        ],
        resources: [
          userAssetsBucket.bucketArn, 
          `${userAssetsBucket.bucketArn}/*`
        ],
      }),
    ],
  });



  return {
    userAssetsBucket,
    // Access Policies
    userAssetsReadPolicy,
  };
};

export default StorageStack;
