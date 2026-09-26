import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaCode,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import instance from './api';
import Select from 'react-select';
import AceEditor from 'react-ace';
import ClipLoader from 'react-spinners/ClipLoader';

import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';

const languageOptions = [
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
];

function SolveProblem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [solution, setSolution] = useState('');
  const [language, setLanguage] = useState(languageOptions[2]);
  const [verdict, setVerdict] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await instance.get(`/api/v2/getProblem/${id}`);
        setProblem(response.data.problem);
      } catch (error) {
        setError('Failed to fetch the problem');
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!solution.trim()) {
      setVerdict({
        message: 'Please enter a solution before submitting.',
        color: 'red',
      });
      setSubmissionDetails(null);
      return;
    }

    setLoading(true);
    setVerdict(null);
    setSubmissionDetails(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await instance.post(
        `/api/v2/submitSolution/${id}`,
        {
          code: solution,
          language: language.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const finalVerdict = response.data.finalVerdict;

        if (finalVerdict === 'Accepted') {
          setVerdict({
            message: 'Accepted',
            color: 'green',
          });
          setSubmissionDetails(null);
        } else if (finalVerdict === 'Wrong Answer') {
          setVerdict({
            message: `Wrong Answer: Failed on test case ${response.data.failedTestCase}`,
            color: 'red',
          });
          setSubmissionDetails(null);
        } else {
          setVerdict({
            message: finalVerdict || 'Incorrect Code',
            color: 'red',
          });

          const failedTestCase = response.data.failedTestCase;
          const failedResult =
              response.data.results?.find(
                (result) => result.verdict === finalVerdict
              ) || response.data.results?.[0];

            if (failedResult?.actualOutput) {
              setSubmissionDetails(failedResult.actualOutput);
            } else {
              setSubmissionDetails(null);
            }
        }
      } else {
        setVerdict({
          message: response.data.error || 'Submission failed',
          color: 'red',
        });
        setSubmissionDetails(null);
      }
    } catch (error) {
      console.error('Failed to submit solution', error);

      setVerdict({
        message:
          error.response?.data?.error ||
          error.message ||
          'Failed to submit solution',
        color: 'red',
      });

      setSubmissionDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictClasses = () => {
    if (verdict?.color === 'green') {
      return 'bg-green-500/10 border-green-500/20 text-green-400';
    }

    return 'bg-red-500/10 border-red-500/20 text-red-400';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <FaTimesCircle className="text-red-400 text-4xl mx-auto mb-4" />

          <h2 className="text-xl font-bold text-white mb-2">
            Something went wrong
          </h2>

          <p className="text-slate-400 mb-6">
            {error}
          </p>

          <button
            onClick={() => navigate('/userDashboard')}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <ClipLoader
          color="#3b82f6"
          loading={true}
          size={45}
        />

        <p className="text-slate-400 mt-4">
          Loading problem...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-[1600px] mx-auto px-5 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <FaCode />
            </div>

            <div>
              <h1 className="font-bold text-lg">
                Online Judge
              </h1>

              <p className="text-xs text-slate-400">
                Problem Solving
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/userDashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <FaArrowLeft size={14} />
            Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Problem Panel */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            {/* Problem Header */}
            <div className="px-6 py-5 border-b border-slate-800">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {problem.problemName}
              </h2>

              {problem.difficulty && (
                <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                  {problem.difficulty}
                </span>
              )}
            </div>

            {/* Problem Statement */}
            <div className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">
                Problem Statement
              </h3>

              <div className="text-slate-300 leading-7 whitespace-pre-wrap text-[15px]">
                {problem.problemStatement}
              </div>
            </div>

          </section>

          {/* Editor Panel */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-[650px]">

            {/* Editor Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>
                <h3 className="font-semibold text-white">
                  Your Solution
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Write, compile and submit your code
                </p>
              </div>

              <div className="w-full sm:w-44">
                <Select
                  value={language}
                  onChange={setLanguage}
                  options={languageOptions}
                  isSearchable={false}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '10px',
                      minHeight: '42px',
                      boxShadow: 'none',
                    }),

                    singleValue: (provided) => ({
                      ...provided,
                      color: '#e2e8f0',
                    }),

                    input: (provided) => ({
                      ...provided,
                      color: '#e2e8f0',
                    }),

                    placeholder: (provided) => ({
                      ...provided,
                      color: '#94a3b8',
                    }),

                    menu: (provided) => ({
                      ...provided,
                      backgroundColor: '#1e293b',
                      zIndex: 9999,
                    }),

                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused
                        ? '#334155'
                        : '#1e293b',
                      color: '#e2e8f0',
                      cursor: 'pointer',
                    }),
                  }}
                />
              </div>

            </div>

            {/* Editor */}
            <div className="flex-1 p-4">
              <div className="rounded-xl overflow-hidden border border-slate-800 h-full">
                <AceEditor
                  mode={language.value === 'cpp' ? 'c_cpp' : language.value}
                  theme="dracula"
                  value={solution}
                  onChange={setSolution}
                  width="100%"
                  height="100%"
                  minLines={25}
                  maxLines={35}
                  fontSize={14}
                  showPrintMargin={false}
                  highlightActiveLine={true}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 4,
                  }}
                  placeholder="Write your solution here..."
                />
              </div>
            </div>

            {/* Submit Section */}
            <div className="px-5 pb-5">

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold transition"
              >
                {loading ? 'Evaluating...' : 'Submit Solution'}
              </button>

              {/* Loading */}
              {loading && (
                <div className="flex justify-center items-center gap-3 mt-5">
                  <ClipLoader
                    color="#3b82f6"
                    loading={true}
                    size={28}
                  />

                  <span className="text-sm text-slate-400">
                    Running your solution...
                  </span>
                </div>
              )}

              {/* Verdict */}
              {!loading && verdict && (
                <>
                  <div
                    className={`mt-5 border rounded-xl px-4 py-3 flex items-center gap-3 ${getVerdictClasses()}`}
                  >
                    {verdict.color === 'green' ? (
                      <FaCheckCircle />
                    ) : (
                      <FaTimesCircle />
                    )}

                    <span className="font-semibold">
                      {verdict.message}
                    </span>
                  </div>

                  {/* Detailed Error */}
                  {submissionDetails && (
                    <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-800">
                        <h4 className="text-sm font-semibold text-slate-200">
                          Error Details
                        </h4>
                      </div>

                      <pre className="p-4 text-sm text-red-300 whitespace-pre-wrap overflow-x-auto">
                        {submissionDetails}
                      </pre>
                    </div>
                  )}
                </>
              )}

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}

export default SolveProblem;