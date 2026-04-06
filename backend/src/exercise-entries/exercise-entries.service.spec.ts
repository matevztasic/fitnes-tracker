import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseEntriesService } from './exercise-entries.service';

describe('ExerciseEntriesService', () => {
  let service: ExerciseEntriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseEntriesService],
    }).compile();

    service = module.get<ExerciseEntriesService>(ExerciseEntriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
