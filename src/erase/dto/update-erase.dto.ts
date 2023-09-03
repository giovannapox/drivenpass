import { PartialType } from '@nestjs/mapped-types';
import { CreateEraseDto } from './create-erase.dto';

export class UpdateEraseDto extends PartialType(CreateEraseDto) {}
