import React, { useState } from 'react';

import Footer from '../Footer/Footer';

import Register from '../Register/Register';

import Login from '../Login/Login';

function Container() {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div>
      {showLogin ? (
        <Login setShowLogin={setShowLogin} />
      ) : (
        <Register setShowLogin={setShowLogin} />
      )}
      <Footer />
    </div>
  );
}

export default Container;
