import { Module } from '@nestjs/common';
import { ExerciseEntriesController } from './exercise-entries.controller';
import { ExerciseEntriesService } from './exercise-entries.service';

@Module({
  controllers: [ExerciseEntriesController],
  providers: [ExerciseEntriesService],
})
export class ExerciseEntriesModule {}
