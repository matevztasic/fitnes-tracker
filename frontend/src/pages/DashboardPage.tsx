import { Link } from 'react-router-dom';

function DashboardPage() {
    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome to your fitness tracker.</p>
            </div>

            <div className="card-grid">
                <Link to="/exercises" className="card dashboard-link-card">
                    <h2>Exercises</h2>
                    <p>Create your exercise list and manage them easily.</p>
                </Link>

                <Link to="/workouts" className="card dashboard-link-card">
                    <h2>Workouts</h2>
                    <p>Create workouts and track your training sessions.</p>
                </Link>

                <div className="card">
                    <h2>Progress</h2>
                    <p>Personal best tracking is handled by the backend.</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;