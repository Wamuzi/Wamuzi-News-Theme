
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    
    setIsSubmitting(true);
    try {
      await register(username, email, password);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to register.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-light-surface rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-text-primary">Create a new account</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-200 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-700 border border-green-200 rounded-md text-sm">
              {success}
            </div>
          )}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-primary">
              Username
            </label>
            <div className="mt-1">
              <input id="username" name="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email-address"  className="block text-sm font-medium text-text-primary">
              Email address
            </label>
            <div className="mt-1">
              <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-text-primary">
              Password
            </label>
            <div className="mt-1">
              <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || !!success}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50"
            >
              {isSubmitting ? <LoadingSpinner /> : 'Register'}
            </button>
          </div>
        </form>
         <p className="text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-blue hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
