import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import RankingPage from './pages/RankingPage';
import AdminPage from './pages/AdminPage';
import FinalPage from './pages/FinalPage';
import ProtectedRoute from './components/ProtectedRoute';
import { isFinalMatchActive } from './utils';

const App = () => {
  const finalActive = isFinalMatchActive();
  return (
    <BrowserRouter>
      <div className="min-h-screen gradient-bg text-white">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute allowFinal>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/game"
              element={
                <ProtectedRoute>
                  <GamePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ranking"
              element={
                <ProtectedRoute allowFinal>
                  <RankingPage />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="/final"
              element={
                finalActive ? (
                  <ProtectedRoute allowFinal>
                    <FinalPage />
                  </ProtectedRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
