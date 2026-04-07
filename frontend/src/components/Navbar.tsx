import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">Fitness Tracker</div>

            <div className="navbar-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/exercises">Exercises</Link>
                <Link to="/workouts">Workouts</Link>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;