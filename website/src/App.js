import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/About';
import Admission from './pages/Amission';
import Faculty from './pages/Faculty';
import Facilities from './pages/Facilities';
import ContactSticky from "./components/ContactSticky";
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import StaffManagement from './pages/admin/StaffManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import ActivityManagement from './pages/admin/ActivityManagement';
import EnquiryManagement from './pages/admin/EnquiryManagement';
import TeacherAssignment from './pages/admin/TeacherAssignment';
import TeacherLogin from './pages/TeacherLogin';
import TeacherDashboard from './pages/teachers/TeacherDashboard';
import TeacherProtectedRoute from './components/TeacherProtectedRoute';
import TeacherAssignments from './pages/teachers/TeacherAssignments';
import ClassTeacherDashboard from './pages/teachers/ClassTeacherDashboard';
import ClerkLogin from './pages/ClerkLogin';
import ClerkDashboard from './pages/ClerkDashboard';
import ClerkProtectedRoute from './components/ClerkProtectedRoute';
import Admissions from './pages/Clark/Admissions';   // Note: spelling "Clark" – ensure folder matches
// Import other clerk modules (create placeholders if needed)
import Bonafide from './pages/Clark/Bonafide';
import IdCard from './pages/Clark/IdCard';
import Enrollment from './pages/Clark/Enrollment';
import LeavingCertificate from './pages/Clark/LeavingCertificate';
import FeeCollection from './pages/Clark/FeeCollection';
import Donations from './pages/Clark/Donations';
import ClerkHome from './pages/Clark/ClerkHome';
import FeeStructure from './pages/admin/FeeStructure';
import Rankers from './pages/admin/Rankers';
import HeroSliderManager from "./pages/admin/HeroSliderManager";



function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />

        {/* Admin Dashboard Layout with nested routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<div>Welcome! Select a section.</div>} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="gallery" element={<GalleryManagement />} />
          <Route path="facilities" element={<div>Facilities (coming soon)</div>} />
          <Route path="activities" element={<ActivityManagement />} />
          <Route path="messages" element={<EnquiryManagement />} />
          <Route path="teachers" element={<TeacherAssignment />} />
          <Route path="fee-structure" element={<FeeStructure />} />
          <Route path="rankers" element={<Rankers />} />
        <Route path="hero-slider" element={<HeroSliderManager />} />


        </Route>

        {/* Teacher Dashboard */}
        <Route
          path="/teacher/dashboard"
          element={
            <TeacherProtectedRoute>
              <TeacherDashboard />
            </TeacherProtectedRoute>
          }
        />
        <Route path="/teacher/assignments" element={<TeacherProtectedRoute><TeacherAssignments /></TeacherProtectedRoute>} />
        <Route path="/teacher/class-teacher" element={<ClassTeacherDashboard />} />

        {/* Clerk Routes */}
        <Route path="/clerk/login" element={<ClerkLogin />} />
        <Route
          path="/clerk/dashboard"
          element={
            <ClerkProtectedRoute>
              <ClerkDashboard />
            </ClerkProtectedRoute>
          }
        >
          <Route index element={<ClerkHome />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="bonafide" element={<Bonafide />} />
          <Route path="idcard" element={<IdCard />} />
          <Route path="enrollment" element={<Enrollment />} />
          <Route path="lc" element={<LeavingCertificate />} />
          <Route path="fees" element={<FeeCollection />} />
          <Route path="donations" element={<Donations />} />
        </Route>
      </Routes>
      <ContactSticky />
    </>
  );
}

export default App;