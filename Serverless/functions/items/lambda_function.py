import boto3
import json
import uuid

from boto3.dynamodb.conditions import Key, Attr

print('Loading function')
dynamo = boto3.client('dynamodb')
table = boto3.resource('dynamodb').Table('items')

s3 = boto3.client('s3')


def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
        },
    }


def lambda_handler(event, context):
    operations = {
        'DELETE': lambda dynamo, x: dynamo.delete_item(**x),
        'GET': lambda dynamo, x: dynamo.scan(**x),
        'POST': lambda dynamo, x: dynamo.put_item(**x),
        'PUT': lambda dynamo, x: dynamo.update_item(**x),
    }

    # print('context: ', JSON.stringify(context))

    operation = event['httpMethod']
    # print('OPERATION: ', operation)
    # table = dynamo.Table('plans')

    uid = uuid.uuid4()

    uid = str(uid)
    # testTitle = {'S':uid}
    # planDoc = {'S':'Will be an S3 reference'}
    # createdBy = {'S': '3da69f28-02c5-4740-b0db-f253d926dca7'}

    if operation in operations:
        payload = {'TableName': "items"}
        if operation == 'DELETE':
            print('deleting, event: ')
            print(event)
            if 'pathParameters' in event and 'itemId' in event['pathParameters']:
                print('here')
                # remove doc from s3
                s3_response = s3.delete_object(
                    Bucket='exampleapp-data-store',
                    Key='pre_' + event['pathParameters']['itemId']
                )
                print('s3 response: ', s3_response['ResponseMetadata'])
                if s3_response['ResponseMetadata']['HTTPStatusCode'] in [200, 204]:
                    # s3 delete complete
                    print('s3 delete success')

                else:
                    print('S3 delete failed')
                # remove record from DynamoDB

                dynamokey = {'itemId': event['pathParameters']['itemId'],
                             'createdBy': event['requestContext']['authorizer']['claims']['sub']}
                print('key: ', dynamokey)
                dynamo_response = table.delete_item(Key=dynamokey)
                if dynamo_response['ResponseMetadata']['HTTPStatusCode'] in [200, 204]:
                    print('dynamo delete success')
                else:
                    print('dynamo delete failed')

                if dynamo_response['ResponseMetadata']['HTTPStatusCode'] in [200, 204] and \
                        s3_response['ResponseMetadata']['HTTPStatusCode'] in [200, 204]:
                    response = {
                        "statusCode": 200,
                        "body": "delete complete",
                        "headers": {
                            "Access-Control-Allow-Headers": "Content-Type",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "GET"
                        }
                    }

                    return response

            else:
                print('need itemId in path')
        if operation == 'PUT':
            print('updating, event:', event)
            userid = event['requestContext']['authorizer']['claims']['sub']
            response = s3.put_object(
                Body=bytes(json.dumps(json.loads(event['body'])).encode('UTF-8')),
                Metadata={'createdBy': userid},
                Bucket='exampleapp-data-store',
                Key='pre_' + event['pathParameters']['itemId']
            )

            dynamokey = {'itemId': event['pathParameters']['itemId'],
                         'createdBy': event['requestContext']['authorizer']['claims']['sub']}

            expressionattributes = {
                ':t': event['queryStringParameters']['title']
            }

            updateexpression = "set itemTitle=:t"

            results = table.update_item(Key=dynamokey, UpdateExpression=updateexpression,
                                        ExpressionAttributeValues=expressionattributes, ReturnConsumedCapacity="TOTAL")

            response = {
                "statusCode": 200,
                "body": json.dumps(results),
                "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET"
                }
            }

            return response

        if operation == 'POST':
            # body = email.parser.BytesParser().parsebytes(event['body'].encode())
            print('posting, event:', event)
            userid = event['requestContext']['authorizer']['claims']['sub']
            response = s3.put_object(
                Body=bytes(json.dumps(json.loads(event['body'])).encode('UTF-8')),
                Metadata={'createdBy': userid},
                Bucket='exampleapp-data-store',
                Key='pre_' + uid
            )

            print('s3 response: ', response)

            # payload = {'Item': { "planTitle":Title, "createdBy":createdBy, "planID":planId},
            #            'ReturnConsumedCapacity':"TOTAL"
            # }
            item = json.loads(
                json.dumps({"itemId": uid, "itemTitle": event['queryStringParameters']['title'], "createdBy": userid}))
            print('putting: ', item)
            results = table.put_item(Item=item, ReturnConsumedCapacity="TOTAL")

            response = {
                "statusCode": 200,
                "body": json.dumps(results),
                "headers": {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET"
                }
            }

            return response
        if operation == 'GET':

            if 'resource' in event and event['resource'] == '/items/createdBy':

                print('scanning table')
                print(event['requestContext'])
                results = table.scan(
                    FilterExpression=Attr('createdBy').eq(event['requestContext']['authorizer']['claims']['sub']),
                    ProjectionExpression="itemId, itemTitle")
                # print('response: ', response )
                response = {
                    "statusCode": 200,
                    "body": json.dumps(results),
                    "headers": {
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET"
                    }
                }

                return response

            elif 'pathParameters' in event and 'itemId' in event['pathParameters']:
                # print('plan id: ', event['pathParameters']['planId'])
                s3_response = s3.get_object(Bucket='exampleapp-data-store',
                                            Key='pre_' + event['pathParameters']['itemId'])

                print("Done, response body:")
                document = s3_response['Body'].read().decode('utf-8')
                # encodeddocument = base64.b64encode(jsondocument)
                # print(document)

                response = {
                    "statusCode": 200,
                    "body": document,
                    "headers": {
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET"
                    }
                }
                return response
            else:
                response = {
                    "statusCode": 200,
                    "headers": {
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET"
                    }
                }
                return response
        return respond(None, operations[operation](dynamo, payload))

    else:
        return respond(ValueError('Unsupported method "{}"'.format(operation)))
