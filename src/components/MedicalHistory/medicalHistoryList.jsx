import { useEffect, useState } from 'react';
import axios from 'axios';



const MedicalHistoryList = () => {
    const [medicalHistories, setMedicalHistories] = useState([]);

    useEffect(() => {
        const fetchMedicalHistories = async () => {
            try {
                const API_URL = 'https://localhost:7265/api/medicalhistory/histories-total';
                const token = localStorage.getItem('authToken');
                
                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setMedicalHistories(response.data);
            } catch (error) {
                console.error('Error fetching medical history data:', error);
            }
        };

        fetchMedicalHistories();
    }, []);

    return (
        <div className="min-h-screen flex bg-gray-100">
           

            {/* Main Content */}
            <main className="flex-1 p-4">
                <h2 className="text-3xl font-bold text-center mb-6">Medical History Information</h2>
                <div className="overflow-x-auto mt-20">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border border-gray-300 text-left">Patient ID</th>
                                <th className="py-3 px-4 border border-gray-300 text-left">Conditions</th>
                                <th className="py-3 px-4 border border-gray-300 text-left">Medications</th>
                                <th className="py-3 px-4 border border-gray-300 text-left">Allergies</th>
                                <th className="py-3 px-4 border border-gray-300 text-left">Had Surgery</th>
                                <th className="py-3 px-4 border border-gray-300 text-left">Last Visit Date</th>
                                <th className="py-3 px-4 border border-gray-300 text-left">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicalHistories.map((history) => (
                                <tr key={history.patientId} className="border-b border-gray-300 hover:bg-gray-50">
                                    <td className="py-3 px-4">{history.patientId}</td>
                                    <td className="py-3 px-4">{history.conditions.join(', ') || '-'}</td>
                                    <td className="py-3 px-4">{history.medications.join(', ') || '-'}</td>
                                    <td className="py-3 px-4">{history.allergies.join(', ') || '-'}</td>
                                    <td className="py-3 px-4">{history.hadSurgery ? 'Yes' : 'No'}</td>
                                    <td className="py-3 px-4">{new Date(history.dateOfLastVisit).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">{history.notes || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default MedicalHistoryList;
