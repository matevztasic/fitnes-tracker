import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseEntryDto } from './dto/create-exercise-entry.dto';

@Injectable()
export class ExerciseEntriesService {
    constructor(private prisma: PrismaService) {}

    private async recalculatePersonalBest(userId: number, exerciseId: number) {
        const entries = await this.prisma.exerciseEntry.findMany({
            where: {
                exerciseId,
                workout: {
                    userId,
                },
            },
            orderBy: [{ createdAt: 'asc' }],
        });

        if (entries.length === 0) {
            return;
        }

        let best = entries[0];

        for (const entry of entries) {
            const bestWeight = best.weight ?? 0;
            const currentWeight = entry.weight ?? 0;

            if (currentWeight > bestWeight) {
                best = entry;
            } else if (currentWeight === bestWeight && entry.reps > best.reps) {
                best = entry;
            }
        }

        await this.prisma.exerciseEntry.updateMany({
            where: {
                exerciseId,
                workout: {
                    userId,
                },
            },
            data: {
                isPersonalBest: false,
            },
        });

        await this.prisma.exerciseEntry.update({
            where: { id: best.id },
            data: {
                isPersonalBest: true,
            },
        });
    }

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

        const createdEntry = await this.prisma.exerciseEntry.create({
            data: {
                workoutId: dto.workoutId,
                exerciseId: dto.exerciseId,
                sets: dto.sets,
                reps: dto.reps,
                weight: dto.weight,
                isPersonalBest: false,
            },
        });

        await this.recalculatePersonalBest(userId, dto.exerciseId);

        return this.prisma.exerciseEntry.findUnique({
            where: { id: createdEntry.id },
            include: {
                exercise: true,
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