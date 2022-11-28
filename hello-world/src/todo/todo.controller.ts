import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo as TodoModel } from '@prisma/client';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post()
  create(@Body() todoData: { titulo: string, nomeResponsavel: string }): Promise<TodoModel> {
    const { titulo, nomeResponsavel } = todoData;
    return this.todoService.create({
      titulo,
      pessoaResponsavel: {
        connect: { nome: nomeResponsavel }
      },
      finalizado: false
    })
  }

  @Get()
  async findAll(): Promise<TodoModel[]> {
    return this.todoService.findAll({})
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne({ id: Number(id) });
  }

  @Patch(':id')
  async update(@Param('id') id: string,
    @Body() todoData: { titulo: string, nomeResponsavel: string }):
    Promise<TodoModel> {
    return this.todoService.update({
      data: todoData, where: {
        id: Number(id)
      }
    });
  }

  @Patch('/finalizar/:id')
  async finalizarTarefa(@Param('id') id: string): Promise<TodoModel> {
    return this.todoService.finalizarTarefa({ id: Number(id) });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TodoModel> {
    return this.todoService.remove({ id: Number(id) });
  }
}
