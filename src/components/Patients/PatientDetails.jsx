import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {z} from "zod"

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    patientName: "",
    patientContact: "",
    dateOfBirth: "",
    nameOfEmergencyContact: "",
    phoneNumberOfContact: "",
    insuranceIsActive: false,
    medicalHistory: {
      conditions: [""],
      medications: [""],
      allergies: [""],
      hadSurgery: false,
      notes: "",
    },
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editPatientData, setEditPatientData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePatientId, setDeletePatientId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const API_URL = "https://localhost:7265/api/patients/patients-total";
        const token = localStorage.getItem("authToken");

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatients();
  }, []);

  const openAddModal = () => {
    setNewPatientData({
      patientName: "",
      patientContact: "",
      dateOfBirth: "",
      nameOfEmergencyContact: "",
      phoneNumberOfContact: "",
      insuranceIsActive: false,
      medicalHistory: {
        conditions: [""],
        medications: [""],
        allergies: [""],
        hadSurgery: false,
        notes: "",
      },
    });

    setShowAddModal(true);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;

    if (name === "medicalHistory.hadSurgery") {
      setNewPatientData((prevData) => ({
        ...prevData,
        medicalHistory: {
          ...prevData.medicalHistory,
          hadSurgery: e.target.checked,
        },
      }));
    } else if (name === "medicalHistory.notes") {
      setNewPatientData((prevData) => ({
        ...prevData,
        medicalHistory: {
          ...prevData.medicalHistory,
          notes: value,
        },
      }));
    } else {
      setNewPatientData({
        ...newPatientData,
        [name]: name === "insuranceIsActive" ? value === "true" : value,
      });
    }
  };

  // for passing medical history details in the required format
  const handleArrayChange = (field, value) => {
    const arrayValue = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item); // Convert string to array and filter out empty values
    setNewPatientData((prevData) => ({
      ...prevData,
      medicalHistory: {
        ...prevData.medicalHistory,
        [field]: arrayValue,
      },
    }));
  };

  const patientSchema = z.object({
  
    patientName: z.string().min(1, "Pateient's Name is required"),
    patientContact: z.string().min(1, "Pateient's Contact is required"),
    dateOfBirth: z.string().min(1, "Date Of Birth is required"),
    nameOfEmergencyContact: z.string().min(1, "Emergency Contact's Name is required"),
    phoneNumberOfContact: z.string().min(1, "Phone Number Of Emergency Contact is required"),
  
  });



  const handleSubmit = async (e) => {
   
    const result = patientSchema.safeParse(newPatientData);
    if (!result.success) {
      const errors = result.error.format();
      
      setFormErrors({
        patientName: errors.patientName?._errors[0],
        patientContact: errors.patientContact?._errors[0],
        dateOfBirth: errors.dateOfBirth?._errors[0],
        nameOfEmergencyContact: errors.nameOfEmergencyContact?._errors[0],
        phoneNumberOfContact: errors.phoneNumberOfContact?._errors[0],
       
      });
      return;
    }


    e.preventDefault();
    const token = localStorage.getItem("authToken");

    console.log(newPatientData);

    try {
      const response = await axios.post(
        "https://localhost:7265/api/patients/patients-add",

        newPatientData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatients((prev) => [...prev, response.data]); // Update state with new patient
      setShowAddModal(false); // Close modal after adding
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const openEditModal = (patient) => {
    setEditPatientData(patient);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("medicalHistory.")) {
      const key = name.split(".")[1];
      if (
        key === "conditions" ||
        key === "medications" ||
        key === "allergies"
      ) {
        const index = parseInt(name.split(".")[2]);

        const updatedList = [...editPatientData.medicalHistory[key]];

        updatedList[index] = value;

        setEditPatientData((prevData) => ({
          ...prevData,
          medicalHistory: {
            ...prevData.medicalHistory,
            [key]: updatedList,
          },
        }));
      } else {
        setEditPatientData((prevData) => ({
          ...prevData,
          medicalHistory: {
            ...prevData.medicalHistory,
            [key]: key === "hadSurgery" ? value === "true" : value,
          },
        }));
      }
    } else {
      setEditPatientData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    if (!editPatientData) return;

    try {
      const API_URL = `https://localhost:7265/api/patients/${editPatientData.id}`;
      const token = localStorage.getItem("authToken");

      await axios.put(API_URL, editPatientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatients(
        patients.map((patient) =>
          patient.id === editPatientData.id ? editPatientData : patient
        )
      );

      setShowEditModal(false); // Close modal after updating
      setEditPatientData(null);
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  const openDeleteModal = (patientId) => {
    //represents what the user wants to delete
    setDeletePatientId(patientId); //this allows the app to know the selected patient
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletePatientId) return;

    try {
      const API_URL = `https://localhost:7265/api/patients/${deletePatientId}`;
      const token = localStorage.getItem("authToken");

      await axios.delete(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatients(patients.filter((patient) => patient.id !== deletePatientId));
    } catch (error) {
      console.error("Error deleting patient:", error);
    } finally {
      setShowDeleteModal(false);
      setDeletePatientId(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* main content */}
      <main className="flex-1 p-4">
        <h2 className="text-3xl font-bold text-center mb-6">
          Patient Information
        </h2>

        <div className="relative mb-6">
          <button
            onClick={openAddModal}
            className="absolute top-0 right-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Patient
          </button>
        </div>

        <div className="overflow-x-auto mt-20">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border border-gray-300 text-left">
                  Patient ID
                </th>

                <th className="py-3 px-4 border border-gray-300 text-left">
                  Patient Name
                </th>

                <th className="py-3 px-4 border border-gray-300 text-left">
                  Contact
                </th>

                {
                  <th className="py-3 px-4 border border-gray-300 text-left">
                    Date of Birth
                  </th>
                }

                <th className="py-3 px-4 border border-gray-300 text-left">
                  Name Of Emergency Conact
                </th>

                <th className="py-3 px-4 border border-gray-300 text-left">
                  Phone Number of Contact
                </th>

                <th className="py-3 px-4 border border-gray-300 text-left">
                  Insurance Active
                </th>
                <th className="py-3 px-1 border border-gray-300 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b border-gray-300 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{patient.id}</td>
                  <td className="py-3 px-4">{patient.patientName}</td>
                  <td className="py-3 px-4">{patient.patientContact}</td>

                  {
                    <td className="py-3 px-4">
                      {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </td>
                  }

                  <td className="py-3 px-4">
                    {patient.nameOfEmergencyContact}
                  </td>
                  <td className="py-3 px-4">{patient.phoneNumberOfContact}</td>

                  <td className="py-3 px-4">
                    <span
                      className={
                        patient.insuranceIsActive
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {patient.insuranceIsActive ? "Yes" : "No"}
                    </span>
                  </td>

                  <td className="py-3 px-1 text-center flex justify-center">
                    <button
                      onClick={() => openEditModal(patient)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(patient.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Modal */}
        {showAddModal && newPatientData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto">
            <div className="bg-white p-6 rounded shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-screen overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">Add New Patient</h3>
              <form>
                <label className="block mb-2">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={newPatientData.patientName}
                  required
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.patientName && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.patientName}
                  </p>
                )}

                <label className="block mb-2">Contact</label>
                <input
                  type="tel"
                  name="patientContact"
                  value={newPatientData.patientContact}
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.patientContact && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.patientContact}
                  </p>
                )}

                <label className="block mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={newPatientData.dateOfBirth}
                  required
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.dateOfBirth && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.dateOfBirth}
                  </p>
                )}

                <label className="block mb-2">Name Of Emergency Contact</label>
                <input
                  type="text"
                  name="nameOfEmergencyContact"
                  value={newPatientData.nameOfEmergencyContact}
                  required
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.nameOfEmergencyContact && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.nameOfEmergencyContact}
                  </p>
                )}

                <label className="block mb-2">Phone Number Of Contact</label>
                <input
                  type="tel"
                  name="phoneNumberOfContact"
                  value={newPatientData.phoneNumberOfContact}
                  required
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.phoneNumberOfContact && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.phoneNumberOfContact}
                  </p>
                )}

                <label className="block mb-2">Insurance Active</label>
                <select
                  name="insuranceIsActive"
                  value={newPatientData.insuranceIsActive ? "true" : "false"}
                  required
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              

                <label className="block mb-2">Conditions</label>
                <input
                  type="text"
                  name="medicalHistory.conditions"
                  value={newPatientData.medicalHistory.conditions}
                  required
                  onChange={(e) =>
                    handleArrayChange("conditions", e.target.value)
                  }
                  className="w-full h-10 border border-gray-300 rounded mb-4"
                />
            
                
                

                <label className="block mb-2">Medications</label>
                <input
                  type="text"
                  name="medicalHistory.medications"
                  value={newPatientData.medicalHistory.medications}
                  required
                  onChange={(e) =>
                    handleArrayChange("medications", e.target.value)
                  }
                  className="w-full h-10 border border-gray-300 rounded mb-4"
                />
                  {formErrors.medications && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.medications}
                  </p>
                )}



             
                <label className="block mb-2">Allergies</label>
                <input
                  type="text"
                  name="medicalHistory.allergies"
                  value={newPatientData.medicalHistory.allergies}
                  required
                  onChange={(e) =>
                    handleArrayChange("allergies", e.target.value)
                  }
                  className="w-full h-10 border border-gray-300 rounded mb-4"
                />
             

                <label className="block mb-2">Had Surgery</label>
                <input
                  type="checkbox"
                  name="medicalHistory.hadSurgery"
                  checked={newPatientData.medicalHistory.hadSurgery}
                  required
                  onChange={(e) =>
                    setNewPatientData((prevData) => ({
                      ...prevData,
                      medicalHistory: {
                        ...prevData.medicalHistory,
                        hadSurgery: e.target.checked, // Update the value based on whether the checkbox is checked
                      },
                    }))
                  }
                  className="w-5 h-5 mb-4 border border-gray-300 rounded"
                />

              

                <label className="block mb-2">Notes</label>
                <textarea
                  type="text"
                  name="medicalHistory.notes"
                  value={newPatientData.medicalHistory.notes}
                  onChange={handleAddChange}
                  className="w-full h-20 mb-4 border border-gray-300 rounded"
                />
               

              </form>
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-400"
                >
                  Add
                </button>

                <button
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editPatientData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h3 className="text-lg font-bold mb-4">Edit Patient</h3>
              <form>
                <label className="block mb-2">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={editPatientData.patientName}
                  onChange={handleEditChange}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
                <label className="block mb-2">Contact</label>
                <input
                  type="tel"
                  name="patientContact"
                  value={editPatientData.patientContact}
                  onChange={handleEditChange}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                />

                <label className="block mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editPatientData.dateOfBirth.split("T")[0]}
                  onChange={handleEditChange}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                />

                <label className="block mb-2">Name Of Emergency Contact</label>
                <input
                  type="text"
                  name="nameOfEmergencyContact"
                  value={editPatientData.nameOfEmergencyContact}
                  onChange={handleEditChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />

                <label className="block mb-2">Phone Number Of Contact</label>
                <input
                  type="tel"
                  name="phoneNumberOfContact"
                  value={editPatientData.phoneNumberOfContact}
                  onChange={handleEditChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />

                <label className="block mb-2">Insurance Active</label>
                <select
                  name="insuranceIsActive"
                  value={editPatientData.insuranceIsActive ? "true" : "false"}
                  onChange={(e) =>
                    handleEditChange({
                      target: {
                        name: "insuranceIsActive",
                        value: e.target.value === "true",
                      },
                    })
                  }
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </form>
              <div className="flex justify-end">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-400"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h3 className="text-lg font-bold mb-4">Delete Patient</h3>
              <p>Are you sure you want to delete this patient?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded mr-2 hover:bg-red-400"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientList;
