import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {Pessoa as PessoaModel} from '@prisma/client'
import { PessoaService } from './pessoa.service';

@Controller('pessoa')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Post()
  async create(@Body() PessoaModel: {nome: string}): Promise<Pessoa> {
    return this.pessoaService.create({nome});
  }

  @Get()
  findAll() {
    return this.pessoaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pessoaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePessoaDto: UpdatePessoaDto) {
    return this.pessoaService.update(+id, updatePessoaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pessoaService.remove(+id);
  }
}
