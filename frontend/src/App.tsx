import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Projects  from "./pages/Projects";
import Clinics  from "./pages/Clinics";
import Login  from "./pages/Login";
import Specialty  from "./pages/Specialty";
import Signup from "./pages/Signup";
import Doctors from "./pages/Doctors";
import DoctorsTimes from "./pages/DoctorsTimes";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Projects/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/projects/:projectId/clinics"  element={<Clinics/>}/>
         <Route path="/Specialty/:ClId" element={<Specialty/>}/>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/Doctors/:ClId/:SpId" element={<Doctors/>} />
        <Route path="/DoctorsTimes/:Id" element={<DoctorsTimes/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;