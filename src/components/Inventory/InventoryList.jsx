import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {z} from "zod"

const InventoryList = () => {
    
    const [inventories, setInventory] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newInventoryData, SetInventoryData] = useState({
      name: "",
      dateOfDelivery: "",
      expiryDate: "",
      quantity: "",
      supplier: "",
      supplierContact: ""
    });
  
    const [showEditModal, setShowEditModal] = useState(false);
    const [editInventoryData, setEditInventoryData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInventoryId, setDeleteInventoryId] = useState(null);
    const [formErrors, setFormErrors] = useState({});
  
    useEffect(() => {
      const fetchInventory = async () => {
        try {
          const API_URL = "https://localhost:7265/api/inventory/inventory-total";
          const token = localStorage.getItem("authToken");
  
          const response = await axios.get(API_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setInventory(response.data);
        } catch (error) {
          console.error("Error fetching inventory data:", error);
        }
      };
  
      fetchInventory();
    }, []);
  
    const openAddModal = () => {
      SetInventoryData({
        name: "",
        dateOfDelivery: "",
        expiryDate: "",
        quantity: "",
        supplier: "",
        supplierContact: ""
          
      });
  
      setShowAddModal(true);
  
    };
  
  
  
    const handleAddChange = (e) => {
      const { name, value } = e.target;
      SetInventoryData({ ...newInventoryData, [name]: value });
    };



    const inventorySchema = z.object({
      name: z.string().min(1, "Name is required"),
      dateOfDelivery: z.date({
        invalid_type_error: "Delivery Date must be  valid ",
      }),

      expiryDate: z.date({
        invalid_type_error: "Expiry Date must be valid ",
      }),

      quantity: z.string().min(1, "Quantity is required"),
      
      supplier: z.string().min(1, "Supplier is required"),

      supplierContact: z
      .string()
      .regex(
        /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?[-.\s]?)?(\d{1,4}[-.\s]?){1,3}\d{1,4}$/,
        "Supplier Contact must be a valid phone number"
      ),
    });
  
  
  
  
    const handleSubmit = async (e) => {




      // const errors = {};

      // // Validatig my field here
      // if (!newInventoryData.name) errors.name = "Name is required.";
  
      // if (!newInventoryData.dateOfDelivery) errors.dateOfDelivery = "Date of Delivery is required.";
  
      // if (!newInventoryData.expiryDate) errors.expiryDate = "Expiry Date is required.";
  
      // if (!newInventoryData.quantity) errors.quantity = "Quantity is required.";
      
      // if (!newInventoryData.supplier) errors.supplier = "Supplier is required.";
  
      // if (!newInventoryData.supplierContact) errors.supplierContact = "Supplier Contact is required.";
  
  
      // // If there are errors, update formErrors state and stop execution
      // if (Object.keys(errors).length > 0) {
      //   setFormErrors(errors);
      //   return;
      // }
  
      // // Clear previous errors if validation passes
      // setFormErrors({});





      e.preventDefault();

      const result = inventorySchema.safeParse(newInventoryData);
      if (!result.success) {
        const errors = result.error.format();
        setFormErrors({
          name: errors.name?._errors[0],
          dateOfDelivery: errors.dateOfDelivery?._errors[0],
          expiryDate: errors.expiryDate?._errors[0],
          quantity: errors.quantity?._errors[0],
          supplier: errors.supplier?._errors[0],
          supplierContact: errors.supplierContact?._errors[0],
        });
        return;
      }




      const token = localStorage.getItem("authToken");
  
      console.log(newInventoryData)
    
      try {
        const response = await axios.post(
          "https://localhost:7265/api/inventory/inventory-add",
  
          newInventoryData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setInventory((prev) => [...prev, response.data]); // Update state with new Inventory
        setShowAddModal(false); // Close modal after adding
      } catch (error)
      
      {
        console.error("Error adding inventory:", error);
      }
  
    };
  
  
  
    const openEditModal = (Inventory) => {
      setEditInventoryData(Inventory);
      setShowEditModal(true);
    };
  
  
  
  
    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditInventoryData((prevData) => ({
          ...prevData,
          [name]: value,
      }));
  };
  
  
  
  
  
    const handleUpdate = async () => {
      if (!editInventoryData) return;
  
      try {
        const API_URL = `https://localhost:7265/api/inventory/${editInventoryData.id}`;
        const token = localStorage.getItem("authToken");
  
        await axios.put(API_URL, editInventoryData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setInventory(
          inventories.map((inventories) =>
            inventories.id === editInventoryData.id ? editInventoryData : inventories
          )
        );
        setShowEditModal(false); // Close modal after updating
        setEditInventoryData(null);
      } catch (error) {
        console.error("Error updating inventory:", error);
      }
    };
  
    const openDeleteModal = (inventoryId) => {
      setDeleteInventoryId(inventoryId);
      setShowDeleteModal(true);
    };
  
  
  
    const handleDelete = async () => {
      if (!deleteInventoryId) return;
  
      try {
        const API_URL = `https://localhost:7265/api/inventory/${deleteInventoryId}`;
        const token = localStorage.getItem("authToken");
  
        await axios.delete(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setInventory(inventories.filter((inventory) => inventory.id !== deleteInventoryId));
      } 
      catch (error) {
        console.error("Error deleting inventory:", error);
      } 
      finally {
        setShowDeleteModal(false);
        setDeleteInventoryId(null);
      }
    };
  
  
  
  
  
  
  
  
    return (
      <div className="min-h-screen flex bg-gray-100">
        {/* main content */}
        <main className="flex-1 p-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            Inventory 
          </h2>
  
          <div className="relative mb-6">
            <button
              onClick={openAddModal}
              className="absolute top-0 right-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Inventory
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
                    Date Of Delivery
                  </th>

                  <th className="py-3 px-4 border border-gray-300 text-left">
                    Expiry Date
                  </th>

                  <th className="py-3 px-4 border border-gray-300 text-left"> 
                   Quantity
                  </th>

                   <th className="py-3 px-4 border border-gray-300 text-left">
                   Supplier
                  </th> 

                  <th className="py-3 px-4 border border-gray-300 text-left">
                   Supplier Contact
                  </th>

                  <th className="py-3 px-4 border border-gray-300 text-left">
                   Actions
                  </th> 

                </tr>
              </thead>
  
              <tbody>
                {inventories.map((inventories) => (
                  <tr
                    key={inventories.id}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{inventories.name}</td>

                     { <td className="py-3 px-4">
                      {new Date(inventories.dateOfDelivery).toLocaleDateString()}
                    </td> }

                    { <td className="py-3 px-4">
                      {new Date(inventories.expiryDate).toLocaleDateString()}
                    </td> }
                   
                    <td className="py-3 px-4">{inventories.quantity}</td>
  
                    <td className="py-3 px-4">{inventories.supplier}</td>

                    <td className="py-3 px-4">{inventories.supplierContact}</td>
                   

                    <td className="py-3 px-1 text-center flex justify-center">
                    <button
                      onClick={() => openEditModal(inventories)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(inventories.id)}
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
          {showAddModal && newInventoryData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto">
              <div className="bg-white p-6 rounded shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-screen overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Add New Invnetory</h3>
                <form>
                  <label className="block mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newInventoryData.name}
                    required
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
                   {formErrors.name && (
                  <p className="text-red-500 text-sm mb-4">{formErrors.name}</p>
                )}
  
                  <label className="block mb-2">Date Of Delivery</label>
                  <input
                    type="date"
                    name="dateOfDelivery"
                    value={newInventoryData.dateOfDelivery}
                    required
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
                   {formErrors.dateOfDelivery && (
                  <p className="text-red-500 text-sm mb-4">{formErrors.dateOfDelivery}</p>
                )}
  
                  <label className="block mb-2">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={newInventoryData.expiryDate}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
                   {formErrors.expiryDate && (
                  <p className="text-red-500 text-sm mb-4">{formErrors.expiryDate}</p>
                )}
  
                  <label className="block mb-2">Quantity</label>
                  <input
                    type="text"
                    name="quantity"
                    value={newInventoryData.quantity}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
                   {formErrors.quantity && (
                  <p className="text-red-500 text-sm mb-4">{formErrors.quantity}</p>
                )}
  
  
                  <label className="block mb-2">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={newInventoryData.supplier}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
                   {formErrors.supplier && (
                  <p className="text-red-500 text-sm mb-4">{formErrors.supplier}</p>
                )}
                  
                  <label className="block mb-2">Supplier Contact</label>
                  <input
                    type="tel"
                    name="supplierContact"
                    value={newInventoryData.supplierContact}
                    onChange={handleAddChange}
                    className="w-full h-10 mb-4 border border-gray-300 rounded"
                  />
                   {formErrors.supplierContact && (
                  <p className="text-red-500 text-sm mb-4">{formErrors.supplierContact}</p>
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
          {showEditModal && editInventoryData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h3 className="text-lg font-bold mb-4">Edit Inventory</h3>
                <form>
                  <label className="block mb-2"> Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editInventoryData.name}
                    onChange={handleEditChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                  />

  
                  <label className="block mb-2"> Date Of Delivery</label>
                  <input
                    type="date"
                    name="dateOfDelivery"
                    value={editInventoryData.dateOfDelivery.split("T")[0]}
                    onChange={handleEditChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                  />

                   <label className="block mb-2"> Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={editInventoryData.expiryDate.split("T")[0]}
                    onChange={handleEditChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                  />
  
                  <label className="block mb-2">Quantity</label>
                  <input
                    type="text"
                    name="quantity"
                    value={editInventoryData.quantity}
                    onChange={handleEditChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                  />
  
  
                 <label className="block mb-2">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={editInventoryData.supplier}
                    onChange={handleEditChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                  />

                  <label className="block mb-2">Supplier Contact</label>
                  <input
                    type="tel"
                    name="supplierContact"
                    value={editInventoryData.supplierContact}
                    onChange={handleEditChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                  />
  

                  <label className="block mb-2">Created Date</label>
                  <input
                    type="date"
                    name="createdDate"
                    value={editInventoryData.createdDate}
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
                <h3 className="text-lg font-bold mb-4">Delete Invnetory</h3>
                <p>Are you sure you want to delete this inventory?</p>
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

export default InventoryList;
 





