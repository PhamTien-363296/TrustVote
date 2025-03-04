import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import './App.css';
import { AdminLogin } from './pages/auth/AdminLogin';
import HomePage from './pages/HomePage';
import ElectionUnitsPage from './pages/ElectionUnitsPage';
import CandidatesPage from './pages/CandidatesPage';
import ResultPage from './pages/ResultPage';
import VoterPage from './pages/VoterPage';
import ElectionPage from './pages/ElectionPage';

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/auth/getme');
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={authUser ? (authUser.roleND === 'admin' ? <HomePage /> : <Navigate to="/login" />) : <Navigate to="/login" />} />
      <Route path="/login" element={!authUser ? <AdminLogin /> : <Navigate to="/" />} />

      <Route path="/election-list" element={<ElectionPage/>} />
      <Route path="/election-unit-list" element={<ElectionUnitsPage/>} />
      <Route path="/candidate-list" element={<CandidatesPage/>} />
      <Route path="/result-list" element={<ResultPage/>} />
      <Route path="/voter-list" element={<VoterPage/>} />
    </Routes>
  );
}

export default App;
