// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from 'react-icons/fi';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import instance from './api';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLoginSuccess = () => {
//     toast.success('Successfully logged in');
//   };

//   const handleLoginError = () => {
//     toast.error('Invalid credentials, please try again.');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const response = await instance.post('/api/v1/login', { email, password });

//       if (response.data.success) {
//         const { token, user } = response.data;
//         localStorage.setItem('token', token);

//         if (user.role === 'Admin') {
//           navigate('/adminDashboard');
//         } else {
//           navigate('/userDashboard');
//         }
//         handleLoginSuccess();
//       }
//     } catch (error) {
//       console.log(error);
//       handleLoginError();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const redirectToHomepage = () => {
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="absolute top-4 left-4 cursor-pointer text-gray-600" onClick={redirectToHomepage}>
//         <FiArrowLeft size={24} />
//       </div>
//       <form className="bg-white p-8 rounded shadow-md" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold  text-gray-800 mb-6">Welcome to Login Page</h2>
//         <div className="mb-4">
//           <label className="block text-gray-700">Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//             required
//           />
//         </div>
//         <button type="submit" className="w-full bg-blue-500 text-white px-3 py-2 rounded">
//           {isLoading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from './api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    toast.success('Successfully logged in');
  };

  const handleLoginError = () => {
    toast.error('Invalid credentials, please try again.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await instance.post('/api/v1/login', {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);

        if (user.role === 'Admin') {
          navigate('/adminDashboard');
        } else {
          navigate('/userDashboard');
        }

        handleLoginSuccess();
      }
    } catch (error) {
      console.log(error);
      handleLoginError();
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToHomepage = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative">

      {/* Back Button */}
      <button
        type="button"
        onClick={redirectToHomepage}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition"
      >
        <FiArrowLeft size={20} />
        <span className="text-sm">Back to Home</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md">

        {/* Heading */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-600/20">
            <FiLogIn className="text-white text-2xl" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>

          <p className="text-slate-400">
            Sign in to continue solving problems
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl"
        >

          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email
            </label>

            <div className="relative">
              <FiMail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Password
            </label>

            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold transition"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {/* Signup */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-blue-400 hover:text-blue-300 font-medium transition"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;