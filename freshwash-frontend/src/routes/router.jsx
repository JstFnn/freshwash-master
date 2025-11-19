import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import Reservation from '../pages/Reservation';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import YourReservation from '../pages/YourReservation';
import OnProgress from '../pages/OnProgress';
import History from '../pages/History';
import ServiceDetail from '../pages/ServiceDetail';
import AdminPage from '../pages/Admin/AdminPage';
import UsersData from '../pages/Admin/UsersData';
import ReservationsData from '../pages/Admin/ReservationsData';
import ReviewsData from '../pages/Admin/ReviewsData';
import RequireAdmin from '../components/RequireAdmin';

const Router = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:slug" element={<ServiceDetail />} />
      
      {/* User Routes */}
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/profile/orders" element={<YourReservation />} />
      <Route path="/profile/on-progress" element={<OnProgress />} />
      <Route path="/profile/history" element={<History />} />
      
      {/* Admin Routes (Protected) */}
      <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
      <Route path="/admin/users" element={<RequireAdmin><UsersData /></RequireAdmin>} />
      <Route path="/admin/reservations" element={<RequireAdmin><ReservationsData /></RequireAdmin>} />
      <Route path="/admin/reviews" element={<RequireAdmin><ReviewsData /></RequireAdmin>} />
      
      {/* Redirect for unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Router;
