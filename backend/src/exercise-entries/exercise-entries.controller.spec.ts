import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseEntriesController } from './exercise-entries.controller';

describe('ExerciseEntriesController', () => {
  let controller: ExerciseEntriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseEntriesController],
    }).compile();

    controller = module.get<ExerciseEntriesController>(ExerciseEntriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
