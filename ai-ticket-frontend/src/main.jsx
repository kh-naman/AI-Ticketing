import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CheckAuth from './components/CheckAuth.jsx'
import Tickets from './pages/tickets.jsx'
import Ticket from './pages/ticket.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Admin from './pages/admin.jsx'
import Navbar from './components/navbar.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar/ >
      <Routes>
        <Route
          path = "/"
          element={
            <CheckAuth protectedRoute={true}>
              <Tickets/>
            </CheckAuth>
          }
        />
        <Route
          path = "/tickets/:id"
          element={
            <CheckAuth protectedRoute={true}>
              <Ticket />
            </CheckAuth>
          }
        />
        <Route
          path = "/login"
          element={
            <CheckAuth protectedRoute={false}>
              <Login />
            </CheckAuth>
          }
        />
        <Route
          path = "/signup"
          element={
            <CheckAuth protectedRoute={false}>
              <Signup />
            </CheckAuth>
          }
        />
        <Route
          path = "/admin"
          element={
            <CheckAuth protectedRoute={true}>
              <Admin />
            </CheckAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
