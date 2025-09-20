import { BrowserRouter, Routes,Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx';
import CandidatesPage from './pages/CandidatesPage.jsx';
import AssessmentBuilder from './pages/AssesmentBuilderPage.jsx';
import JobDetails from './pages/JobDetails.jsx';
import AssessmentPreviewPage from './pages/AssessmentPreviewPage.jsx';
import CandidateDetails from './pages/CandidateDetails.jsx';


function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>;
        <Route path='/job/:id' element={<JobDetails/>}/>;
        <Route path='/candidates' element={<CandidatesPage/>}/>
        <Route path='/candidate/:id' element={<CandidateDetails/>}/>
        <Route path='/assessmentbuilder/:jobId' element={<AssessmentBuilder/>}/>
        <Route path='/assessmentpreview/:jobId' element={<AssessmentPreviewPage/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
