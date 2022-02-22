import { S3 } from "aws-sdk";
import { promisify } from "util";

export const createS3Client = ({
  accessKeyId,
  secretAccessKey
}: {
  accessKeyId: string,
  secretAccessKey: string,
}) => {
  const client = new S3({
    maxRetries: 5,
    signatureVersion: "v4",
    useAccelerateEndpoint: true,
    accessKeyId,
    secretAccessKey,
  });

  const getSignedUrl = promisify(client.getSignedUrl.bind(client));
  const getPresignedPostUrl = promisify(
    client.createPresignedPost.bind(client)
  );

  const get = async ({ bucket, key }: { bucket: string; key: string }) =>
    client
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();

  const deleteObject = async ({
    bucket,
    key,
  }: {
    bucket: string;
    key: string;
  }) =>
    client
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();

  const put = async ({
    file,
    bucket,
    key,
  }: {
    file: any;
    bucket: string;
    key: string;
  }) =>
    client
      .putObject({
        Body: file,
        Bucket: bucket,
        Key: key,
      })
      .promise();

  const generateSignedGetUrl = ({
    bucket,
    filePath,
  }: {
    bucket: string;
    filePath: string;
  }) =>
    // @ts-ignore
    getSignedUrl("getObject", {
      Bucket: bucket,
      Key: filePath,
      Expires: 30000,
    });

  const generateSignedPutUrl = ({
    bucket,
    filePath,
    metadata,
  }: {
    bucket: string;
    filePath: string;
    metadata: any;
  }) =>
    // @ts-ignore
    getSignedUrl("putObject", {
      Bucket: bucket,
      ContentType: "application/x-www-form-urlencoded; charset=UTF-8",
      Key: filePath,
      Metadata: metadata,
      Expires: 300,
    });

  const generatePresignedPostUrl = (params: any) => getPresignedPostUrl(params);

  return {
    client,
    get,
    deleteObject,
    put,
    generateSignedGetUrl,
    generateSignedPutUrl,
    generatePresignedPostUrl,
  };
};
