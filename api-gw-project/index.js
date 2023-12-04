'use strict';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const main = async (event) => {
  const { param } = event.pathParameters;
  await putItem(param, event);
  
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v3.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};

const putItem = async (param, event) => {
  const client = new DynamoDBClient({});
  const translateConfig = { marshallOptions: { convertClassInstanceToMap: true } };
  const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);

  const command = new PutCommand({
    TableName: 'serverless-ddb-dev',
    Item: { id: param, event: event },
  });

  const response = await ddbDocClient.send(command);
  console.log('DDB Put Item:', JSON.stringify({ input: { id: param, event: event }, result: response }));
  return response;
};