import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChatPage from './components/ChatPage';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading, token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (loading || !user) {
    return (
      <div className="app-loading" role="status" aria-live="polite">
        <span className="app-loading__spinner" aria-hidden />
        Loading…
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
