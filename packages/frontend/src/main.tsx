import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './style.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/auth-context';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider> 
    </QueryClientProvider>
  </React.StrictMode>,
)
