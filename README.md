# 🖥️ Online Judge Platform (Full Stack Application Made By Sumit Singha Roy)

An online judge platform hosting coding problems and challenges. Users solve a series of coding problems. First he has to begin with registration for his account, user can register as admin or user(member). During problem solving, they submit their solutions through the platform. Once submitted, these solutions are evaluated against hidden test cases by the platform. Based on the results of these tests, user solution submission is assigned verdict. The platform provides the infrastructure to manage and execute the DSA coding problems, ensuring fair and impartial evaluation.

## 🌟 Features

- **User Authentication and Role-Based Authorization**: Secure login and role-based access.
- **User Dashboard**: Personalized dashboard for participants.
- **Problem Creation and Management Service**: Admins can create and manage problems.
- **Submission Service**: Users can submit their solutions.
- **Multiple Languages**: Support for various coding languages (Python , C++ , JAVA).
- **Interactive Coding Workspace**: Real-time coding environment.
- **Validations**: Ensuring the correctness of passwords and code.
- **Optimized Queries**: Faster response times and reduced bandwidth consumption.

## 🛠️ Tech Stack

- **Core**:
  - React
  - MongoDB
  - Node.js (Express)
- **Libraries**:
  - TailwindCSS
  - react-hook-form
    
## 🔄 Workflow

### User:
1. User logs in or registers.
2. User navigates through problem lists.
3. User chooses a problem to solve.
4. User submits code.
5. Backend evaluates the code against test cases accordingly the verdict is also returned.
6. If the code fails on Particular testcase then that testcase no is returned
6. Submissions are stored  and can be accessed later.

### Admin:
1. Admin logs in or registers.
2. Admin navigates through the dashboard.
3. Admin can create, delete and edit problems.
4. Admin can change the status and test cases for the problems.

## 🚀 Deployment

- **Backend**: Containerized and deployed to AWS EC2. [Link]()
- **Frontend**: Deployed on Vercel. [Link]()

## 🔧 Working On

- Contest Functionality 
- Validation the User Email through OTP or Google Authentication.
- Creating a more interative dasboard.
- Option of Solution File Submission.
- Features to host coding contests and ladders.
- Enhancements to the user dashboard.
- Realtime analysis of students progress. Leaderboard stating the rank and the percentage of the problems solved.
- Filtering the problems on the basis of tags.

## 🌐 Future Scope

- **AI-Based RAG Model**: Assist users with an AI-based model that embeds problems and user solutions. Using an LLM model, generate natural language responses to help users learn better and solve problems more efficiently.
