import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Controller('routines')
@UseGuards(JwtAuthGuard)
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Get()
  async findAll(@Request() req) {
    return this.routinesService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.routinesService.findOne(id, req.user.id);
  }

  @Post()
  async create(@Body() createRoutineDto: CreateRoutineDto, @Request() req) {
    return this.routinesService.create(createRoutineDto, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoutineDto: UpdateRoutineDto,
    @Request() req,
  ) {
    return this.routinesService.update(id, updateRoutineDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.routinesService.remove(id, req.user.id);
    return { success: true };
  }
}