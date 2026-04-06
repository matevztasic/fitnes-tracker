import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('exercises')
@UseGuards(JwtGuard)
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) {}

    @Post()
    create(@Req() req: any, @Body() dto: CreateExerciseDto) {
        return this.exercisesService.create(req.user.sub, dto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.exercisesService.findAll(req.user.sub);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Req() req: any) {
        return this.exercisesService.delete(Number(id), req.user.sub);
    }
}