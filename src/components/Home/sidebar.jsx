import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faUserMd,
  faUsers,
  faBox,
  faFileInvoice,
  faPrescription,
  faVial,
  faFileMedical,
  faArrowLeft,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

function SideBar() {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("authToken");
    navigate("/sign-in");
  }

  return (
    <aside className="sticky top-0 w-64 bg-blue-600 p-4 text-white shadow-md flex flex-col justify-between h-screen">
      <div>
        <h2 className="text-xl font-bold mb-10">HosSys</h2>
        <ul className="flex flex-col space-y-8">
          <li>
            <Link
              to="/dash-home"
              className="flex items-center text-white hover:bg-blue-400 hover:p-2"
            >
              <FontAwesomeIcon icon={faHome} className="mr-4" />
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/patients"
              className="flex items-center text-white hover:bg-blue-400 hover:p-2"
            >
              <FontAwesomeIcon icon={faUser} className="mr-4" />
              Patients
            </Link>
          </li>
          <li>
            <Link
              to="/doctors"
              className="flex items-center text-white hover:bg-blue-400 hover:p-2"
            >
              <FontAwesomeIcon icon={faUserMd} className="mr-4" />
              Doctors
            </Link>
          </li>
          <li>
            <Link
              to="/staff"
              className="flex items-center text-white hover:bg-blue-400 hover:p-2"
            >
              <FontAwesomeIcon icon={faUsers} className="mr-4" />
              Staff
            </Link>
          </li>
          <li>
            <Link
              to="/tests"
              className="flex items-center text-white hover:bg-blue-400 hover:p-2"
            >
              <FontAwesomeIcon icon={faVial} className="mr-4" />
              Tests
            </Link>
          </li>
          <li>
            <Link
              to="/medical-history"
              className="flex items-center text-white hover:bg-blue-400 hover:p-2"
            >
              <FontAwesomeIcon icon={faFileMedical} className="mr-4" />
              Medical History
            </Link>
          </li>

          <li>
            <Link
              to="/appointments"
              className="flex items-center text-white hover:bg-blue-400 hover:p-2"
            >
              <FontAwesomeIcon icon={faCalendar} className="mr-4" />
              Appointments
            </Link>
          </li>

          <li>
            <Link
              to="/inventory"
              className="flex items-center text-white hover:bg-blue-400 hover:p-2"
            >
              <FontAwesomeIcon icon={faBox} className="mr-4" />
              Inventory
            </Link>
          </li>

          <li>
            <Link
              to="/billing-invoice"
              className="flex items-center text-white hover:bg-blue-400 hover:p-2"
            >
              <FontAwesomeIcon icon={faFileInvoice} className="mr-4" />
              Billing Invoice
            </Link>
          </li>

          <li>
            <Link
              to="/prescriptions"
              className="flex items-center text-white hover:bg-blue-400 hover:p-2"
            >
              <FontAwesomeIcon icon={faPrescription} className="mr-4" />
              Prescription
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-auto">
        <ul>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center text-white hover:bg-blue-400 hover:p-2 w-full"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-4" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default SideBar;
