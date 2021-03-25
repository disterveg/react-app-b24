import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {BrowserRouter} from 'react-router-dom';
import App from './components/App/App';
import {Provider} from 'react-redux';
import configureStore from './configureStore';

const store = configureStore();

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

