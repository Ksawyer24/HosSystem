import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import {z} from "zod"

const LabTestList = () => {
    const [labTests, setLabTests] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false)
    const [newTestData, setNewTestData] = useState({
        patientId: "",
        mls: "",
        reviewedBy: "",
        testName: "",
        testDate: "",
        results: "",
        notes: "",
      });
      const [formErrors, setFormErrors] = useState({});



    useEffect(() => {
        const fetchLabTests = async () => {
            try {
                const API_URL = 'https://localhost:7265/api/labtests'; // Adjust your API URL 
                const token = localStorage.getItem('authToken');
                
                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setLabTests(response.data);
            } catch (error) {
                console.error('Error fetching lab test data:', error);
            }
        };

        fetchLabTests();
    }, []);


    const testSchema = z.object({
      patientId: z
      .coerce
      .number({
        required_error: "Patient ID is required",
        invalid_type_error: "Patient ID must be a number",
      })
      .min(1, { message: "Patient ID must be at least 1" }),


      mls: z.string().min(1, "Medical Laboratory Scientist is required"),
      reviewedBy: z.string().min(1, "Reviewed By is required"),
      testName: z.string().min(1, "Test Name is required"),
      testDate: z.string().min(1, "Test Date is required"),
      results: z.string().min(1, "Results is required"),
    
    });



    const handleAddTest = async () => {

      const result = testSchema.safeParse(newTestData);
      if (!result.success) {
        const errors = result.error.format();
        
        setFormErrors({
          patientId: errors.patientId?._errors[0],
          mls: errors.mls?._errors[0],
          reviewedBy: errors.reviewedBy?._errors[0],
          testName: errors.testName?._errors[0],
          testDate: errors.testDate?._errors[0],
          results: errors.results?._errors[0],
         
        });
        return;
      }


        try {
          const API_URL = "https://localhost:7265/api/labtests/labtest-add";
          const token = localStorage.getItem("authToken");
    
          console.log(newTestData)
    
          await axios.post(API_URL, newTestData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
    
    
          });
    
          setLabTests([...labTests, newTestData]);
          setShowAddModal(false); // Close modal after adding
    
        } 
        
        catch (error) {
          console.error("Error adding test result:", error);
        }

      };


    const handleAddChange = (e) =>{
        const{name,value} = e.target;


        setNewTestData((prevData) => ({
            ...prevData,
            [name]: value,
          }));

    }



    const openAddModal = () => {
        setNewTestData({
          patientId: "",
          mls: "",
          reviewedBy: "",
          testName: "",
          testDate: "",
          results: "",
          notes: "",
        });
        setShowAddModal(true);

      };

    return (
        <div className="min-h-screen flex bg-gray-100">


            {/* Main Content */}
            <main className="flex-1 p-4">
                <h2 className="text-3xl font-bold text-center mb-6">Lab Test Information</h2>
                <div className="relative mb-6">
                <button
             onClick={openAddModal}
            className="absolute top-0 right-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
                 >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Test Result
               </button>
                </div>

                <div className="overflow-x-auto mt-20">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border border-gray-300 text-left">Patient ID</th>
                                <th className="py-3 px-4 border border-gray-300 text-left">MLS</th>
                                <th className="py-3 px-4 border border-gray-300 text-left">Reviewed By</th>
                                <th className="py-3 px-4 border border-gray-300 text-left">Test Name</th>
                                <th className="py-3 px-4 border border-gray-300 text-left">Test Date</th>
                                <th className="py-3 px-4 border border-gray-300 text-left">Results</th>
                                <th className="py-3 px-4 border border-gray-300 text-left">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labTests.map((test) => (
                                <tr key={test.id} className="border-b border-gray-300 hover:bg-gray-50">
                                    <td className="py-3 px-4">{test.patientId}</td>
                                    <td className="py-3 px-4">{test.mls}</td>
                                    <td className="py-3 px-4">{test.reviewedBy}</td>
                                    <td className="py-3 px-4">{test.testName}</td>
                                    <td className="py-3 px-4">{new Date(test.testDate).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">{test.results}</td>
                                    <td className="py-3 px-4">{test.notes || '-'}</td>
                                </tr>
                            ))}


        {/* Add Modal */}
{showAddModal && newTestData && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded shadow-lg w-1/3 max-h-[80vh] overflow-y-auto"> {/* Add max height and scroll */}
      <h3 className="text-lg font-bold mb-4">Add new lab test</h3>
      <form>
        <label className="block mb-2">Patient Id</label>
        <input
          type="text"
          name="patientId"
          value={newTestData.patientId}
          onChange={handleAddChange}
          className="w-full h-10 mb-4  border border-gray-300 rounded"
        />
        {formErrors.patientId && (
          <p className="text-red-500 text-sm mb-4">{formErrors.patientId}</p>
        )}

        <label className="block mb-2">Mls</label>
        <input
          type="text"
          name="mls"
          value={newTestData.mls}
          onChange={handleAddChange}
          className="w-full h-10 mb-4  border border-gray-300 rounded"
        />
        {formErrors.mls && (
          <p className="text-red-500 text-sm mb-4">{formErrors.mls}</p>
        )}

        <label className="block mb-2">Reviewed By</label>
        <input
          type="text"
          name="reviewedBy"
          value={newTestData.reviewedBy}
          onChange={handleAddChange}
          className="w-full h-10 mb-4  border border-gray-300 rounded"
        />
        {formErrors.reviewedBy && (
          <p className="text-red-500 text-sm mb-4">{formErrors.reviewedBy}</p>
        )}

        <label className="block mb-2">Test Name</label>
        <input
          type="text"
          name="testName"
          value={newTestData.testName}
          onChange={handleAddChange}
          className="w-full h-10 mb-4  border border-gray-300 rounded"
        />
        {formErrors.testName && (
          <p className="text-red-500 text-sm mb-4">{formErrors.testName}</p>
        )}

        <label className="block mb-2">Test Date</label>
        <input
          type="date"
          name="testDate"
          value={newTestData.testDate}
          onChange={handleAddChange}
          className="w-full h-10 mb-4  border border-gray-300 rounded"
        />
        {formErrors.testDate && (
          <p className="text-red-500 text-sm mb-4">{formErrors.testDate}</p>
        )}

        <label className="block mb-2">Results</label>
        <textarea
          type="text"
          name="results"
          value={newTestData.results}
          onChange={handleAddChange}
          className="w-full h-10 mb-4  border border-gray-300 rounded"
        />
        {formErrors.results && (
          <p className="text-red-500 text-sm mb-4">{formErrors.results}</p>
        )}

        <label className="block mb-2">Notes</label>
        <textarea
          type="text"
          name="notes"
          value={newTestData.notes}
          onChange={handleAddChange}
          className="w-full h-10 mb-4  border border-gray-300 rounded"
        />
      </form>
      <div className="flex justify-end">
        <button
          onClick={handleAddTest}
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


                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};


export default LabTestList;
