import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import './App.css';
import { AdminCandidates } from './pages/AdminCandidates';
import { AdminLogin } from './pages/auth/AdminLogin';

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
      <Route path="/" element={authUser ? (authUser.roleND === 'admin' ? <AdminCandidates /> : <Navigate to="/login" />) : <Navigate to="/login" />} />
      <Route path="/login" element={!authUser ? <AdminLogin /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
