//import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AddPatient from "./components/Patients/AddPatient";
import HomePage from "./components/Home/HomePage";
import SignUpForm from "./components/Auth/signUp";
import SignInForm from "./components/Auth/login";
import Dashboard from "./components/Home/Dashboard";
import PatientList from "./components/Patients/PatientDetails";
import DoctorList from "./components/Doctors/doctorList";
import StaffList from "./components/Staff/staffDetails";
import LabTestList from "./components/LabTest/labTestDetails";
import MedicalHistoryList from "./components/MedicalHistory/medicalHistoryList";
import Layout from "./components/Home/layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />

        <Route path="" element={<Layout />}>
          <Route path="/dash-home" element={<Dashboard />} />

          {/* patient routes */}
          <Route path="/patients" element={<PatientList />} />
          <Route path="/add-patient" element={<AddPatient />} />

          {/* doctor routes */}
          <Route path="/doctors" element={<DoctorList />} />

          {/* staff routes */}
          <Route path="/staff" element={<StaffList />} />

          {/* lab test routes */}
          <Route path="/tests" element={<LabTestList />} />

          {/* medical history routes */}
          <Route path="/medical-history" element={<MedicalHistoryList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
