import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  // por enquanto, os dados são guardados na memória
  private todos: CreateTodoDto[] = [];

  create(createTodoDto: CreateTodoDto) {
    this.todos.push(createTodoDto);
  }

  findAll() {
    return this.todos;
  }

  findOne(id: number) {
    return this.todos.at(id);
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    this.todos[id] = updateTodoDto;
  }

  remove(id: number) {
    const removedItem = this.todos[id];
    this.todos = this.todos.filter((item) => item !== removedItem);
  }
}
