import { v4 } from 'uuid';
import { CreateRequestDto } from '../dto/create-request.dto';

export class Request {
  requestId: string;
  name: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;

  static newInstanceFromDTO(data: CreateRequestDto) {
    const result = new Request();
    result.requestId = v4();
    result.name = data.name;
    result.duration = Number(data.duration);
    result.createdAt = new Date();

    return result;
  }

  static newInstanceFromDynamoDBObject(data: any): Request {
    const result = new Request();
    result.requestId = data.requestId.S;
    result.name = data.name.S;
    result.duration = Number(data.duration.N);
    result.createdAt = new Date(Number(data.createdAt.N));
    if (result.updatedAt) {
      result.updatedAt = new Date(Number(data.updatedAt.N));
    }

    return result;
  }
}
