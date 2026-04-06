import { IsNotEmpty } from 'class-validator';

export class CreateWorkoutDto {
    @IsNotEmpty()
    title: string;

    notes?: string;
}