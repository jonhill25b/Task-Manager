import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('https://task-manager-xmq4.onrender.com/api/auth/register', {
        username,
        email,
        password
      });

      setSuccess('Account created cleanly! Redirecting to login portal...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration structural failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center grow px-6 py-12">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold tracking-tight text-white text-center mb-2">Create Account</h2>
        <p className="text-sm text-zinc-400 text-center mb-8">Register a profile to deploy the task app</p>

        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-400 text-xs font-semibold p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-950/50 border border-emerald-900 text-emerald-400 text-xs font-semibold p-3 rounded-md mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="name@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2.5 rounded-md shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Creating Credentials...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Already registered?{' '}
          <Link to="/login" className="text-amber-500 hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}