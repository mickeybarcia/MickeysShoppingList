import React from 'react';

import AppContext from '../context/AppContext';

const useAppContext = () => {
  return React.useContext(AppContext);
};

export default useAppContext;
