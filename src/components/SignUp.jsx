import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      await signup(email, password);
      // Redirect or handle successful signup
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
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
      <button type="submit">Sign Up</button>
    </form>
  );
} 