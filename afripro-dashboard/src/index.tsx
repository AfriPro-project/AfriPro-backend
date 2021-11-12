import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

//import all the modules
import Login from './modules/authentication_module/views/login';
import Dashboard  from './modules/dashboard/views';
import Users from './modules/users_module/views';
// import Expenses from "./modules/expenses";
// import Invoices from "./modules/invoices";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Dashboard/>}/>
      <Route path="/users" element={<Users/>}/>
      {/* <Route path="expenses" element={<Expenses />} />
      <Route path="invoices" element={<Invoices />} /> */}
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
