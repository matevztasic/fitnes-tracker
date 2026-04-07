import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ExercisesPage from './pages/ExercisesPage';
import WorkoutsPage from './pages/WorkoutsPage';
import Navbar from './components/Navbar';

function App() {
  const token = localStorage.getItem('token');

  return (
      <>
        {token && <Navbar />}
        <Routes>
          <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/exercises" element={token ? <ExercisesPage /> : <Navigate to="/login" />} />
          <Route path="/workouts" element={token ? <WorkoutsPage /> : <Navigate to="/login" />} />
        </Routes>
      </>
  );
}

export default App;