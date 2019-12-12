import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import thunk from 'redux-thunk';
import promise from 'redux-promise';
import allReducers from './Auth/Redux/reducers';

import './index.css';
import App from './Auth/App';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

const store = createStore(
    allReducers,
    applyMiddleware(thunk, promise)
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter basename="/usermanagement">
            <LocaleProvider locale={enUS}>
                <App />
            </LocaleProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
