import { BrowserRouter, Routes,Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx';
import CandidatesPage from './pages/CandidatesPage.jsx';


function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>;
        <Route path='/candidates' element={<CandidatesPage/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
