import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateExerciseEntryDto {
    @IsInt()
    @Min(1)
    workoutId: number;

    @IsInt()
    @Min(1)
    exerciseId: number;

    @IsInt()
    @Min(1)
    sets: number;

    @IsInt()
    @Min(1)
    reps: number;

    @IsNumber()
    @Min(0)
    weight: number;
}