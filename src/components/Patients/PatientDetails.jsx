import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    patientName: "",
    patientContact: "",
    dateOfBirth: "",
    insuranceIsActive: false,
     medicalHistory: {
      conditions: [""],
      medications: [""],
      allergies: [""],
      hadSurgery: false,
      dateOfLastVisit: "",
      notes: "",
    },
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editPatientData, setEditPatientData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePatientId, setDeletePatientId] = useState(null);

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
      insuranceIsActive: false,
      medicalHistory: {
        conditions: [""],
        medications: [""],
        allergies: [""],
        hadSurgery: false,
        dateOfLastVisit: "",
        notes: "",
      },
    });
    setShowAddModal(true);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
  
    if (name.startsWith("medicalHistory.")) {
      const [ key, index] = name.split(".");
      if (["conditions", "medications", "allergies"].includes(key)) {
        const updatedList = [...newPatientData.medicalHistory[key]];
        updatedList[parseInt(index, 10)] = value;
        setNewPatientData((prevData) => ({
          ...prevData,
          medicalHistory: {
            ...prevData.medicalHistory,
            [key]: updatedList,
          },
        }));
      } else {
        setNewPatientData((prevData) => ({
          ...prevData,
          medicalHistory: {
            ...prevData.medicalHistory,
            [key]: key === "hadSurgery" ? value === "true" : value,
          },
        }));
      }
    } else {
      setNewPatientData((prevData) => ({
        ...prevData,
        [name]: name === "insuranceIsActive" ? value === "true" : value,
      }));
    }
  };
  

  const handleAddPatient = async () => {
    try {
      const API_URL = "https://localhost:7265/api/patients/patients-add";
      const token = localStorage.getItem("authToken");

      console.log(newPatientData)

      await axios.post(API_URL, newPatientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },


      });

      setPatients([...patients, newPatientData]);
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
      if (key === "conditions" || key === "medications" || key === "allergies") {
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
    setDeletePatientId(patientId);
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
                <th className="py-3 px-4 border border-gray-300 text-left">
                  Date of Birth
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
                  <td className="py-3 px-4">
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </td>
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
          onChange={handleAddChange}
          className="w-full h-10 mb-4 border border-gray-300 rounded"
        />
        
        <label className="block mb-2">Contact</label>
        <input
          type="text"
          name="patientContact"
          value={newPatientData.patientContact}
          onChange={handleAddChange}
          className="w-full h-10 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={newPatientData.dateOfBirth}
          onChange={handleAddChange}
          className="w-full h-10 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2">Insurance Active</label>
        <select
          name="insuranceIsActive"
          value={newPatientData.insuranceIsActive ? "true" : "false"}
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
          value={newPatientData.conditions}
          onChange={handleAddChange}
          className="w-full h-10 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2">Medications</label>
        <input
          type="text"
          name="medicalHistory.medications"
          value={newPatientData.medications}
          onChange={handleAddChange}
          className="w-full h-10 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2">Allergies</label>
        <input
          type="text"
          name="medicalHistory.allergies"
          value={newPatientData.allergies}
          onChange={handleAddChange}
          className="w-full h-10 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2">Had Surgery</label>
        <select
          name="medicalHistory.hadSurgery"
          value={newPatientData.hadSurgery ? "true" : "false"}
          onChange={handleAddChange}
          className="w-full h-10 mb-4 border border-gray-300 rounded"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <label className="block mb-2">Date of Last Visit</label>
        <input
          type="date"
          name="medicalHistory.dateOfLastVisit"
          value={newPatientData.dateOfLastVisit}
          onChange={handleAddChange}
          className="w-full h-10 mb-4 border border-gray-300 rounded"
        />

        <label className="block mb-2">Notes</label>
        <textarea
          name="medicalHistory.notes"
          value={newPatientData.notes}
          onChange={handleAddChange}
          className="w-full  mb-4 border border-gray-300 rounded"
        />
      </form>
      <div className="flex justify-end">
        <button
          onClick={handleAddPatient}
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
                  type="text"
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
                <label className="block mb-2">Insurance Active</label>

                <select
                  name="insuranceIsActive"
                  value={editPatientData.insuranceIsActive ? "true" : "false"}
                  onChange={handleEditChange}
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
