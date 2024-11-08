import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const BillingInv = () => {
    const [billings, setBillings] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBillingData, setBillingData] = useState({
      invoiceNumber: "",
      patient: "",
      patientAddress: "",
      patientContact: "",
      items: [
        {
          id: Date.now(),
          itemName: "",
          unitPrice: 0,
          quantity: 1,
        },
      ],
    });
    const [totalAmount, setTotalAmount] = useState(0); // Add state for totalAmount
    // const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [deleteBillingId, setDeleteBillingId] = useState(null);
  
    useEffect(() => {
      const fetchInvoices = async () => {
        try {
          const API_URL = "https://localhost:7265/api/billinginvoice";
          const token = localStorage.getItem("authToken");
  
          const response = await axios.get(API_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setBillings(response.data);
        } catch (error) {
          console.error("Error fetching invoice data:", error);
        }
      };
  
      fetchInvoices();
    }, []);
  
    useEffect(() => {
      // Recalculate totalAmount whenever items change
      const total = newBillingData.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );
      setTotalAmount(total);
    }, [newBillingData.items]);
  
    const openAddModal = () => {
      setBillingData({
        invoiceNumber: "",
        patient: "",
        patientAddress: "",
        patientContact: "",
        items: [
          {
            id: Date.now(),
            itemName: "",
            unitPrice: 0,
            quantity: 1,
          },
        ],
      });
      setTotalAmount(0); // Reset total amount when modal opens
      setShowAddModal(true);
    };
  
    const handleAddChange = (e) => {
      const { name, value } = e.target;
      setBillingData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleItemChange = (index, field, value) => {
      const updatedItems = [...newBillingData.items];
      updatedItems[index][field] = value;
      setBillingData((prevData) => ({ ...prevData, items: updatedItems }));
    };
  
    const addItem = () => {
      const newItem = {
        id: Date.now(),
        itemName: "",
        unitPrice: 0,
        quantity: 1,
      };
      setBillingData((prevData) => ({ ...prevData, items: [...prevData.items, newItem] }));
    };
  
    const removeItem = (index) => {
      const updatedItems = newBillingData.items.filter((_, i) => i !== index);
      setBillingData((prevData) => ({ ...prevData, items: updatedItems }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("authToken");
  
      const dataToSubmit = { ...newBillingData, totalAmount };
  
      try {
        const response = await axios.post(
          "https://localhost:7265/api/billinginvoice/billing-add",
          dataToSubmit,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setBillings((prev) => [...prev, response.data]);
        setShowAddModal(false);
      } catch (error) {
        console.error("Error adding invoice:", error);
      }


    
    
    };

    // const openDeleteModal = (billingId) => {
    //     setDeleteBillingId(billingId);
    //     setShowDeleteModal(true);
    //   };


    // const handleDelete = async () => {
    //     if (!deleteBillingId) return;
    
    //     try {
    //       const API_URL = `https://localhost:7265/api/billinginvoice/${deleteBillingId}`;
    //       const token = localStorage.getItem("authToken");
    
    //       await axios.delete(API_URL, {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       });
    
    //       setBillings(billings.filter((bill) => bill.id !== deleteBillingId));
          
    //     } 
    //     catch (error) {
    //       console.error("Error deleting invoice:", error);
    //     } 
    //     finally{
    //       setShowDeleteModal(false); // Close modal after deleting
    //       setDeleteBillingId(null);
    //     }
        
     
    //   };
  
  
    return (
      <div className="min-h-screen flex bg-gray-100">
        {/* main content */}
        <main className="flex-1 p-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            Biiling Invoice Information
          </h2>
  
          <div className="relative mb-6">
            <button
              onClick={openAddModal}
              className="absolute top-0 right-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Billing Invoice
            </button>
          </div>
  
          <div className="overflow-x-auto mt-20">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
          {/* <th className="py-3 px-4 border border-gray-300 text-left">#</th>  */}
            <th className="py-3 px-4 border border-gray-300 text-left">Invoice Number</th>
            <th className="py-3 px-4 border border-gray-300 text-left">Patient Name</th>
            <th className="py-3 px-4 border border-gray-300 text-left">Patient Address</th>
            <th className="py-3 px-4 border border-gray-300 text-left">Patient Contact</th>
            <th className="py-3 px-4 border border-gray-300 text-left">Items</th>
            <th className="py-3 px-4 border border-gray-300 text-left">Total Amount</th>
            {/* <th className="py-3 px-1 text-center">Actions</th> */}
          </tr>
        </thead>

        <tbody>
          {billings.map((billing) => (
            <tr key={billing.id} className="border-b border-gray-300 hover:bg-gray-50">
               {/* <td className="py-3 px-4 border border-gray-300 text-left">{index + 1}</td>  */}
              <td className="py-3 px-4">{billing.invoiceNumber}</td>
              <td className="py-3 px-4">{billing.patient}</td>
              <td className="py-3 px-4">{billing.patientAddress}</td>
              <td className="py-3 px-4">{billing.patientContact}</td>

              {/* Step 3: Render Items */}
              <td className="py-3 px-4">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="border border-gray-300">Item Name</th>
                      <th className="border border-gray-300">Unit Price</th>
                      <th className="border border-gray-300">Quantity</th>
                   
                    </tr>
                  </thead>
                  <tbody>
                    {billing.items.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300">{item.itemName}</td>
                        <td className="border border-gray-300">${item.unitPrice}</td>
                        <td className="border border-gray-300">{item.quantity}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>

              <td className="py-3 px-4">${billing.totalAmount}</td>

              <td className="py-3 px-1 text-center flex justify-center">
                {/* <button
                  onClick={() => openDeleteModal(billing.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                >
                  Delete
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
         
        {/* Add Modal */}
        {showAddModal && newBillingData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-screen overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">Add New Billing</h3>
              <form onSubmit={handleSubmit}>
                <label className="block mb-2">Invoice Number</label>
                <input
                  type="text"
                  name="invoiceNumber"
                  placeholder="Invoice number"
                  value={newBillingData.invoiceNumber}
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />

                <label className="block mb-2">Patient Name</label>
                <input
                  type="text"
                  name="patient"
                  placeholder="Patient Name"
                  value={newBillingData.patient}
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />

                <label className="block mb-2">Patient Address</label>
                <input
                  type="text"
                  name="patientAddress"
                  placeholder="Patient Address"
                  value={newBillingData.patientAddress}
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />

                <label className="block mb-2">Patient Contact</label>
                <input
                  type="tel"
                  name="patientContact"
                  placeholder="Patient Contact"
                  value={newBillingData.patientContact}
                  onChange={handleAddChange}
                  className="w-full h-10 mb-4 border border-gray-300 rounded"
                />

                <label className="block mb-2">Items</label>
                {newBillingData.items.map((item, index) => (
                  <div key={item.id} className="mb-4">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={item.itemName}
                      onChange={(e) => handleItemChange(index, "itemName", e.target.value)}
                      className="w-full h-10 mb-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value))}
                      className="w-full h-10 mb-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                      className="w-full h-10 mb-2 border border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                    >
                      Remove Item
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 mb-4"
                >
                  Add Item
                </button>

                <label className="block mb-2 font-bold">Total Amount: ${totalAmount}</label>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-400"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
  
          
          {/* Delete Modal
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h3 className="text-lg font-bold mb-4">Delete Billing Invoice</h3>
                <p>Are you sure you want to delete this Invoice?</p>
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
          )} */}
        </main>
      </div>
    );
  

};

export default BillingInv;
 





