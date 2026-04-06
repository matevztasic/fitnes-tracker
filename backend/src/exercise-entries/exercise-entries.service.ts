import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseEntryDto } from './dto/create-exercise-entry.dto';

@Injectable()
export class ExerciseEntriesService {
    constructor(private prisma: PrismaService) {}

    async create(userId: number, dto: CreateExerciseEntryDto) {
        const workout = await this.prisma.workout.findUnique({
            where: { id: dto.workoutId },
        });

        if (!workout) {
            throw new NotFoundException('Workout not found');
        }

        if (workout.userId !== userId) {
            throw new ForbiddenException('You do not own this workout');
        }

        const exercise = await this.prisma.exercise.findUnique({
            where: { id: dto.exerciseId },
        });

        if (!exercise) {
            throw new NotFoundException('Exercise not found');
        }

        if (exercise.userId !== userId) {
            throw new ForbiddenException('You do not own this exercise');
        }

        const previousBest = await this.prisma.exerciseEntry.findFirst({
            where: {
                exerciseId: dto.exerciseId,
                workout: {
                    userId: userId,
                },
            },
            orderBy: [
                { weight: 'desc' },
                { reps: 'desc' },
            ],
        });

        let isPersonalBest = false;

        if (!previousBest) {
            isPersonalBest = true;
        } else if (dto.weight > previousBest.weight) {
            isPersonalBest = true;
        } else if (dto.weight === previousBest.weight && dto.reps > previousBest.reps) {
            isPersonalBest = true;
        }

        return this.prisma.exerciseEntry.create({
            data: {
                workoutId: dto.workoutId,
                exerciseId: dto.exerciseId,
                sets: dto.sets,
                reps: dto.reps,
                weight: dto.weight,
                isPersonalBest,
            },
        });
    }

    async findAllForWorkout(userId: number, workoutId: number) {
        const workout = await this.prisma.workout.findUnique({
            where: { id: workoutId },
        });

        if (!workout) {
            throw new NotFoundException('Workout not found');
        }

        if (workout.userId !== userId) {
            throw new ForbiddenException('You do not own this workout');
        }

        return this.prisma.exerciseEntry.findMany({
            where: { workoutId },
            include: {
                exercise: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
}
