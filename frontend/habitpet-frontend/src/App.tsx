import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import ResetPasswordSentPage from './pages/Auth/ResetPasswordSentPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import HabitsPage from './pages/Habits/HabitsPage';
import PetPage from './pages/Pet/PetPage';
import AchievementsPage from './pages/Achievements/AchievementsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password/sent" element={<ResetPasswordSentPage />} />
        <Route path="/register" element={<Navigate to="/register/stage1" replace />} />
        <Route path="/register/:stage" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/pet" element={<PetPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
