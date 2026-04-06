import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('workouts')
@UseGuards(JwtGuard)
export class WorkoutsController {
    constructor(private readonly workoutsService: WorkoutsService) {}

    @Post()
    create(@Req() req: any, @Body() dto: CreateWorkoutDto) {
        return this.workoutsService.create(req.user.sub, dto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.workoutsService.findAll(req.user.sub);
    }
}
