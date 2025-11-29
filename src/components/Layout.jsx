import Header from './Header.jsx';
import SloganBar from './SloganBar.jsx';
import CodeModal from './CodeModal.jsx';

const Layout = ({ children }) => (
  <div className="app-shell">
    <Header />
    <SloganBar />
    <main className="main-content">{children}</main>
    <CodeModal />
  </div>
);

export default Layout;

