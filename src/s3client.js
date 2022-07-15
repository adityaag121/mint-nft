import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const REGION = "us-east-2";

// Initialize the Amazon Cognito credentials provider
const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: "us-east-2:fde41b18-2abc-4496-8611-f01215a716c4", // IDENTITY_POOL_ID
  }),
});

const bucketName = "martian-nft";

export const uploadToBucket = async (file, key, setProgress) => {
  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: file,
  };
  try {
    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });
    upload.on("httpUploadProgress", (stream) => {
      console.log(stream);
      setProgress(stream.loaded / stream.total);
    });
    // await s3.send(new PutObjectCommand(uploadParams));
    await upload.done();
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  } catch (err) {
    alert("There was an error uploading your photo: ", err.message);
    return null;
  }
};
