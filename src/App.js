import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import EditProjectPage from './pages/EditProjectPage';
import ProfilePage from './pages/ProfilePage'; 
import PrivateRoute from './PrivateRoute';
import UserProjectsPage from './pages/UserProjectsPage';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';




export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/edit/:project_id" element={<EditProjectPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:project_id"
          element={
            <PrivateRoute>
              <ProjectPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-projects/:username"
          element={
            <PrivateRoute>
              <UserProjectsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile" // ✅ Add this route
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/home" />} />
        <Route path="/projects/welcome-tasky" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}
