
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { BrowserRouter } from 'react-router-dom';

import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { AuthProvider2 } from './context/AuthContext2.jsx';



const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus: false
    }
  }
})

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthProvider2>
        <App />
        </AuthProvider2>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
)
