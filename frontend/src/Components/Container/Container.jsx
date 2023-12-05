import React, { useState } from 'react';

// import PropTypes from 'prop-types';

// import Header from '../Header/Header';

// import { Route, Routes } from 'react-router-dom';

import Footer from '../Footer/Footer';

import Register from '../Register/Register';

import Login from '../Login/Login';

// import History from '../History/History';

// import Articles from '../Articles/Articles';

// import Articles from '../Articles/Articles';

function Container() {
  const [showLogin, setShowLogin] = useState(true);
  // console.log(showLogin);
  return (
    <div>
      {showLogin ? (
        <Login setShowLogin={setShowLogin} />
      ) : (
        <Register setShowLogin={setShowLogin} />
      )}
      {/* <Routes>
<Route path="/article" element={<Articles />} />
        <Route path="/history" element={<History />} />
      </Routes> */}
      <Footer />
    </div>
  );
}

// Login.propTypes = {
//   setShowOtpForm: PropTypes.func.isRequired,
// };
export default Container;
