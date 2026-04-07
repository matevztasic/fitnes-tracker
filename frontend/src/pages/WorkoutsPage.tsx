import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import api from '../api/axios';

type Workout = {
    id: number;
    title: string;
    notes?: string;
};

function WorkoutsPage() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const fetchWorkouts = async () => {
        try {
            const response = await api.get('/workouts');
            setWorkouts(response.data);
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Failed to load workouts');
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/workouts', { title });
            setTitle('');
            fetchWorkouts();
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Failed to add workout');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Workouts</h1>
                <p>Create workouts and view your workout list.</p>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
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
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WorkoutsPage;