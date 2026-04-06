import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Injectable()
export class ExercisesService {
    constructor(private prisma: PrismaService) {}

    async create(userId: number, dto: CreateExerciseDto) {
        return this.prisma.exercise.create({
            data: {
                name: dto.name,
                description: dto.description,
                userId: userId,
            },
        });
    }

    async findAll(userId: number) {
        return this.prisma.exercise.findMany({
            where: { userId },
        });
    }

    async delete(id: number, userId: number) {
        return this.prisma.exercise.delete({
            where: { id },
        });
    }
}
