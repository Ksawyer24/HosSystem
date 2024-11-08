import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AppointmentList = () => {
    
    const [appointments, setAppointments] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAppointmentData, SetNewAppointmentsData] = useState({
      patientId: "",
      doctorId: "",
      appointmentDate: "",
      time: "",
      isActive: false,
      reason: "",
      notes: "",
      createdDate: "",
    });
  
    const [showEditModal, setShowEditModal] = useState(false);
    const [editAppointmentData, setEditAppointmentData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteAppointmentId, setDeleteAppointmentId] = useState(null);
  
    useEffect(() => {
      const fetchAppointments = async () => {
        try {
          const API_URL = "https://localhost:7265/api/appointments/appointments-total";
          const token = localStorage.getItem("authToken");
  
          const response = await axios.get(API_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setAppointments(response.data);
        } catch (error) {
          console.error("Error fetching appointment data:", error);
        }
      };
  
      fetchAppointments();
    }, []);
  
    const openAddModal = () => {
      SetNewAppointmentsData({
          patientId:"",
          doctorId: "",
          appointmentDate:"",
          time:"",
          isActive: false, 
          reason: "",
          notes:"",
          createdDate:"",
          
      });
  
      setShowAddModal(true);
  
    };
  
  
  
    const handleAddChange = (e) => {
      const { name, value } = e.target;
      SetNewAppointmentsData({
        ...newAppointmentData,
        [name]: name === "isActive" ? value === "true" : value,
      });
    };
  
  
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("authToken");
  
      console.log(newAppointmentData)
    
      try {
        const response = await axios.post(
          "https://localhost:7265/api/appointments/appointments-add",
  
          newAppointmentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setAppointments((prev) => [...prev, response.data]); // Update state with new patient
        setShowAddModal(false); // Close modal after adding
      } catch (error)
      
      {
        console.error("Error adding appointment:", error);
      }
  
    };
  
  
  
    const openEditModal = (appointment) => {
      setEditAppointmentData(appointment);
      setShowEditModal(true);
    };
  
  
  
  
    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditAppointmentData((prevData) => ({
        ...prevData,
        [name]: name === "isActive" ? value === "true" : value,
      }));
    };
  
  
  
  
    const handleUpdate = async () => {
      if (!editAppointmentData?.appointmentId) return;
    
      try {
        const API_URL = `https://localhost:7265/api/appointments/${editAppointmentData.appointmentId}`;
        console.log(API_URL);
        const token = localStorage.getItem("authToken");
    
        await axios.put(API_URL, editAppointmentData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        setAppointments(
          appointments?.map((appointment) =>
            appointment.appointmentId === editAppointmentData.appointmentId ? editAppointmentData : appointment
          )
        );
    
        setShowEditModal(false);
        setEditAppointmentData(null);
      } 
      catch (error) {
        console.error("Error updating appointment:", error);
      } 
      finally {
        setShowEditModal(false);
        setEditAppointmentData(null);
      }
    };
    
  
  
    const openDeleteModal = (appointmentzId) => {
      setDeleteAppointmentId(appointmentzId);
      setShowDeleteModal(true);
    };
  
  
  
    const handleDelete = async () => {
      if (!deleteAppointmentId) return;
  
      try {
        const API_URL = `https://localhost:7265/api/appointments/${deleteAppointmentId}`;

        const token = localStorage.getItem("authToken");
  
        await axios.delete(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setAppointments(appointments.filter((appointment) => appointment.appointmentId !== deleteAppointmentId));
      } 
      catch (error) {
        console.error("Error deleting appointment:", error);
      }
      
      finally {
        setShowDeleteModal(false);
        setDeleteAppointmentId(null);
      }
    };
  
  

    return (
      <div className="min-h-screen flex bg-gray-100">
      <main className="flex-1 p-4">
        <h2 className="text-3xl font-bold text-center mb-6">
          Appointment Information
        </h2>
        <div className="relative mb-6">
          <button
            onClick={openAddModal}
            className="absolute top-0 right-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Appointment
          </button>
        </div>
        <div className="overflow-x-auto mt-20">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border border-gray-300 text-left">Patient ID</th>
                <th className="py-3 px-4 border border-gray-300 text-left">Doctor ID</th>
                <th className="py-3 px-4 border border-gray-300 text-left">Appointment Date</th>
                <th className="py-3 px-4 border border-gray-300 text-left">Time</th>
                <th className="py-3 px-4 border border-gray-300 text-left">Is Active</th>
                <th className="py-3 px-4 border border-gray-300 text-left">Reason</th>
                <th className="py-3 px-4 border border-gray-300 text-left">Notes</th>
                <th className="py-3 px-4 border border-gray-300 text-left">Created Date</th>
                <th className="py-3 px-1 border border-gray-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="py-3 px-4">{appointment.patientId}</td>
                  <td className="py-3 px-4">{appointment.doctorId}</td>
                  <td className="py-3 px-4">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">{appointment.time}</td>
                  <td className="py-3 px-4">
                    <span className={appointment.isActive ? "text-green-600" : "text-red-600"}>
                      {appointment.isActive ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-3 px-4">{appointment.reason}</td>
                  <td className="py-3 px-4">{appointment.notes}</td>
                  <td className="py-3 px-4">
                    {new Date(appointment.createdDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-1 text-center flex justify-center">
                    <button
                      onClick={() => openEditModal(appointment)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(appointment.appointmentId)}
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
          {showAddModal && newAppointmentData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto">
              <div className="bg-white p-6 rounded shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-screen overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Add New Patient</h3>
                <form>
                  <label className="block mb-2">Patient ID</label>
                  <input
                    type="text"
                    name="patientId"
                    value={newAppointmentData.patientId}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
  
                  <label className="block mb-2">Doctor ID</label>
                  <input
                    type="text"
                    name="doctorId"
                    value={newAppointmentData.doctorId}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
  
                  <label className="block mb-2">Appointment Date</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={newAppointmentData.appointmentDate}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
  
                  <label className="block mb-2">Time</label>
                  <input
                    type="text"
                    name="time"
                    value={newAppointmentData.time}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
  
  
                <label className="block mb-2">Is Active</label>
                <select
                  name="isActive"
                  value={newAppointmentData.isActive ? "true" : "false"}
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
  
                  <label className="block mb-2">Reason</label>
                  <input
                    type="text"
                    name="reason"
                    value={newAppointmentData.reason}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
  
                 <label className="block mb-2">Notes</label>
                  <input
                    type="text"
                    name="notes"
                    value={newAppointmentData.notes}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
  
  
                  <label className="block mb-2">Created Date</label>
                  <input
                    type="date"
                    name="createdDate"
                    value={newAppointmentData.createdDate}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
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
  
          {/* Edit  Modal */}
{showEditModal && editAppointmentData && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto">
    <div className="bg-white p-6 rounded shadow-md w-full md:w-1/2 lg:w-1/3 max-h-screen overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Edit Appointment</h2>
      <form>
        <div className="mb-4">
          <label className="block mb-2">Patient ID</label>
          <input
            type="text"
            name="patientId"
            value={editAppointmentData.patientId}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Doctor ID</label>
          <input
            type="text"
            name="doctorId"
            value={editAppointmentData.doctorId}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Appointment Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={editAppointmentData.appointmentDate.split("T")[0]}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Is Active</label>
          <select
            name="isActive"
            value={editAppointmentData.isActive ? "true" : "false"}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Reason</label>
          <input
            type="text"
            name="reason"
            value={editAppointmentData.reason}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Notes</label>
          <input
            type="text"
            name="notes"
            value={editAppointmentData.notes}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Created Date</label>
          <input
            type="date"
            name="createdDate"
            value={new Date(editAppointmentData.createdDate).toISOString().split('T')[0]}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white py-2 px-4 rounded mr-2 hover:bg-blue-400"
          >
            Update
          </button>
          <button
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
                <h3 className="text-lg font-bold mb-4">Delete Appointment</h3>
                <p>Are you sure you want to delete this appointment?</p>
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

export default AppointmentList;
 





