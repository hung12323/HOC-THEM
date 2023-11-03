import React from 'react';
import {Provider} from 'react-redux';

import Bookmark from './Bookmark';
import store from './store';
const App = () => {
  return (
    <Provider store={store}>
      <Bookmark />
    </Provider>
  );
};

export default App;
