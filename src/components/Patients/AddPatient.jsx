import  { useState } from 'react';

const AddPatient = () => {
  // State variables for patient information
  const [patientName, setPatientName] = useState('');
  const [patientContact, setPatientContact] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nameOfEmergencyContact, setNameOfEmergencyContact] = useState('');
  const [phoneNumberOfContact, setPhoneNumberOfContact] = useState('');
  const [insuranceIsActive, setInsuranceIsActive] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct the patient object
    const patientData = {
      patientName,
      patientContact,
      dateOfBirth,
      nameOfEmergencyContact,
      phoneNumberOfContact,
      insuranceIsActive,
      // Add other fields as needed
    };

    // Send POST request to the backend API
    fetch('/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Patient added successfully:', data);
        // Handle success (e.g., reset the form, show a success message)
        resetForm();
      })
      .catch((error) => {
        console.error('Error adding patient:', error);
        // Handle error (e.g., show an error message)
      });
  };

  // Function to reset the form
  const resetForm = () => {
    setPatientName('');
    setPatientContact('');
    setDateOfBirth('');
    setNameOfEmergencyContact('');
    setPhoneNumberOfContact('');
    setInsuranceIsActive(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Patient Name
          </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient's name"
            required
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          />
        </div>
  
        <div className="w-full md:w-1/2 px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Patient Contact
          </label>
          <input
            type="text"
            value={patientContact}
            onChange={(e) => setPatientContact(e.target.value)}
            placeholder="Enter contact number"
            required
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
      </div>
  
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
      </div>
  
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Emergency Contact Name
          </label>
          <input
            type="text"
            value={nameOfEmergencyContact}
            onChange={(e) => setNameOfEmergencyContact(e.target.value)}
            placeholder="Enter emergency contact name"
            required
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
  
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Emergency Contact Phone
          </label>
          <input
            type="text"
            value={phoneNumberOfContact}
            onChange={(e) => setPhoneNumberOfContact(e.target.value)}
            placeholder="Enter emergency contact phone"
            required
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
      </div>
  
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="flex items-center uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            <input
              type="checkbox"
              checked={insuranceIsActive}
              onChange={(e) => setInsuranceIsActive(e.target.checked)}
              className="mr-2"
            />
            Insurance Active
          </label>
        </div>
      </div>
  
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
      >
        Add Patient
      </button>
    </form>
  );
  
};

export default AddPatient;
