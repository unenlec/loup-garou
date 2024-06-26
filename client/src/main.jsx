import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/error-page.jsx';
import Accueil from './pages/accueil.jsx';
import Register from './pages/register.jsx';
import Game from './pages/game.jsx';
import Login from './pages/login.jsx';
import { Toaster } from 'react-hot-toast';
import { AuthContextProvider, AuthContext } from './context/AuthContext.jsx';
import { SocketContextProvider } from './context/SocketContext.jsx';
import Profil from './pages/profil.jsx';
//const { authUser } = useContext(AuthContext);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Accueil />,
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/profil",
    element: <Profil />
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/game",
    element: <Game />
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <SocketContextProvider>
    <AuthContextProvider>

      <RouterProvider router={router} />
      <Toaster />

    </AuthContextProvider>
  </SocketContextProvider>,
)
