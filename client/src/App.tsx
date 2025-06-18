import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';
// import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import HomePage from './pages/HomePage';
// import ExercisePage from './pages/ExercisePage';
import RecordsPage from './pages/RecordsPage';
import BoardPage from './pages/BoardPage';
import RoutineDetailPage from './pages/RoutineDetailPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <header className="App-header">  
              <h1>Fitness Tracker</h1>    
              <p>운동 기록과 커뮤니티</p>      
            </header>
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } />
                <Route path="/records" element={
                  <ProtectedRoute>
                    <RecordsPage />
                  </ProtectedRoute>
                } />
                <Route path="/board" element={
                  <ProtectedRoute>
                    <BoardPage />
                  </ProtectedRoute>
                } />
                <Route path="/routine/:id" element={
                  <ProtectedRoute>
                    <RoutineDetailPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;