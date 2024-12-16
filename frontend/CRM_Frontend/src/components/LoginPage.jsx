import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSecurityAnswer, setForgotSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const navigate = useNavigate();

  
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    
    const domain = email.split('@')[1];
    if (domain !== 'lawsikho.com') {
        setError('Only lawsikho.com domain users can sign up.');
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/api/user/signup', {
            name,
            email,
            contact,
            password,
            securityQuestion,   
            securityAnswer,     
        });
        setSuccess('Signup successful!');
        setEmail('');
        setPassword('');
        setName('');
        setContact('');
        setSecurityQuestion('');
        setSecurityAnswer('');
    } catch (err) {
        setError(err.response?.data?.message || 'Signup failed.');
    }
};

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/user/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
        const response = await axios.post('http://localhost:5000/api/user/forgot-password', {
            email: forgotEmail,
            securityAnswer: forgotSecurityAnswer,
            newPassword,
        });
        setSuccess('Password reset successful!');
        setForgotEmail('');
        setForgotSecurityAnswer('');
        setNewPassword('');
    } catch (err) {
        setError(err.response?.data?.message || 'Password reset failed.');
    }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-blue-900 text-white rounded-lg shadow-lg p-8 w-96">
        {isForgotPassword ? (
          
          <>
            <h2 className="text-center text-3xl font-bold mb-8">Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="bg-transparent w-full p-2 text-white focus:outline-none"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Security Answer</label>
                <input
                  type="text"
                  placeholder="Enter security answer"
                  className="bg-transparent w-full p-2 text-white focus:outline-none"
                  value={forgotSecurityAnswer}
                  onChange={(e) => setForgotSecurityAnswer(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="bg-transparent w-full p-2 text-white focus:outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button className="w-full bg-blue-600 py-2 rounded text-white font-semibold hover:bg-blue-500 transition duration-200 mb-4">
                Reset Password
              </button>
            </form>
            <p
              className="text-center text-green-400 cursor-pointer"
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Login
            </p>
          </>
        ) : (
          
          <>
            <h2 className="text-center text-3xl font-bold mb-8">{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={isLogin ? handleLogin : handleSignup}>
              {!isLogin && (
                <>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Name</label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      className="bg-transparent w-full p-2 text-white focus:outline-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold">Contact No</label>
                    <input
                      type="text"
                      placeholder="Enter contact number"
                      className="bg-transparent w-full p-2 text-white focus:outline-none"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="bg-transparent w-full p-2 text-white focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="bg-transparent w-full p-2 text-white focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {!isLogin && (
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-semibold">Security Question</label>
                  <input
                    type="text"
                    placeholder="Enter security question"
                    className="bg-transparent w-full p-2 text-white focus:outline-none"
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                  />
                </div>
              )}

              {!isLogin && (
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-semibold">Security Answer</label>
                  <input
                    type="text"
                    placeholder="Enter security answer"
                    className="bg-transparent w-full p-2 text-white focus:outline-none"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 py-2 rounded text-white font-semibold hover:bg-blue-500 transition duration-200 mb-4"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>

            {isLogin ? (
              <p className="text-center mt-4">
                Don't have an account?{' '}
                <span
                  onClick={() => setIsLogin(false)}
                  className="text-green-400 cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            ) : (
              <p className="text-center mt-4">
                Already have an account?{' '}
                <span
                  onClick={() => setIsLogin(true)}
                  className="text-green-400 cursor-pointer"
                >
                  Login
                </span>
              </p>
            )}

            {isLogin && (
              <p
                className="text-center text-green-400 cursor-pointer"
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot Password?
              </p>
            )}
          </>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
};

export default LoginPage;


