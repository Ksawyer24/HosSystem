//import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
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
import AppointmentList from "./components/Appointments/AppointmentList";
import InventoryList from "./components/Inventory/InventoryList";
import BillingInv from "./components/Billing/billingInvoice";
import Prescriptions from "./components/Prescription/prescription";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />

         <Route path="" element={<Layout/>}>
          <Route path="/dash-home" element={<Dashboard />} />

          {/* patient routes */}
          <Route path="/patients" element={<PatientList />} />
         
           {/* apppointment routes */}
           <Route path="/appointments" element={<AppointmentList />} />

          {/* doctor routes */}
          <Route path="/doctors" element={<DoctorList />} />

          {/* staff routes */}
          <Route path="/staff" element={<StaffList />} />

          {/* inventory routes */}
          <Route path="/inventory" element={<InventoryList />} />

          {/* lab test routes */}
          <Route path="/tests" element={<LabTestList />} />

          {/* medical history routes */}
          <Route path="/medical-history" element={<MedicalHistoryList />} />

          {/* prescriptions routes */}
          <Route path="/prescriptions" element={<Prescriptions />} />


            {/* billing invoice routes */}
            <Route path="/billing-invoice" element={<BillingInv />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
