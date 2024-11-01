import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestRepository } from './request.repository';
import { Request } from './entities/request.entity';

@Injectable()
export class RequestService {
  constructor(private readonly repository: RequestRepository) {}

  create(createRequestDto: CreateRequestDto) {
    return this.repository.upsertOne(
      Request.newInstanceFromDTO(createRequestDto),
    );
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findByID(id);
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    const existingObject = await this.repository.findByID(id);
    if (updateRequestDto.name) {
      existingObject.name = updateRequestDto.name;
    }
    if (updateRequestDto.duration) {
      existingObject.duration = updateRequestDto.duration;
    }
    existingObject.updatedAt = new Date();

    return this.repository.upsertOne(existingObject);
  }

  async remove(id: string) {
    const response = await this.repository.delete(id);
    return {
      message: response ? `${id} successfully deleted` : `${id} doesnt exist`,
    };
  }
}
