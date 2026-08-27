// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from 'react-icons/fi';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import instance from './api';

// const Signup = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('User');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSignupSuccess = () => {
//     toast.success('Account created successfully');
//   };

//   const handleSignupError = (message) => {
//     toast.error(`Failed to create account: ${message}`);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await instance.post('/api/v1/signup', {
//         name,
//         email,
//         password,
//         role,
//       });
//       console.log(response);

//       if (response.data.success) {
//         handleSignupSuccess();
//         navigate('/login');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to create account, please try again';
//       setError(errorMessage);
//       handleSignupError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const redirectToHomepage = () => {
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="absolute top-4 left-4 cursor-pointer text-green-gradient" onClick={redirectToHomepage}>
//         <FiArrowLeft size={24} />
//       </div>
//       <form className="bg-white p-8 rounded shadow-md" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Welcome to the Signup Page</h2>
//         {error && (
//           <p className="text-red-500 mb-4 text-center">
//             {error}
//           </p>
//         )}

//         <div className="mb-4">
//           <label className="block text-gray-700">Name:</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//             required
//           />
//         </div>

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

//         <div className="mb-4">
//           <label className="block text-gray-700">Role:</label>
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//           >
//             <option value="User">User</option>
//             <option value="Admin">Admin</option>
//           </select>
//         </div>

//         <button type="submit" className="w-full bg-green-500 text-white px-3 py-2 rounded">
//           {isLoading ? 'Signing up...' : 'Signup'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signup;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from './api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    toast.success('Account created successfully');
  };

  const handleSignupError = (message) => {
    toast.error(`Failed to create account: ${message}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await instance.post('/api/v1/signup', {
        name,
        email,
        password,
        role,
      });

      console.log(response);

      if (response.data.success) {
        handleSignupSuccess();
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);

      const errorMessage =
        error.response?.data?.message ||
        'Failed to create account, please try again';

      setError(errorMessage);
      handleSignupError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToHomepage = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10 relative">

      {/* Back to Home */}
      <button
        type="button"
        onClick={redirectToHomepage}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition"
      >
        <FiArrowLeft size={20} />
        <span className="text-sm">Back to Home</span>
      </button>

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-600/20">
            <FiUserPlus className="text-white text-2xl" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            Create Your Account
          </h1>

          <p className="text-slate-400">
            Join the Online Judge and start solving problems
          </p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl"
        >

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Name
            </label>

            <div className="relative">
              <FiUser
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

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
          <div className="mb-5">
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
                placeholder="Create a password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Account Type
            </label>

            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold transition"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 font-medium transition"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;