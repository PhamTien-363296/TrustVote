
import './App.css'
import { Login } from './pages/auth/Login'
import axios from 'axios'
import {useQuery} from '@tanstack/react-query'
import { Routes ,Route,Navigate} from "react-router-dom";
import ActivateAccountPage from './pages/ActivateAccountPage'
import { AuthorizePage } from './pages/AuthorizePage'
import SetPasswordPage from './pages/SetPasswordPage'
import VotePage from './pages/VotePage'
import ResultPage from './pages/ResultPage'
import HomePage from './pages/HomePage';

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/cutri/getme');
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
      <Route path="/" element={authUser ?  <HomePage /> : <Navigate to="/login" />} />
      <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
      <Route path="/activate-account" element={<ActivateAccountPage/>}/>
      <Route path="/authorize-otp" element={<AuthorizePage/>}/>
      <Route path="/set-password" element={<SetPasswordPage/>}/>
      <Route path="/vote" element={<VotePage/>}/>
      <Route path="/result" element={<ResultPage/>}/>

    </Routes>
    </>
  )
}

export default App
