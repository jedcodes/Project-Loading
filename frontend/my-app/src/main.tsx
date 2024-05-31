import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GamePage from "./pages/GamePage.tsx";
import LobbyPage from "./pages/LobbyPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/game",
    element: <GamePage />,
  },
  {
    path: "/lobby",
    element: <LobbyPage />,
  },

]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
