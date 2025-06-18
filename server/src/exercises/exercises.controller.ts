import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get('routines/:routineId/exercises')
  async findByRoutine(@Param('routineId') routineId: string, @Request() req) {
    return this.exercisesService.findByRoutine(routineId, req.user.id);
  }

  @Get('exercises/:id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.exercisesService.findOne(id, req.user.id);
  }

  @Post('routines/:routineId/exercises')
  async create(
    @Param('routineId') routineId: string,
    @Body() createExerciseDto: CreateExerciseDto,
    @Request() req,
  ) {
    return this.exercisesService.create(routineId, createExerciseDto, req.user.id);
  }

  @Put('exercises/:id')
  async update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @Request() req,
  ) {
    return this.exercisesService.update(id, updateExerciseDto, req.user.id);
  }

  @Delete('exercises/:id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.exercisesService.remove(id, req.user.id);
    return { success: true };
  }
}