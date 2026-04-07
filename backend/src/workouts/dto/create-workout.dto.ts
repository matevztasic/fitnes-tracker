import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    notes?: string;
}