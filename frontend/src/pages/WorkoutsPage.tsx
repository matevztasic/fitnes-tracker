import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import api from '../api/axios';

type Workout = {
    id: number;
    title: string;
    notes?: string;
};

type Exercise = {
    id: number;
    name: string;
};

type ExerciseEntry = {
    id: number;
    sets: number;
    reps: number;
    weight: number;
    isPersonalBest: boolean;
    exercise: Exercise;
};

function WorkoutsPage() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [entriesByWorkout, setEntriesByWorkout] = useState<Record<number, ExerciseEntry[]>>({});
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const [entryForms, setEntryForms] = useState<
        Record<number, { exerciseId: string; sets: string; reps: string; weight: string }>
    >({});

    const fetchWorkouts = async () => {
        try {
            const response = await api.get('/workouts');
            setWorkouts(response.data);
            return response.data as Workout[];
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Failed to load workouts');
            return [];
        }
    };

    const fetchExercises = async () => {
        try {
            const response = await api.get('/exercises');
            setExercises(response.data);
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Failed to load exercises');
        }
    };

    const fetchEntriesForWorkout = async (workoutId: number) => {
        try {
            const response = await api.get(`/exercise-entries/workout/${workoutId}`);
            setEntriesByWorkout((prev) => ({
                ...prev,
                [workoutId]: response.data,
            }));
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Failed to load entries');
        }
    };

    const fetchAllEntries = async (workoutList: Workout[]) => {
        for (const workout of workoutList) {
            await fetchEntriesForWorkout(workout.id);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const workoutList = await fetchWorkouts();
            await fetchExercises();
            await fetchAllEntries(workoutList);
        };

        loadData();
    }, []);

    const handleWorkoutSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/workouts', { title });
            setTitle('');
            const workoutList = await fetchWorkouts();
            await fetchAllEntries(workoutList);
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Failed to add workout');
        }
    };

    const handleEntryInputChange = (
        workoutId: number,
        field: 'exerciseId' | 'sets' | 'reps' | 'weight',
        value: string,
    ) => {
        setEntryForms((prev) => ({
            ...prev,
            [workoutId]: {
                exerciseId: prev[workoutId]?.exerciseId || '',
                sets: prev[workoutId]?.sets || '',
                reps: prev[workoutId]?.reps || '',
                weight: prev[workoutId]?.weight || '',
                [field]: value,
            },
        }));
    };

    const handleEntrySubmit = async (e: FormEvent, workoutId: number) => {
        e.preventDefault();
        setError('');

        const form = entryForms[workoutId];

        if (!form) {
            setError('Please fill in entry data');
            return;
        }

        try {
            await api.post('/exercise-entries', {
                workoutId,
                exerciseId: Number(form.exerciseId),
                sets: Number(form.sets),
                reps: Number(form.reps),
                weight: Number(form.weight),
            });

            setEntryForms((prev) => ({
                ...prev,
                [workoutId]: {
                    exerciseId: '',
                    sets: '',
                    reps: '',
                    weight: '',
                },
            }));

            await fetchEntriesForWorkout(workoutId);
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Failed to add exercise entry');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Workouts</h1>
                <p>Create workouts and track exercise entries with reps and weight.</p>
            </div>

            <form className="form-card" onSubmit={handleWorkoutSubmit}>
                <input
                    type="text"
                    placeholder="Workout title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {error && <p className="error-text">{error}</p>}

                <button type="submit">Add workout</button>
            </form>

            <div className="list-grid">
                {workouts.map((workout) => (
                    <div className="card" key={workout.id}>
                        <h3>{workout.title}</h3>
                        <p>{workout.notes || 'No notes'}</p>

                        <form
                            className="entry-form"
                            onSubmit={(e) => handleEntrySubmit(e, workout.id)}
                        >
                            <select
                                value={entryForms[workout.id]?.exerciseId || ''}
                                onChange={(e) =>
                                    handleEntryInputChange(workout.id, 'exerciseId', e.target.value)
                                }
                            >
                                <option value="">Select exercise</option>
                                {exercises.map((exercise) => (
                                    <option key={exercise.id} value={exercise.id}>
                                        {exercise.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Sets"
                                value={entryForms[workout.id]?.sets || ''}
                                onChange={(e) => handleEntryInputChange(workout.id, 'sets', e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder="Reps"
                                value={entryForms[workout.id]?.reps || ''}
                                onChange={(e) => handleEntryInputChange(workout.id, 'reps', e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder="Weight"
                                value={entryForms[workout.id]?.weight || ''}
                                onChange={(e) => handleEntryInputChange(workout.id, 'weight', e.target.value)}
                            />

                            <button type="submit">Add entry</button>
                        </form>

                        <div className="entries-list">
                            {(entriesByWorkout[workout.id] || []).map((entry) => (
                                <div className="entry-item" key={entry.id}>
                                    <div className="entry-top">
                                        <strong>{entry.exercise.name}</strong>
                                        {entry.isPersonalBest && <span className="pb-badge">PB</span>}
                                    </div>

                                    <p>
                                        {entry.sets} sets • {entry.reps} reps • {entry.weight} kg
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WorkoutsPage;