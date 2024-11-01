import { Injectable } from '@nestjs/common';
import { Request } from './entities/request.entity';
import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';

@Injectable()
export class RequestRepository {
  private readonly tableName = 'request';
  private readonly client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({
      region: 'ap-southeast-1',
    });
  }

  async findAll() {
    const result: Request[] = [];

    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const response = await this.client.send(command);

    if (response.Items) {
      response.Items.forEach((item) => {
        const temp = Request.newInstanceFromDynamoDBObject(item);
        result.push(temp);
      });
    }
    return result;
  }

  async findByID(requestId: string) {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        requestId: {
          S: requestId,
        },
      },
    });

    const response = await this.client.send(command);

    if (response.Item) {
      return Request.newInstanceFromDynamoDBObject(response.Item);
    }
  }

  async upsertOne(data: Request) {
    const itemObject: Record<string, AttributeValue> = {
      requestId: {
        S: data.requestId,
      },
      name: {
        S: data.name,
      },
      duration: {
        N: String(data.duration),
      },
      createdAt: {
        N: String(data.createdAt.getTime()),
      },
    };

    if (data.name) {
      itemObject.name = {
        S: data.name,
      };
    }

    if (data.duration) {
      itemObject.duration = {
        N: String(data.duration),
      };
    }

    if (data.updatedAt) {
      itemObject.updatedAt = {
        N: String(data.updatedAt.getTime()),
      };
    }

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: itemObject,
    });

    await this.client.send(command);

    return data;
  }

  async delete(requestId: string) {
    const command = new DeleteItemCommand({
      TableName: this.tableName,
      Key: {
        requestId: {
          S: requestId,
        },
      },
    });

    const response = await this.client.send(command);
    console.log(response);
    if (response) {
      return true;
    }
    return false;
  }
}
