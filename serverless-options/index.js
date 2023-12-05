const { APIGW_URL, DDB_TABLE, STAGE } = process.env;

module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v3.0! Your function executed successfully!',
        stage: STAGE,
        table: DDB_TABLE,
        apigw: APIGW_URL,
        input: event,
      },
      null,
      2
    ),
  };
};
