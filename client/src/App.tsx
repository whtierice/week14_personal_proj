import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
// import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import HomePage from './pages/HomePage';
import ExercisePage from './pages/ExercisePage';
import BoardPage from './pages/BoardPage';


function App() {
  return (
    <Router>
      <div className="App">
      <header className="App-header">  
    <h1>💪 Fitness Tracker</h1>    
    <p>운동 기록과 커뮤니티</p>      
  </header>
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/exercise" element={<ExercisePage />} />
            <Route path="/board" element={<BoardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;