import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Injectable()
export class WorkoutsService {
    constructor(private prisma: PrismaService) {}

    async create(userId: number, dto: CreateWorkoutDto) {
        return this.prisma.workout.create({
            data: {
                title: dto.title,
                notes: dto.notes,
                workoutDate: new Date(),
                userId,
            },
        });
    }

    async findAll(userId: number) {
        return this.prisma.workout.findMany({
            where: { userId },
            include: { entries: true },
        });
    }
}
