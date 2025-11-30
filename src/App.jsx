import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Universities from './pages/Universities.jsx';
import Roadmap from './pages/Roadmap.jsx';
import FurtherProgress from './pages/FurtherProgress.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/universities/:countryCode" element={<Universities />} />
        <Route path="/roadmap/:universityId" element={<Roadmap />} />
        <Route path="/further-progress/:universityId" element={<FurtherProgress />} />
      </Routes>
    </Layout>
  );
}

export default App;

