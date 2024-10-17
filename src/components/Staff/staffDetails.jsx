import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPlus } from '@fortawesome/free-solid-svg-icons';

const StaffList = () => {
    const [staff, setStaff] = useState([]); // State for storing staff
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStaffData, setNewStaffData] = useState({
      name: "",
      dateOfBirth: "",
      phoneNumber: "",
      position: "",
      yearsOfEmployment: "",
      workingDays: "",
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editStaffData, setEditStaffData] = useState(null);
    const [deleteStaffId, setDeleteStaffId] = useState(null);


    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const API_URL = 'https://localhost:7265/api/staff/staff-total'; // Adjust API URL accordingly
                const token = localStorage.getItem('authToken');

                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Ensure correct token format
                    },
                });

                setStaff(response.data); // Set fetched staff data
            } catch (error) {
                console.error('Error fetching staff data:', error);
            }
        };

        fetchStaff(); // Fetch staff on component mount
    }, []);


    const handleAddStaff = async () => {
        try {
          const API_URL = "https://localhost:7265/api/staff";
          const token = localStorage.getItem("authToken");
    
          console.log(newStaffData)
    
          await axios.post(API_URL, newStaffData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
    
    
          });
    
          setStaff([...staff, newStaffData]);
          setShowAddModal(false); // Close modal after adding
    
        } catch (error) {
          console.error("Error adding staff member:", error);
        }
      };


      const handleAddChange = (e) => {
        const { name, value } = e.target;
      
        
        setNewStaffData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      




    const openAddModal = () => {
        setNewStaffData({
            name: "",
            dateOfBirth: "",
            phoneNumber: "",
            position: "",
            yearsOfEmployment: "",
            workingDays: "",
        });
        setShowAddModal(true);
      };



    const openEditModal = (staff) => {
        setEditStaffData(staff);
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditStaffData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        if (!editStaffData) return;

        try {
            const API_URL = `https://localhost:7265/api/patients/${editStaffData.id}`;
            const token = localStorage.getItem('authToken');

            await axios.put(API_URL, editStaffData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update the patient list with the edited patient data
            setStaff(staff.map((patient) =>
                patient.id === editStaffData.id ? editStaffData : patient
            ));
        } catch (error) {
            console.error('Error updating patient:', error);
        } finally {
            setShowEditModal(false);
            setEditStaffData(null);
        }
    };

    const openDeleteModal = (patientId) => {
        setDeleteStaffId(patientId);
        setShowDeleteModal(true);
    };



    

    // Function to handle delete action
    const handleDelete = async (deleteStaffid) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this staff member?");
        if (confirmDelete) {
            try {
                const API_URL = `https://localhost:7265/api/staff/${deleteStaffid}`; // Adjust API URL accordingly
                const token = localStorage.getItem('authToken');

                await axios.delete(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Ensure correct token format
                    },
                });

                setStaff(staff.filter((patient) => patient.id !== deleteStaffId));
            } catch (error) {
                console.error('Error deleting patient:', error);
            } finally {
                setShowDeleteModal(false);
                setDeleteStaffId(null);
            }
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
          

            {/* Main Content */}
            <main className="flex-1 p-4">
                <h2 className="text-3xl font-bold text-center mb-6">Staff Information</h2>

                <div className="relative mb-4"> {/* Wrap for button positioning */}

                <button
             onClick={openAddModal}
            className="absolute top-0 right-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
                 >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Staff
               </button>
                </div>

                <div className="overflow-x-auto mt-20"> {/* Margin to lower the table */}
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-2 border border-gray-300 text-center">Name</th>
                                <th className="py-3 px-2 border border-gray-300 text-center">Date of Birth</th>
                                <th className="py-3 px-2 border border-gray-300 text-center">Phone Number</th>
                                <th className="py-3 px-2 border border-gray-300 text-center">Position</th>
                                <th className="py-3 px-2 border border-gray-300 text-center">Years of Employment</th>
                                <th className="py-3 px-2 border border-gray-300 text-center">Working Days</th>
                                <th className="py-3 px-2 border border-gray-300 text-center">Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {staff.map((member) => (
                                <tr key={member.id} className="border-b border-gray-300 hover:bg-gray-50">
                                    <td className="py-3 px-4">{member.name}</td>
                                    <td className="py-3 px-4">{new Date(member.dateOfBirth).toLocaleDateString()}</td>
                                    <td className="py-3 px-6">{member.phoneNumber}</td>
                                    <td className="py-3 px-4">{member.position}</td>
                                    <td className="py-3 px-20">{member.yearsOfEmployment}</td>
                                    <td className="py-3 px-4">{member.workingDays}</td>
                                    <td className="py-3 px-1 text-center flex justify-center">
                                        <button onClick={() => openEditModal(staff)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-400">Edit</button>
                                        <button onClick={() => openDeleteModal(staff.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400">Delete</button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
                
                 {/* Add Modal */}
        {showAddModal && newStaffData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h3 className="text-lg font-bold mb-4">Add New Staff Member</h3>
              <form>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={newStaffData.name}
                  onChange={newStaffData}
                  className="w-full h-10 mb-4  border border-gray-300 rounded"
                />

                <label className="block mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={newStaffData.dateOfBirth}
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4  border border-gray-300 rounded"
                />

                <label className="block mb-2">Phone Number</label>
                <input
                  type="text"
                  name="patientContact"
                  value={newStaffData.phoneNumber}
                  onChange={handleAddStaff}
                  className="w-full h-10 mb-4  border border-gray-300 rounded"
                />
                
                <label className="block mb-2">Position</label>
                <input
                  type="text"
                  name="position"
                  value={newStaffData.position}
                  onChange={newStaffData}
                  className="w-full h-10 mb-4  border border-gray-300 rounded"
                />

                <label className="block mb-2">Years Of Employment</label>
                <input
                  type="text"
                  name="patientContact"
                  value={newStaffData.yearsOfEmployment}
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4  border border-gray-300 rounded"
                />

              <label className="block mb-2">Working Days</label>
                <input
                  type="text"
                  name="patientContact"
                  value={newStaffData.workingDays}
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4  border border-gray-300 rounded"
                />



                
              </form>
              <div className="flex justify-end">
                <button
                  onClick={handleAddStaff}
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
                   {showEditModal && editStaffData && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow-lg w-1/3">
                            <h3 className="text-lg font-bold mb-4">Edit Staff Member</h3>
                            <form>
                                <label className="block mb-2">Name</label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={editStaffData.staffName}
                                    onChange={handleEditChange}
                                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                                />

                                  <label className="block mb-2">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={editStaffData.dateOfBirth}
                                    onChange={handleEditChange}
                                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                                />
                               
                                <label className="block mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    name="phonenumber"
                                    value={editStaffData.staffPhoneNumber}
                                    onChange={handleEditChange}
                                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                                />

                        <label className="block mb-2">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={editStaffData.staffPosition}
                                    onChange={handleEditChange}
                                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                                />


                           <label className="block mb-2">Years of Employment</label>
                                <input
                                    type="number"
                                    name="yearsofemployment"
                                    value={editStaffData.staffYearsOfEmployment}
                                    onChange={handleEditChange}
                                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                                />

                          <label className="block mb-2">Working Days</label>
                                <input
                                    type="number"
                                    name="workingdays"
                                    value={editStaffData.staffWorkingDays}
                                    onChange={handleEditChange}
                                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                                />
                              

                            </form>
                            <div className="flex justify-end">
                                <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-400">Update</button>
                                <button onClick={() => setShowEditModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}



                 {/* Delete Modal */}
                 {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow-lg w-1/3">
                            <h3 className="text-lg font-bold mb-4">Delete Staff</h3>
                            <p>Are you sure you want to delete this staff member?</p>
                            <div className="flex justify-end mt-4">
                                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded mr-2 hover:bg-red-400">Delete</button>
                                <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StaffList;
