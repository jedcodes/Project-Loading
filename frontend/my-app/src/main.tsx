import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { AdminDashboard, GamePage,  Landing, Lobby, Home, AuthPage, ErrorPage, GamePin } from './pages'
import { ProtectedRoute } from './components'
import { AuthContextProvider } from './context/authContext'


 const queryClient = new QueryClient()

 const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorPage />
  },
  {
    path: "/join",
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: "/lobby/:gameBoardId",
    element: <Lobby />,
    errorElement: <ErrorPage />
  },
  {
    path: "/game",
    element: <GamePage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/gamepin",
    element: <GamePin />,
    errorElement: <ErrorPage />
  },
  {
    path: "/auth",
    element: <AuthPage />,
    errorElement: <ErrorPage />
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
