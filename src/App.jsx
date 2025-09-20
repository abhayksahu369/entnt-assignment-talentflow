import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx';
import CandidatesPage from './pages/CandidatesPage.jsx';
import AssessmentBuilder from './pages/AssesmentBuilderPage.jsx';
import JobDetails from './pages/JobDetails.jsx';
import AssessmentPreviewPage from './pages/AssessmentPreviewPage.jsx';
import CandidateDetails from './pages/CandidateDetails.jsx';
import Navbar from './components/Navbar.jsx';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AllAssessmentPage from './pages/AllAssessmentPage.jsx';
import Dashboard from './pages/Dashboard.jsx';


function App() {

  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/job/:id' element={<JobDetails />} />
            <Route path='/candidates' element={<CandidatesPage />} />
            <Route path='/candidate/:id' element={<CandidateDetails />} />
            <Route path='/allassessments' element={<AllAssessmentPage />} />
            <Route path='/assessmentbuilder/:jobId' element={<AssessmentBuilder />} />
            <Route path='/assessmentpreview/:jobId' element={<AssessmentPreviewPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
