const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

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

module.exports.handler = async (event) => {
    try {
      const { param } = event.pathParameters;
      const response = await putItem(param, event);
      console.log("DynamoDB response:", response);
  } catch (error) {
    console.error("Error saving to DynamoDB:", error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v3.0! Your function executed successfully!!!!!!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.putItem = putItem;
