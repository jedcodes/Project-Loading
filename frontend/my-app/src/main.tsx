import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { AdminDashboard, GamePage,  Landing, Lobby, Home } from './pages'



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
    path: "/admin",
    element: <AdminDashboard />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <QueryClientProvider client={queryClient}>
     <RouterProvider router={router} />
   </QueryClientProvider>
  </React.StrictMode>,
)
