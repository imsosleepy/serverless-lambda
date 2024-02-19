import json
import boto3
import datetime
import os

def run(event, context):  
    s3 = boto3.client('s3')

    current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    bucket_name = os.getenv('S3_BUCKET')

    print(current_time)
    print(bucket_name)

    if not bucket_name:
        return {"statusCode": 500, "body": json.dumps({"message": "S3_BUCKET environment variable is not set"})}

    # File to upload
    file_name = '/tmp/current_time.txt'
    file_content = f'Current Time: {current_time}'
    
    # Write the current time to a file
    with open(file_name, 'w') as file:
        file.write(file_content)

    # Upload the file to S3
    try:
        response = s3.upload_file(file_name, bucket_name, file_name)
        os.remove(file_name)
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": "Failed to upload file to S3", "error": str(e)})}

    # Success response
    body = {
        "message": "File uploaded successfully to S3",
        "input": event,
    }

    return {"statusCode": 200, "body": json.dumps(body)}
