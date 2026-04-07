import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import api from '../api/axios';

type Exercise = {
    id: number;
    name: string;
    description?: string;
};

function ExercisesPage() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const fetchExercises = async () => {
        try {
            const response = await api.get('/exercises');
            setExercises(response.data);
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Failed to load exercises');
        }
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/exercises', { name, description });
            setName('');
            setDescription('');
            fetchExercises();
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Failed to add exercise');
        }
    };

    const handleDelete = async (id: number) => {
        setError('');

        try {
            await api.delete(`/exercises/${id}`);
            fetchExercises();
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Failed to delete exercise');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Exercises</h1>
                <p>Add, view and delete your exercises.</p>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Exercise name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {error && <p className="error-text">{error}</p>}

                <button type="submit">Add exercise</button>
            </form>

            <div className="list-grid">
                {exercises.map((exercise) => (
                    <div className="card" key={exercise.id}>
                        <h3>{exercise.name}</h3>
                        <p>{exercise.description || 'No description'}</p>
                        <button
                            type="button"
                            className="danger-btn"
                            onClick={() => handleDelete(exercise.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExercisesPage;