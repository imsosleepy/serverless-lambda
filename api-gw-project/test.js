'use strict';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, ScanCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const main = async (event) => {
  console.log(event);Z
//  putItem(event);
  
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

  // const putItem = async (params) => {
  //   const client = new DynamoDBClient({});
  //   const translateConfig = { marshallOptions: { convertClassInstanceToMap: true } };
  //   const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);

  //   const command = new PutCommand({
  //     TableName: DDB_TABLE,
  //     Item: { id: params },
  //   });
  
  //   const response = await ddbDocClient.send(command);
  //   console.log('DDB Put Item:', JSON.stringify({ input: { id: params }, result: response }));
  //   return response;
  // };
};
