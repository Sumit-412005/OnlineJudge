// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import instance from './api';
// import Cookies from 'js-cookie';
// import { FaSignOutAlt, FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';

// function AdminDashboard() {
//   const [problems, setProblems] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         const response = await instance.get('/api/v2/getAllProblems');
//         setProblems(response.data.problems);
//       } catch (error) {
//         console.error('Failed to fetch problems', error);
//       }
//     };

//     fetchProblems();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error('No token found');
//       }
//       await instance.delete(`/api/v2/deleteProblem/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setProblems(problems.filter(problem => problem._id !== id));
//     } catch (error) {
//       console.error('Failed to delete problem', error);
//     }
//   };

//   const handleLogout = () => {
//     Cookies.remove('authToken');
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-lg">
//         <h1 className="text-4xl font-extrabold tracking-wide flex items-center">
//           <FaPlus className="inline-block mr-2" />
//           Admin Dashboard
//         </h1>
//         <button
//           onClick={handleLogout}
//           className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 ml-2 mr-6"
//         >
//           <FaSignOutAlt className="mr-1" />
//           Logout
//         </button>
//       </header>
//       <main className="container mx-auto p-4">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 underline">Problems List</h2>
//             <Link to="/create-problem">
//               <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//                 <FaPlus className="mr-2" />
//                 Create Problem
//               </button>
//             </Link>
//           </div>
//           {problems.length === 0 ? (
//             <p className="text-gray-800 text-lg font-semibold">No problems available at the moment.</p>
//           ) : (
//             <ul className="space-y-4">
//               {problems.map((problem) => (
//                 <li key={problem._id} className="border-b pb-4 flex justify-between items-center font-medium">
//                   <span className="text-lg font-semibold">{problem.problemName}</span>
//                   <div className="flex flex-row space-x-2 font-semibold">
//                     <Link to={`/problems/edit/${problem._id}`}>
//                       <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center">
//                         <FaEdit className="mr-2" />
//                         Edit
//                       </button>
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(problem._id)}
//                       className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
//                     >
//                       <FaTrashAlt className="mr-2" />
//                       Delete
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default AdminDashboard;




import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import instance from './api';
import Cookies from 'js-cookie';
import {
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaCode,
} from 'react-icons/fa';

function AdminDashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await instance.get('/api/v2/getAllProblems');
        setProblems(response.data.problems);
      } catch (error) {
        console.error('Failed to fetch problems', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this problem?'
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found');
      }

      await instance.delete(`/api/v2/deleteProblem/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProblems((currentProblems) =>
        currentProblems.filter((problem) => problem._id !== id)
      );
    } catch (error) {
      console.error('Failed to delete problem', error);
    }
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Also remove any existing cookie token
    Cookies.remove('token');
    Cookies.remove('authToken');

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            to="/adminDashboard"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <FaCode className="text-lg" />
            </div>

            <div>
              <h1 className="text-lg font-bold">
                Online Judge
              </h1>

              <p className="text-xs text-slate-400">
                Admin Dashboard
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
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

          <div>
            <p className="text-sm text-blue-400 font-medium mb-2">
              Administration
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Manage Problems
            </h2>

            <p className="text-slate-400">
              Create, edit and manage coding problems for users.
            </p>
          </div>

          <Link
            to="/create-problem"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            <FaPlus size={14} />
            Create Problem
          </Link>

        </div>

        {/* Statistics */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-5 py-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FaCode className="text-blue-400" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Total Problems
              </p>

              <p className="text-lg font-bold text-white">
                {problems.length}
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="text-slate-400">
              Loading problems...
            </div>
          </div>
        ) : problems.length === 0 ? (

          /* Empty State */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <FaCode className="text-blue-400 text-2xl" />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              No problems available
            </h3>

            <p className="text-slate-400 mb-6">
              Create your first coding problem to get started.
            </p>

            <Link
              to="/create-problem"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition"
            >
              <FaPlus size={13} />
              Create Problem
            </Link>
          </div>

        ) : (

          /* Problems */
          <div className="space-y-4">

            {problems.map((problem, index) => (

              <div
                key={problem._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  {/* Problem Information */}
                  <div className="flex items-start gap-4">

                    <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-semibold text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {problem.problemName}
                      </h3>

                      {problem.difficulty && (
                        <span className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
                          {problem.difficulty}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">

                    <Link
                      to={`/problems/edit/${problem._id}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-white transition"
                    >
                      <FaEdit size={14} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                      <FaTrashAlt size={14} />
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;