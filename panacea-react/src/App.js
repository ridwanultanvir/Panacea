import React from 'react';
import './App.css';
import Main from './Component/MainComponent'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from './Redux/ConfigureStore'

const store = configureStore()

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <Main />
        </div>
      </BrowserRouter>
    </Provider>

  );
}

export default App;
