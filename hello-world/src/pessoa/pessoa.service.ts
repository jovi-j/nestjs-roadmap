import { Injectable } from '@nestjs/common';
import { Prisma, Pessoa } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PessoaService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.PessoaCreateInput): Promise<Pessoa> {
    return this.prisma.pessoa.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PessoaWhereUniqueInput;
    where?: Prisma.PessoaWhereInput;
    orderBy?: Prisma.PessoaOrderByWithRelationInput;
  }): Promise<Pessoa[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.pessoa.findMany({ skip, take, cursor, where, orderBy });
  }

  async findOne(pessoaWhereUniqueInput: Prisma.PessoaWhereUniqueInput): Promise<Pessoa | null> {
    return this.prisma.pessoa.findUnique({ where: pessoaWhereUniqueInput })
  }

  async update(params: {
    where: Prisma.PessoaWhereUniqueInput,
    data: Prisma.PessoaUpdateInput;
  }): Promise<Pessoa> {
    const { data, where } = params;
    return this.prisma.pessoa.update({
      data,
      where
    })
  }

  async remove(where: Prisma.PessoaWhereUniqueInput): Promise<Pessoa> {
    return this.prisma.pessoa.delete({ where });
  }
}
