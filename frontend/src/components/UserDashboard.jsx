// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaSignOutAlt, FaCode, FaArrowRight } from 'react-icons/fa';
// import instance from './api';
// import Cookies from 'js-cookie';
// import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader

// function UserDashboard() {
//   const [problems, setProblems] = useState([]);
//   const [loading, setLoading] = useState(true); // Initialize loading state
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         const response = await instance.get('api/v2/getAllProblems');
//         setProblems(response.data.problems);
//       } catch (error) {
//         console.error('Failed to fetch problems', error);
//       } finally {
//         setLoading(false); // Set loading to false when fetching is done
//       }
//     };

//     fetchProblems();
//   }, []);

//   const handleLogout = () => {
//     // Clear the authentication token from cookies
//     Cookies.remove('token');
//     // Redirect to homepage
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r to-indigo-600 bg-gray-100 text-gray-100 font-sans">
//       <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-lg">
//         <h1 className="text-4xl font-extrabold tracking-wide flex items-center">
//           <FaCode className="inline-block mr-2" />
//           User Dashboard
//         </h1>
//         <button
//           onClick={handleLogout}
//           className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
//         >
//           <FaSignOutAlt className="mr-2" />
//           Logout
//         </button>
//       </header>
//       <main className="container mx-auto p-4">
//         {loading ? ( // Check if loading is true
//           <div className="flex justify-center items-center h-screen">
//             <ClipLoader color="#4A90E2" loading={loading} size={35} />
//           </div>
//         ) : (
//           <div className="bg-white p-6 rounded-lg shadow-xl">
//             <h2 className="text-3xl font-bold mb-6 text-gray-800">Problems List</h2>
//             {problems.length === 0 ? (
//               <p className="text-gray-600">No problems available at the moment.</p>
//             ) : (
//               <ul className="space-y-4">
//                 {problems.map((problem) => (
//                   <li key={problem._id} className="border-b pb-4 flex justify-between items-center">
//                     <Link
//                       to={`/problems/${problem._id}`}
//                       className="text-xl text-indigo-600 hover:underline font-medium flex items-center"
//                     >
//                       {problem.problemName}
//                       <FaArrowRight className="ml-2" />
//                     </Link>
//                     <Link to={`/solve-problem/${problem._id}`}>
//                       <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300">
//                         Solve Problem
//                       </button>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default UserDashboard;

// // SolveProblem.js remains unchanged with the loading spinner already added



import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSignOutAlt,
  FaCode,
  FaArrowRight,
  FaSearch,
} from 'react-icons/fa';
import instance from './api';
import Cookies from 'js-cookie';
import ClipLoader from 'react-spinners/ClipLoader';

function UserDashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await instance.get('api/v2/getAllProblems');
        setProblems(response.data.problems);
      } catch (error) {
        console.error('Failed to fetch problems', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Also remove any existing cookie token
    Cookies.remove('token');

    // Redirect to homepage
    navigate('/');
  };

  const filteredProblems = problems.filter((problem) =>
    problem.problemName?.toLowerCase().includes(search.toLowerCase())
  );

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/10 text-green-400 border-green-500/20';

      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';

      case 'hard':
        return 'bg-red-500/10 text-red-400 border-red-500/20';

      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            to="/userDashboard"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FaCode className="text-lg" />
            </div>

            <div>
              <h1 className="text-lg font-bold">
                Online Judge
              </h1>

              <p className="text-xs text-slate-400">
                User Dashboard
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Solve Problems
          </h2>

          <p className="text-slate-400">
            Practice your programming skills and improve your problem-solving ability.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={15}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>

        {/* Loading */}
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <ClipLoader
                color="#3b82f6"
                loading={loading}
                size={40}
              />

              <p className="text-slate-400">
                Loading problems...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Problem count */}
            <div className="mb-4 text-sm text-slate-500">
              {filteredProblems.length}{' '}
              {filteredProblems.length === 1 ? 'problem' : 'problems'} available
            </div>

            {/* Problems */}
            {filteredProblems.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <FaSearch className="mx-auto text-slate-600 text-3xl mb-4" />

                <h3 className="text-xl font-semibold mb-2">
                  No problems found
                </h3>

                <p className="text-slate-400">
                  Try searching with a different problem name.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProblems.map((problem) => (
                  <div
                    key={problem._id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 hover:bg-slate-900/80 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                      {/* Problem information */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">

                          <Link
                            to={`/problems/${problem._id}`}
                            className="text-xl font-semibold text-white hover:text-blue-400 transition"
                          >
                            {problem.problemName}
                          </Link>

                          {problem.difficulty && (
                            <span
                              className={`px-3 py-1 rounded-full border text-xs font-medium ${getDifficultyStyle(
                                problem.difficulty
                              )}`}
                            >
                              {problem.difficulty}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-slate-500">
                          Ready to test your solution?
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">

                        {/* <Link
                          to={`/problems/${problem._id}`}
                          className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                        >
                          View
                        </Link> */}

                        <Link
                          to={`/solve-problem/${problem._id}`}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                        >
                          Solve
                          <FaArrowRight size={13} />
                        </Link>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default UserDashboard;