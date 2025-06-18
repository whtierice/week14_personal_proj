import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkoutRecordsService } from './workout-records.service';
import { CreateWorkoutRecordDto } from './dto/create-workout-record.dto';

@Controller('workout-records')
@UseGuards(JwtAuthGuard)
export class WorkoutRecordsController {
  constructor(private readonly workoutRecordsService: WorkoutRecordsService) {}

  @Get()
  async findAll(@Request() req) {
    return this.workoutRecordsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.workoutRecordsService.findOne(id, req.user.id);
  }

  @Post()
  async create(@Body() createWorkoutRecordDto: CreateWorkoutRecordDto, @Request() req) {
    return this.workoutRecordsService.create(createWorkoutRecordDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.workoutRecordsService.remove(id, req.user.id);
    return { success: true };
  }
}