import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './style.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/auth-context';
import { ModalProvider } from './context/modal-context.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </AuthProvider> 
  </QueryClientProvider>,
)
