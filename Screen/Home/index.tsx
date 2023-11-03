import React from 'react';
import {Provider} from 'react-redux';

import About from './About';
import store from './store';
const App = () => {
  return (
    <Provider store={store}>
      <About />
    </Provider>
  );
};

export default App;
