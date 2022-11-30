import { Injectable } from '@nestjs/common';
import { Prisma, Todo } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.TodoCreateInput): Promise<Todo> {
    return this.prisma.todo.create({data});
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TodoWhereUniqueInput;
    where?: Prisma.TodoWhereInput;
    orderBy?: Prisma.TodoOrderByWithRelationInput;
    include?: Prisma.TodoInclude;
  }): Promise<Todo[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.todo.findMany({ skip, take, cursor, where, orderBy, include});
  }
  async findAllWithName(where: Prisma.TodoWhereInput): Promise<Todo[]> {
    return this.prisma.todo.findMany({where});
  }

  async findOne(todoWhereUniqueInput: Prisma.TodoWhereUniqueInput): Promise<Todo | null> {
    return this.prisma.todo.findUnique({ where: todoWhereUniqueInput })
  }

  async update(params:{
    where: Prisma.TodoWhereUniqueInput,
    data: Prisma.TodoUpdateInput;
    }):Promise<Todo> {
    const {data, where} = params;
    return this.prisma.todo.update({
      data,
      where
    })
  }

  async finalizarTarefa(todoWhereUniqueInput: Prisma.TodoWhereUniqueInput): Promise<Todo | null> {
    return this.prisma.todo.update({
      data:{finalizado: true},
      where: todoWhereUniqueInput
    })
  }


  async remove(where: Prisma.TodoWhereUniqueInput): Promise<Todo> {
    return this.prisma.todo.delete({where});
  }
}
