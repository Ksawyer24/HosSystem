import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {z} from "zod"

const Prescriptions = () => {
    
    const [prescriptions, setPrescriptions] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPrescriptiontData, SetPrescriptionsData] = useState({
      name: "",
      dosage: "",
      dateIssued: "",
      patientId: "",
    });
  
    const [showEditModal, setShowEditModal] = useState(false);
    const [editPrescriptionData, setEditPrescriptionData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePrescriptionId, setDeletePrescriptionId] = useState(null);
    const [formErrors, setFormErrors] = useState({})
  
    useEffect(() => {
      const fetchPrescription = async () => {
        try {
          const API_URL = "https://localhost:7265/api/prescriptions";
          const token = localStorage.getItem("authToken");
  
          const response = await axios.get(API_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setPrescriptions(response.data);
        } catch (error) {
          console.error("Error fetching prescription data:", error);
        }
      };
  
      fetchPrescription();
    }, []);
  
    const openAddModal = () => {
      SetPrescriptionsData({
        name: "",
        dosage: "",
        dateIssued: "",
        patientId: "",
          
      });
  
      setShowAddModal(true);
  
    };
  
  
  
    const handleAddChange = (e) => {
      const { name, value } = e.target;
      SetPrescriptionsData({ ...newPrescriptiontData, [name]: value });
    };

    const prescriptionSchema = z.object({
  
      name: z.string().min(1, "Name is required"),
      dosage: z.string().min(1, "Dosage is required"),
      dateIssued: z.string().min(1, "Dosage is required"),
      patientId: z.string().min(1, "Patient's Id is required"),
    });


  
  
  
  
    const handleSubmit = async (e) => {

      const result = prescriptionSchema.safeParse(newPrescriptiontData);
    if (!result.success) {
      const errors = result.error.format();
      
      setFormErrors({
        name: errors.name?._errors[0],
        dosage: errors.dosage?._errors[0],
        dateIssued: errors.dateIssued?._errors[0],
        patientId: errors.patientId?._errors[0],
      
      });
      return;
    }






      e.preventDefault();
      const token = localStorage.getItem("authToken");
  
      console.log(newPrescriptiontData)
    
      try {
        const response = await axios.post(
          "https://localhost:7265/api/prescriptions/prescription-add",
  
          newPrescriptiontData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setPrescriptions((prev) => [...prev, response.data]); // Update state with new patient
        setShowAddModal(false); // Close modal after adding
      } catch (error)
      
      {
        console.error("Error adding prescription:", error);
      }
  
    };
  

    const openEditModal = (prescription) => {
      setEditPrescriptionData(prescription);
      setShowEditModal(true);
    };
  
  
    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditPrescriptionData((prevData) => ({
          ...prevData,
          [name]: value,
      }));
  };
  
  
  
    const handleUpdate = async () => {
      if (!editPrescriptionData) return;
  
      try {
        const API_URL = `https://localhost:7265/api/prescriptions/${editPrescriptionData.id}`;
        const token = localStorage.getItem("authToken");
  
        await axios.put(API_URL, editPrescriptionData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setPrescriptions(
          prescriptions.map((prescription) =>
            prescription.id === editPrescriptionData.id ? editPrescriptionData : prescription
          )
        );

        setShowEditModal(false); // Close modal after updating
        setEditPrescriptionData(null);
      } 
      catch (error) {
        console.error("Error updating prescription:", error);
      }

    };
  
    const openDeleteModal = (prescriptionId) => {
      setDeletePrescriptionId(prescriptionId);
      setShowDeleteModal(true);
    };
  
  
  
    const handleDelete = async () => {
      if (!deletePrescriptionId) return;
  
      try {
        const API_URL = `https://localhost:7265/api/prescriptions/${deletePrescriptionId}`;
        const token = localStorage.getItem("authToken");
  
        await axios.delete(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setPrescriptions(prescriptions.filter((prescription) => prescription.id !== deletePrescriptionId));
      } 
      catch (error) {
        console.error("Error deleting prescription:", error);
      } 
      finally {
        setShowDeleteModal(false);
        setDeletePrescriptionId(null);
      }

    };
  
  
    return (
      <div className="min-h-screen flex bg-gray-100">
        {/* main content */}
        <main className="flex-1 p-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            Prescription Information
          </h2>
  
          <div className="relative mb-6">
            <button
              onClick={openAddModal}
              className="absolute top-0 right-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Prescription
            </button>
          </div>
  
          <div className="overflow-x-auto mt-20">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                <th className="py-3 px-4 border border-gray-300 text-left">
                    Name
                  </th>

                  <th className="py-3 px-4 border border-gray-300 text-left">
                    Dosage
                  </th>

                  <th className="py-3 px-4 border border-gray-300 text-left">
                    Date Issued
                  </th>

                  <th className="py-3 px-4 border border-gray-300 text-left"> 
                    Patient ID
                  </th>

                  <th className="py-3 px-1 border border-gray-300 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
  
              <tbody>
                {prescriptions.map((prescription) => (
                  <tr
                    key={prescription.id}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{prescription.name}</td>
                    <td className="py-3 px-4">{prescription.dosage}</td>
                    
                    { <td className="py-3 px-4">
                      {new Date(prescription.dateIssued).toLocaleDateString()}
                    </td> }

                    <td className="py-3 px-4">{prescription.patientId}</td>
  
        

                    <td className="py-3 px-1 text-center flex justify-center">
                    <button
                      onClick={() => openEditModal(prescription)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(prescription.id)}
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
          {showAddModal && newPrescriptiontData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto">
              <div className="bg-white p-6 rounded shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-screen overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Add New Prescription</h3>
                <form>
                  <label className="block mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newPrescriptiontData.name}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
                  {formErrors.name && (
                  <p className="text-red-500 text-sm mb-4">{formErrors.name}</p>
                )}
  
                  <label className="block mb-2">Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={newPrescriptiontData.dosage}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
                  {formErrors.dosage && (
                  <p className="text-red-500 text-sm mb-4">{formErrors.dosage}</p>
                )}
  
                  <label className="block mb-2">Date Issued</label>
                  <input
                    type="date"
                    name="dateIssued"
                    value={newPrescriptiontData.dateIssued}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
                  {formErrors.dateIssued && (
                  <p className="text-red-500 text-sm mb-4">{formErrors.dateIssued}</p>
                )}
  
                  <label className="block mb-2">Patient ID</label>
                  <input
                    type="text"
                    name="patientId"
                    value={newPrescriptiontData.patientId}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
                  {formErrors.patientId && (
                  <p className="text-red-500 text-sm mb-4">{formErrors.patientId}</p>
                )}
  
                  
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
          {showEditModal && editPrescriptionData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h3 className="text-lg font-bold mb-4">Edit prescription</h3>
                <form>
                  <label className="block mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editPrescriptionData.name}
                    onChange={handleEditChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                  />
                  <label className="block mb-2">Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={editPrescriptionData.dosage}
                    onChange={handleEditChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                  />
  
                  <label className="block mb-2">Date Issued</label>
                  <input
                    type="date"
                    name="dateIssued"
                    value={editPrescriptionData.dateIssued.split("T")[0]}
                    onChange={handleEditChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                  />
                  
                  <label className="block mb-2">Patient ID</label>
                  <input
                    type="text"
                    name="patientId"
                    value={editPrescriptionData.patientId}
                    onChange={handleEditChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                  />
  
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
                <h3 className="text-lg font-bold mb-4">Delete Prescription</h3>
                <p>Are you sure you want to delete this Prescription?</p>
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

export default Prescriptions;
 





