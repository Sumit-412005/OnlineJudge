// // Homepage.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import Footer from './Footer';

// const Homepage = () => {
//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <div className="flex flex-col items-center justify-center flex-grow">
//         <h1 className="text-5xl font-bold text-gray-800 mb-8">Welcome to the Online Judge</h1>
//         <div className="space-x-4">
//           <Link
//             to="/login"
//             className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white px-6 py-3 rounded-md shadow-md transition-colors duration-300"
//           >
//             Login
//           </Link>
//           <Link
//             to="/signup"
//             className="bg-green-600 hover:bg-green-700 focus:bg-green-700 text-white px-6 py-3 rounded-md shadow-md transition-colors duration-300"
//           >
//             Signup
//           </Link>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Homepage;


import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaArrowRight, FaLaptopCode, FaTrophy, FaRocket } from 'react-icons/fa';
import Footer from './Footer';

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FaCode className="text-xl" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Online Judge
            </span>
          </div>

          {/* <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold"
            >
              Get Started
            </Link>
          </div> */}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <FaCode />
              Practice. Code. Compete.
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Sharpen Your Coding Skills
              <span className="block text-blue-500">
                One Problem at a Time.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Solve programming problems, test your solutions and improve
              your coding skills with support for C++, Python and Java.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-lg transition shadow-lg shadow-blue-600/20"
              >
                Signup
                <FaArrowRight />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-slate-700 hover:bg-slate-800 font-semibold text-lg transition"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5">
                <FaLaptopCode className="text-blue-500 text-xl" />
              </div>

              <h3 className="text-xl font-bold mb-3">
                Multiple Languages
              </h3>

              <p className="text-slate-400 leading-relaxed">
                Write and test solutions using C++, Python and Java.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-5">
                <FaTrophy className="text-green-500 text-xl" />
              </div>

              <h3 className="text-xl font-bold mb-3">
                Instant Verdicts
              </h3>

              <p className="text-slate-400 leading-relaxed">
                Get immediate feedback on your code with automated test cases.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-5">
                <FaRocket className="text-purple-500 text-xl" />
              </div>

              <h3 className="text-xl font-bold mb-3">
                Learn by Solving
              </h3>

              <p className="text-slate-400 leading-relaxed">
                Practice problems across different difficulty levels and improve consistently.
              </p>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-800 bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to start coding?
            </h2>

            <p className="text-slate-400 mb-8">
              Create an account and start solving problems today.
            </p>

            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition"
            >
              Create Account
              <FaArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Homepage;