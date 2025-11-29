import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => (
  <header className="header">
    <motion.div
      className="logo"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Yonko Scholars
    </motion.div>
    <nav className="nav">
      <NavLink to="/" className="nav-link">
        Discover
      </NavLink>
    </nav>
  </header>
);

export default Header;

