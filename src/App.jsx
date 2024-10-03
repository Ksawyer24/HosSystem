//import { useState } from 'react'
import{BrowserRouter as Router,Routes,Route} from "react-router-dom"
import './App.css'
import AddPatient from './components/Patients/AddPatient'
import HomePage from "./components/Home/HomePage"
import SignUpForm from "./components/Auth/signUp"

function App() {

  return (
 <Router>
  <Routes>
  <Route path="/signup" element={<SignUpForm/>}/>
  <Route path="/" element={<HomePage/>}/>
   <Route path="/add-patient" element={<AddPatient/>}/>
  </Routes>














 </Router>
  )
}

export default App
