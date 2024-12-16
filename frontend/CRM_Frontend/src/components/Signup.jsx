import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Validate the email domain before signup
  const isValidDomain = (email) => {
    const domain = email.split('@')[1];
    return domain === 'lawsikho.com';
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isValidDomain(email)) {
      setError('Only users with the lawsikho.com domain can sign up.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/user/signup', {
        name,
        email,
        password,
        domain,
        contact,
      });
      setSuccess('Signup successful!'); 
      setName('');
      setEmail('');
      setPassword('');
      setDomain('');
      setContact('');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-blue-900 text-white rounded-lg shadow-lg p-8 w-96">
        <h2 className="text-center text-3xl font-bold mb-8">CRIC Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Name</label>
            <div className="flex items-center bg-blue-800 p-2 rounded">
              <input
                type="text"
                placeholder="Enter name"
                className="bg-transparent w-full p-2 text-white focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Email</label>
            <div className="flex items-center bg-blue-800 p-2 rounded">
              <input
                type="email"
                placeholder="Enter email"
                className="bg-transparent w-full p-2 text-white focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Password</label>
            <div className="flex items-center bg-blue-800 p-2 rounded">
              <input
                type="password"
                placeholder="Enter password"
                className="bg-transparent w-full p-2 text-white focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Domain</label>
            <div className="flex items-center bg-blue-800 p-2 rounded">
              <input
                type="text"
                placeholder="Enter domain"
                className="bg-transparent w-full p-2 text-white focus:outline-none"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Contact Number</label>
            <div className="flex items-center bg-blue-800 p-2 rounded">
              <input
                type="text"
                placeholder="Enter contact number"
                className="bg-transparent w-full p-2 text-white focus:outline-none"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 py-2 rounded text-white font-semibold hover:bg-blue-500 transition duration-200 mb-4"
          >
            Sign Up
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && <p className="text-green-500 text-center mt-4">{success}</p>}

        <p className="text-center mt-4">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-green-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

