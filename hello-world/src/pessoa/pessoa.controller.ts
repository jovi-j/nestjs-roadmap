import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Pessoa as PessoaModel } from '@prisma/client'
import { PessoaService } from './pessoa.service';

@Controller('pessoa')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) { }

  @Post()
  async create(@Body() pessoaModel: { nome: string }): Promise<PessoaModel> {
    return this.pessoaService.create(pessoaModel);
  }

  @Get()
  findAll() {
    return this.pessoaService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pessoaService.findOne({ id: Number(id) });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() pessoaModel: { nome: string }): Promise<PessoaModel> {
    return this.pessoaService.update({ where: { id: Number(id) }, data: pessoaModel });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pessoaService.remove({ id: Number(id) });
  }
}
