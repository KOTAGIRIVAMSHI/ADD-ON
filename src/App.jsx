import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ListingDetail from './pages/ListingDetail';
import StudyMaterials from './pages/StudyMaterials';
import Events from './pages/Events';
import RideSharing from './pages/RideSharing';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import Guidelines from './pages/Guidelines';
import Contact from './pages/Contact';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AuthModal from './components/AuthModal';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:listingId" element={<ListingDetail />} />
            <Route path="/study-materials" element={<StudyMaterials />} />
            <Route path="/events" element={<Events />} />
            <Route path="/ride-sharing" element={<RideSharing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
        <AuthModal />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
