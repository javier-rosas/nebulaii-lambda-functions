import boto3
import json
import os
import sys

bucket_name = os.environ['BUCKET_NAME']
s3 = boto3.client('s3')

# def is_authenticated(event):
#     # Implement your authentication logic here
#     # For example, you could check if the user is sending a valid access token in the event object
#     return True  # Return True if the user is authenticated, False otherwise


def upload_to_aws(bucket_name, file, file_name):
    try:
        s3.put_object(Bucket=bucket_name, Key=file_name, Body=file)
        url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={
                'Bucket': bucket_name,
                'Key': file_name
            },
            ExpiresIn=24 * 3600
        )

        print("Bucket name --- ", os.environ['BUCKET_NAME'])
        return {
            'statusCode': 200,
            'body': url
        }
    except FileNotFoundError:
        print("The file was not found.")
        return {
            'statusCode': 404,
            'body': 'The file was not found'
        }
    except:
        exc_type, exc_value, exc_traceback = sys.exc_info()
        print("An error occurred:", exc_type.__name__)
        print("Error message:", exc_value)
        return {
            'statusCode': 500,
            'body': 'Internal Server Error'
        }


def lambda_handler(event, context):
    # Check if the user is authenticated
    # if not is_authenticated(event):
    #     return {
    #         'statusCode': 401,
    #         'body': 'Unauthorized'
    #     }

    body = json.loads(event['body'])
    file = bytes(body['event'], encoding='UTF-8')
    res = upload_to_aws(bucket_name, file, 'test_file_3.json')

    return res