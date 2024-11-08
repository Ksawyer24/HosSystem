import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [patientsCount, setPatientsCount] = useState(0);
    const [doctorsCount, setDoctorsCount] = useState(0);
    const [staffMembersCount, setStaffMembersCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const API_URL = 'https://localhost:7265/api'; 
                const token = localStorage.getItem('authToken'); // Get the token from localStorage

                setLoading(true); 

                const [patientsResponse, doctorsResponse, staffResponse] = await Promise.all([
                    axios.get(`${API_URL}/patients/patients-total`, {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        },
                    }),
                    axios.get(`${API_URL}/doctors/doctors-total`, {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        },
                    }),
                    axios.get(`${API_URL}/staff/staff-total`, {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        },
                    }),
                ]);

                setPatientsCount(patientsResponse.data.length);
                setDoctorsCount(doctorsResponse.data.length);
                setStaffMembersCount(staffResponse.data.length);

            } catch (error) {
                console.error('Error fetching counts:', error);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchCounts();
    }, []);



    const chartData = {
        labels: ['Patients', 'Doctors', 'Staff Members'],
        datasets: [
            {
                label: 'Count',
                data: [patientsCount, doctorsCount, staffMembersCount],
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,

        plugins: {
            legend: {
                position: 'top',
            },
            
            title: {
                display: true,
                text: 'Staff Overview',
                
            },
        },
    };


    

    return (
        <div className="min-h-screen flex bg-gray-100">
            
           

            {/* Main Content */}
            <main className="flex-1 p-6">
                <h2 className="text-3xl font-bold text-center mb-6">Dashboard</h2>
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : error ?

                 (
                    <p className="text-red-500 text-center">{error}</p>
                ) : 

                (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-9 mb-6">
                            <div className="bg-white p-4 rounded shadow-md">
                                <h3 className="text-xl font-semibold text-gray-700">Patients</h3>
                                <p className="text-2xl font-bold text-blue-600">{patientsCount}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-md">
                                <h3 className="text-xl font-semibold text-gray-700">Doctors</h3>
                                <p className="text-2xl font-bold text-blue-600">{doctorsCount}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-md">
                                <h3 className="text-xl font-semibold text-gray-700">Staff Members</h3>
                                <p className="text-2xl font-bold text-blue-600">{staffMembersCount}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded shadow-md">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                        
                    </div>
                )}

            </main>
        </div>
    );
};

export default Dashboard;
