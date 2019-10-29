import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './page/home/Home';

import './index.css';

const routing = (
    <Router>
        <div>
            <Route path="/" component={Home} />
            <Route path="/home" component={Home} />
        </div>
    </Router>
)

ReactDOM.render(
    routing,
    document.getElementById('root')
);
