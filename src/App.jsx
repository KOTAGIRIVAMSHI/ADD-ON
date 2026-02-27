import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import StudyMaterials from './pages/StudyMaterials';
import Events from './pages/Events';
import RideSharing from './pages/RideSharing';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/events" element={<Events />} />
          <Route path="/ride-sharing" element={<RideSharing />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
      <AuthModal />
    </AuthProvider>
  );
}

export default App;
