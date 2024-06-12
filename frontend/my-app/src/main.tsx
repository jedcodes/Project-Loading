import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { AdminDashboard, GamePage,  Landing, Lobby, Home, AuthPage } from './pages'
import { ProtectedRoute } from './components'
import { AuthContextProvider } from './context/authContext'


 const queryClient = new QueryClient()

 const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />
  },
  {
    path: "/join",
    element: <Home />
  },
  {
    path: "/lobby",
    element: <Lobby />
  },
  {
    path: "/game",
    element: <GamePage />
  },
  {
    path: "/auth",
    element: <AuthPage />
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
       <RouterProvider router={router} />
    </AuthContextProvider>
   </QueryClientProvider>
  </React.StrictMode>,
)
