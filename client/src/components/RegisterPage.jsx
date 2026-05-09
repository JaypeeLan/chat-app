import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(username, email, password);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle} className="fade-in">
        <h1 style={titleStyle}>Join the Community</h1>
        <p style={subtitleStyle}>Create an account to start chatting</p>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          {error && <p style={errorStyle}>{error}</p>}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              required
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>
        
        <p style={footerStyle}>
          Already have an account? <Link to="/login" style={linkStyle}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

// Reuse styles from LoginPage for consistency
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'
};

const cardStyle = {
  width: '100%',
  maxWidth: '400px',
  padding: '2.5rem',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  borderRadius: 'var(--border-radius)',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-md)'
};

const titleStyle = {
  fontSize: '1.8rem',
  marginBottom: '0.5rem',
  textAlign: 'center',
  fontWeight: '700'
};

const subtitleStyle = {
  color: 'var(--text-secondary)',
  textAlign: 'center',
  marginBottom: '2rem'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const labelStyle = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)'
};

const buttonStyle = {
  marginTop: '1rem',
  backgroundColor: 'var(--accent-primary)',
  color: 'white',
  padding: '0.875rem',
  borderRadius: 'var(--border-radius)',
  fontWeight: '600',
  fontSize: '1rem',
  boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)'
};

const errorStyle = {
  color: 'var(--error)',
  fontSize: '0.875rem',
  textAlign: 'center',
  padding: '0.5rem',
  background: 'rgba(239, 68, 68, 0.1)',
  borderRadius: '8px'
};

const footerStyle = {
  marginTop: '2rem',
  textAlign: 'center',
  color: 'var(--text-secondary)',
  fontSize: '0.875rem'
};

const linkStyle = {
  color: 'var(--accent-primary)',
  textDecoration: 'none',
  fontWeight: '500'
};

export default RegisterPage;
