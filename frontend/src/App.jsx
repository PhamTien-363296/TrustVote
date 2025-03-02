
import './App.css'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { Home } from './pages/Home'
import axios from 'axios'
import {useQuery} from '@tanstack/react-query'
import { Routes ,Route,Navigate} from "react-router-dom";

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
    <>
   <Routes>
      <Route path="/" element={authUser ?  <Home /> : <Navigate to="/signup" />} />
      <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
    </Routes>
    </>
  )
}

export default App
