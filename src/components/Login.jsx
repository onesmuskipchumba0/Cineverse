import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, signInWithGoogle } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      await login(email, password);
      // Redirect or handle successful login
    } catch (error) {
      setError('Failed to log in: ' + error.message);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      await signInWithGoogle();
      // Redirect or handle successful login
    } catch (error) {
      setError('Failed to sign in with Google: ' + error.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
} 