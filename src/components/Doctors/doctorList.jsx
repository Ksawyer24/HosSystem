import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {z} from "zod"

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({
    name: "",
    dateOfBirth: "",
    specialization: "",
    yearsOfExperience: "",
    contactNumber: "",
    email: "",
    address: "",
    workingDays: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDoctorData, setEditDoctorData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteDoctorId, setDeleteDoctorId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const API_URL = "https://localhost:7265/api/doctors/doctors-total";

        const token = localStorage.getItem("authToken");

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctors();
  }, []);


  const doctorSchema = z.object({
  
    name: z.string().min(1, "Name is required"),
    dateOfBirth: z.string().min(1, "Date Of Birth is required"),
    specialization: z.string().min(1, "Specialization is required"),
    yearsOfExperience: z.string().min(1, "Years Of Experience is required"),
    contactNumber: z.string().min(1, "Contact Number is required"),
    email: z.string().min(1, "Email is required"),
    address: z.string().min(1, "Address is required"),
    workingDays: z.string().min(1, "Working Days is required"),
  
  });





  const handleAddDoctor = async () => {
    const result = doctorSchema.safeParse(newDoctorData);
    if (!result.success) {
      const errors = result.error.format();
      
      setFormErrors({
        name: errors.name?._errors[0],
        dateOfBirth: errors.dateOfBirth?._errors[0],
        specialization: errors.specialization?._errors[0],
        yearsOfExperience: errors.yearsOfExperience?._errors[0],
        contactNumber: errors.contactNumber?._errors[0],
        email: errors.email?._errors[0],
        address: errors.address?._errors[0],
        workingDays:errors.workingDays?._errors[0]
       
      });
      return;
    }

    // Clear previous errors if validation passes
    setFormErrors({});

    try {
      const API_URL = "https://localhost:7265/api/doctors/doctors-add";
      const token = localStorage.getItem("authToken");

      await axios.post(API_URL, newDoctorData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDoctors([...doctors, newDoctorData]); // Update doctors list
      setShowAddModal(false); // Close modal after adding
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;

    setNewDoctorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setNewDoctorData({
      name: "",
      dateOfBirth: "",
      specialization: "",
      yearsOfExperience: "",
      contactNumber: "",
      email: "",
      address: "",
      workingDays: "",
    });
    setShowAddModal(true);
  };

  const openEditModal = (doctor) => {
    setEditDoctorData(doctor);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDoctorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!editDoctorData) return;

    try {
      const API_URL = `https://localhost:7265/api/doctors/${editDoctorData.id}`; // Corrected with backticks for template literal
      const token = localStorage.getItem("authToken");

      await axios.put(API_URL, editDoctorData, {
        headers: {
          Authorization: `Bearer ${token}`, // Corrected with template literal for token
        },
      });

      setDoctors(
        doctors.map((doctor) =>
          doctor.id === editDoctorData.id ? editDoctorData : doctor
        )
      );
    } catch (error) {
      console.error("Error updating doctor:", error);
    } finally {
      setShowEditModal(false);
      setEditDoctorData(null);
    }
  };

  const openDeleteModal = (doctorId) => {
    setDeleteDoctorId(doctorId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteDoctorId) return;

    try {
      const API_URL = `https://localhost:7265/api/doctors/${deleteDoctorId}`; // Adjust API endpoint
      const token = localStorage.getItem("authToken");

      await axios.delete(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDoctors(doctors.filter((doctor) => doctor.id !== deleteDoctorId));
    } catch (error) {
      console.error("Error deleting doctor:", error);
    } finally {
      setShowDeleteModal(false);
      setDeleteDoctorId(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-4">
        <h2 className="text-3xl font-bold text-center mb-6">
          Doctor Information
        </h2>
        <div className="relative mb-6">
          <button
            onClick={openAddModal}
            className="absolute top-0 right-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Doctor
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
                  Date of Birth
                </th>
                <th className="py-3 px-4 border border-gray-300 text-left">
                  Specialization
                </th>
                <th className="py-3 px-4 border border-gray-300 text-left">
                  Years of Experience
                </th>
                <th className="py-3 px-4 border border-gray-300 text-left">
                  Contact Number
                </th>
                <th className="py-3 px-4 border border-gray-300 text-left">
                  Email
                </th>
                <th className="py-3 px-4 border border-gray-300 text-left">
                  Address
                </th>
                <th className="py-3 px-4 border border-gray-300 text-left">
                  Working Days
                </th>
                <th className="py-3 px-1 border border-gray-300 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="border-b border-gray-300 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{doctor.name}</td>
                  <td className="py-3 px-4">
                    {new Date(doctor.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">{doctor.specialization}</td>
                  <td className="py-3 px-4">{doctor.yearsOfExperience}</td>
                  <td className="py-3 px-4">{doctor.contactNumber}</td>
                  <td className="py-3 px-4">{doctor.email}</td>
                  <td className="py-3 px-4">{doctor.address}</td>
                  <td className="py-3 px-4">{doctor.workingDays}</td>
                  <td className="py-3 px-1 text-center">
                    <td className="py-3 px-1 text-center flex justify-center">
                      <button
                        onClick={() => openEditModal(doctor)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(doctor.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Modal */}
        {showAddModal && newDoctorData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto">
            <div className="bg-white p-6 rounded shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-screen overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">Add New Doctor</h3>
              <form>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newDoctorData.name}
                  onChange={handleAddChange}
                  required
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mb-4">{formErrors.name}</p>
                )}

                <label className="block mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={newDoctorData.dateOfBirth}
                  required
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.dateOfBirth && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.dateOfBirth}
                  </p>
                )}

                <label className="block mb-2">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={newDoctorData.specialization}
                  required
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.specialization && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.specialization}
                  </p>
                )}

                <label className="block mb-2">Years Of Experience</label>
                <input
                  type="text"
                  name="yearsOfExperience"
                  value={newDoctorData.yearsOfExperience}
                  required
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.yearsOfExperience && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.yearsOfExperience}
                  </p>
                )}

                <label className="block mb-2">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={newDoctorData.contactNumber}
                  required
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.contactNumber && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.contactNumber}
                  </p>
                )}

                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newDoctorData.email}
                  required
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.email}
                  </p>
                )}

                <label className="block mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newDoctorData.address}
                  required
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.address && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.address}
                  </p>
                )}

                <label className="block mb-2">Working Days</label>
                <input
                  type="text"
                  name="workingDays"
                  value={newDoctorData.workingDays}
                  required
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />
                {formErrors.workingDays && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.workingDays}
                  </p>
                )}
              </form>

              <div className="flex justify-end">
                <button
                  onClick={handleAddDoctor}
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
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto">
            <div className="bg-white p-6 rounded shadow-md w-full md:w-1/2 lg:w-1/3 max-h-screen overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">Edit Doctor</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editDoctorData.name}
                    onChange={handleEditChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={
                      new Date(editDoctorData.dateOfBirth)
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={handleEditChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={editDoctorData.specialization}
                    onChange={handleEditChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={editDoctorData.yearsOfExperience}
                    onChange={handleEditChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={editDoctorData.contactNumber}
                    onChange={handleEditChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editDoctorData.email}
                    onChange={handleEditChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editDoctorData.address}
                    onChange={handleEditChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Working Days
                  </label>
                  <input
                    type="text"
                    name="workingDays"
                    value={editDoctorData.workingDays}
                    onChange={handleEditChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white py-2 px-4 rounded mr-2 hover:bg-blue-400"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h3 className="text-lg font-bold mb-4">Delete Doctor</h3>
              <p>Are you sure you want to delete this doctor?</p>
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

export default DoctorList;
