import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Universities from './pages/Universities.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/universities/:countryCode" element={<Universities />} />
      </Routes>
    </Layout>
  );
}

export default App;

