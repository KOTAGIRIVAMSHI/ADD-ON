import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import StudyMaterials from './pages/StudyMaterials';
import Events from './pages/Events';
import RideSharing from './pages/RideSharing';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/study-materials" element={<StudyMaterials />} />
        <Route path="/events" element={<Events />} />
        <Route path="/ride-sharing" element={<RideSharing />} />
      </Routes>
    </Layout>
  );
}

export default App;
