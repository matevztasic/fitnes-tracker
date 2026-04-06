import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ExerciseEntriesService } from './exercise-entries.service';
import { CreateExerciseEntryDto } from './dto/create-exercise-entry.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('exercise-entries')
@UseGuards(JwtGuard)
export class ExerciseEntriesController {
    constructor(private readonly exerciseEntriesService: ExerciseEntriesService) {}

    @Post()
    create(@Req() req: any, @Body() dto: CreateExerciseEntryDto) {
        return this.exerciseEntriesService.create(req.user.sub, dto);
    }

    @Get('workout/:workoutId')
    findAllForWorkout(@Req() req: any, @Param('workoutId') workoutId: string) {
        return this.exerciseEntriesService.findAllForWorkout(req.user.sub, Number(workoutId));
    }
}
