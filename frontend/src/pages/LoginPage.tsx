import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('matevz@test.com');
    const [password, setPassword] = useState('123456');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
            window.location.reload();
        } catch {
            setError('Login failed');
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="error-text">{error}</p>}

                <button type="submit">Login</button>

                <p>
                    No account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;