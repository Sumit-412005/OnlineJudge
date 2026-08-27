// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import instance from './api';

// function EditProblem() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [problemName, setProblemName] = useState('');
//   const [problemStatement, setProblemStatement] = useState('');
//   const [difficulty, setDifficulty] = useState('Easy');
//   const [testCases, setTestCases] = useState([{ input: '', output: '' }]);

//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         const response = await instance.get(`/api/v2/getProblem/${id}`);
//         const { problemName, problemStatement, difficulty, testCases } = response.data.problem;
//         setProblemName(problemName);
//         setProblemStatement(problemStatement);
//         setDifficulty(difficulty);
//         setTestCases(testCases.map(tc => ({ _id: tc._id, input: tc.input, output: tc.output })));
//       } catch (error) {
//         console.error('Failed to fetch problem', error);
//       }
//     };

//     fetchProblem();
//   }, [id]);

//   const handleTestCaseChange = (index, field, value) => {
//     const newTestCases = [...testCases];
//     newTestCases[index][field] = value;
//     setTestCases(newTestCases);
//   };

//   const addTestCase = () => {
//     setTestCases([...testCases, { input: '', output: '' }]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token found');
//       }

//       const updatedProblem = {
//         problemName,
//         problemStatement,
//         difficulty,
//         testCases,
//         token,
//       };

//       const headers = {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       };

//       await instance.put(`/api/v2/updateProblem/${id}`, updatedProblem, { headers });

//       navigate('/adminDashboard');
//     } catch (error) {
//       console.error('Failed to update problem', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-semibold mb-6 text-center">Edit Problem</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="problemName">
//               Problem Name
//             </label>
//             <input
//               id="problemName"
//               type="text"
//               value={problemName}
//               onChange={(e) => setProblemName(e.target.value)}
//               required
//               className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="problemStatement">
//               Problem Statement
//             </label>
//             <textarea
//               id="problemStatement"
//               value={problemStatement}
//               onChange={(e) => setProblemStatement(e.target.value)}
//               required
//               className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="difficulty">
//               Difficulty
//             </label>
//             <select
//               id="difficulty"
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value)}
//               required
//               className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
//             >
//               <option value="Easy">Easy</option>
//               <option value="Medium">Medium</option>
//               <option value="Hard">Hard</option>
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Test Cases
//             </label>
//             {testCases.map((testCase, index) => (
//               <div key={index} className="mb-2">
//                 <div className="flex mb-2 space-x-2">
//                   <input
//                     type="text"
//                     placeholder="Input"
//                     value={testCase.input}
//                     onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
//                     required
//                     className="w-1/2 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Output"
//                     value={testCase.output}
//                     onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
//                     required
//                     className="w-1/2 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                 </div>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addTestCase}
//               className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               Add Test Case
//             </button>
//           </div>
//           <div className="flex justify-between items-center">
//             <button
//               type="submit"
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//             >
//               Update
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate('/adminDashboard')}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default EditProblem;




import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaCode,
  FaArrowLeft,
  FaPlus,
  FaTrash,
} from 'react-icons/fa';
import instance from './api';

function EditProblem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problemName, setProblemName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [testCases, setTestCases] = useState([
    { input: '', output: '' },
  ]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await instance.get(`/api/v2/getProblem/${id}`);

        const {
          problemName,
          problemStatement,
          difficulty,
          testCases,
        } = response.data.problem;

        setProblemName(problemName);
        setProblemStatement(problemStatement);
        setDifficulty(difficulty);

        setTestCases(
          testCases.map((tc) => ({
            _id: tc._id,
            input: tc.input,
            output: tc.output,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch problem', error);
      }
    };

    fetchProblem();
  }, [id]);

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];

    newTestCases[index][field] = value;

    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { input: '', output: '' },
    ]);
  };

  const removeTestCase = (index) => {
    if (testCases.length === 1) {
      return;
    }

    setTestCases(
      testCases.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found');
      }

      const updatedProblem = {
        problemName,
        problemStatement,
        difficulty,
        testCases,
        token,
      };

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      await instance.put(
        `/api/v2/updateProblem/${id}`,
        updatedProblem,
        { headers }
      );

      navigate('/adminDashboard');
    } catch (error) {
      console.error('Failed to update problem', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <FaCode />
            </div>

            <div>
              <h1 className="font-bold text-lg">
                Online Judge
              </h1>

              <p className="text-xs text-slate-400">
                Edit Problem
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/adminDashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <FaArrowLeft size={14} />
            Dashboard
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-sm text-blue-400 font-medium mb-2">
            Problem Management
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Edit Problem
          </h2>

          <p className="text-slate-400">
            Update the problem statement, difficulty or test cases.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8"
        >

          {/* Problem Name */}
          <div className="mb-6">
            <label
              htmlFor="problemName"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Problem Name
            </label>

            <input
              id="problemName"
              type="text"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          {/* Problem Statement */}
          <div className="mb-6">
            <label
              htmlFor="problemStatement"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Problem Statement
            </label>

            <textarea
              id="problemStatement"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              rows={8}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          {/* Difficulty */}
          <div className="mb-8">
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Difficulty
            </label>

            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
              className="w-full md:w-64 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Test Cases */}
          <div className="mb-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Test Cases
                </h3>

                <p className="text-sm text-slate-500">
                  Update or add test cases for this problem.
                </p>
              </div>

              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                <FaPlus size={12} />
                Add Test Case
              </button>

            </div>

            <div className="space-y-4">

              {testCases.map((testCase, index) => (
                <div
                  key={testCase._id || index}
                  className="bg-slate-800/60 border border-slate-700 rounded-xl p-4"
                >

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-slate-300">
                      Test Case {index + 1}
                    </span>

                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition"
                      >
                        <FaTrash size={12} />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">
                        Input
                      </label>

                      <textarea
                        value={testCase.input}
                        onChange={(e) =>
                          handleTestCaseChange(
                            index,
                            'input',
                            e.target.value
                          )
                        }
                        rows={4}
                        required
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">
                        Expected Output
                      </label>

                      <textarea
                        value={testCase.output}
                        onChange={(e) =>
                          handleTestCaseChange(
                            index,
                            'output',
                            e.target.value
                          )
                        }
                        rows={4}
                        required
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      />
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-800">

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Update Problem
            </button>

            <button
              type="button"
              onClick={() => navigate('/adminDashboard')}
              className="sm:w-40 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold transition"
            >
              Cancel
            </button>

          </div>

        </form>
      </main>
    </div>
  );
}

export default EditProblem;