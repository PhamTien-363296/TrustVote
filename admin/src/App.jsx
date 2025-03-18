import { Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import { AdminLogin } from './pages/auth/AdminLogin';
import HomePage from './pages/HomePage';
import ElectionUnitsPage from './pages/ElectionUnitsPage';
import CandidatesPage from './pages/CandidatesPage';
import ResultPage from './pages/ResultPage';
import VoterPage from './pages/VoterPage';
import ElectionPage from './pages/ElectionPage';
import UserPage from './pages/UserPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { authUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={authUser ? <HomePage />  : <Navigate to="/login" />} />
      <Route path="/login" element={!authUser ? <AdminLogin /> : <Navigate to="/" />} />

      <Route path="/election-list" element={<ElectionPage/>} />
      <Route path="/election-unit-list" element={<ElectionUnitsPage/>} />
      <Route path="/candidate-list" element={<CandidatesPage/>} />
      <Route path="/result-list" element={<ResultPage/>} />
      <Route path="/voter-list" element={<VoterPage/>} />
      <Route
        path="/user-list"
        element={authUser?.roleND === 'ADMIN' ? <UserPage /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
