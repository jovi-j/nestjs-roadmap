import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  titulo: string;
  descricao: string;
  responsavel: string;
  prioridade: number;
}
