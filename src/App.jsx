//import { useState } from 'react'
import{BrowserRouter as Router,Routes,Route} from "react-router-dom"
import './App.css'
import AddPatient from './components/Patients/AddPatient'

function App() {

  return (
 <Router>
  <Routes>
  <Route path="/" element={<AddPatient/>}/>
   <Route path="/add-patient" element={<AddPatient/>}/>
  </Routes>














 </Router>
  )
}

export default App