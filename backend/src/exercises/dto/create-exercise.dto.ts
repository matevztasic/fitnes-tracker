import { IsNotEmpty } from 'class-validator';

export class CreateExerciseDto {
    @IsNotEmpty()
    name: string;

    description?: string;
}