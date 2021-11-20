import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

//import all the modules
import Login from './modules/authentication_module/views/login';
import Dashboard  from './modules/dashboard/views';
import Users from './modules/users_module/views';
import AddUsers from './modules/users_module/views/add_users';
import UserInfo from './modules/users_module/views/user_info';
import Opportunities from './modules/opportunities/views';

// import Expenses from "./modules/expenses";
// import Invoices from "./modules/invoices";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import AddOpportunity from './modules/opportunities/views/add_opportunity';
import Opportunity from './modules/opportunities/views/oppotunity';
import VerificationDocs from './modules/verification/views/verification';
import VerificationInfo from './modules/verification/views/verification_info';
import Scholars from './modules/scholars/views';
import Events from './modules/events/views';
import AddEvent from './modules/events/views/add_event';
import EventInfo from './modules/events/views/event_info';
import Adverts from './modules/adverts/views';
import AddAdvert from './modules/adverts/views/ad_ads';
import AddInfo from './modules/adverts/views/ad_info';
import ReferralCodes from './modules/referral_codes/views';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Dashboard/>}/>
      <Route path="/users" element={<Users/>}/>
      <Route path="/users/add" element={<AddUsers/>}/>
      <Route path="/users/:id/:userType" element={<UserInfo/>}/>
      <Route path="/opportunities" element={<Opportunities/>}/>
      <Route path="/opportunities/add" element={<AddOpportunity/>}/>
      <Route path="/opportunities/:id" element={<Opportunity/>}/>
      <Route path="/verification_docs" element={<VerificationDocs/>}/>
      <Route path="/verification_docs/:id" element={<VerificationInfo/>}/>
      <Route path="/scholars" element={<Scholars/>}/>
      <Route path="/events" element={<Events/>}/>
      <Route path="/events/add" element={<AddEvent/>}/>
      <Route path="/events/:id" element={<EventInfo/>}/>
      <Route path="/ads" element={<Adverts/>}/>
      <Route path="/ads/add" element={<AddAdvert/>}/>
      <Route path="/ads/:id" element={<AddInfo/>}/>
      <Route path="/referral_codes" element={<ReferralCodes/>}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
