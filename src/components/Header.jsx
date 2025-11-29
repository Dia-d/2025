import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserCode } from '../context/UserCodeContext.jsx';

const Header = () => {
  const { code } = useUserCode();
  
  // Check if user has a token (for now, we'll use code as session ID)
  // In the future, you can add a separate token check here
  const userToken = null; // Replace with actual token check when you implement login
  const displayCode = userToken || code;

  return (
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
        {displayCode && (
          <div className="user-code-display" title={userToken ? 'User Token' : 'Session ID'}>
            {userToken ? 'Token' : 'ID'}: {displayCode}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

