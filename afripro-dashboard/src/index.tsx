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
import Messages from './modules/messages/views';
import MessageInfo from './modules/messages/views/message';
import ChatForum from './modules/chat_forum/views';
import SettingsPage from './modules/authentication_module/views/settings';
import NotFoundPage from './modules/errorPages/views/404';
import ActvityLogs from './modules/actvityLogs/views';
import ServicesPage from './modules/services/views';
import AddReferralCode from './modules/referral_codes/views/add_referral_code';
import ReferralCode from './modules/referral_codes/views/referral_code_info';
import ReferralCodeUsage from './modules/referral_codes/views/usages';

ReactDOM.render(
  <BrowserRouter>
    {localStorage.getItem("userData") ?
    <Routes>
      <Route path="/" element={<Dashboard/>}/>
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
      <Route path="/referral_codes/add" element={<AddReferralCode/>}/>
      <Route path="/referral_codes/:id" element={<ReferralCode/>}/>
      <Route path="//referral_codes/usage_count/:id" element={<ReferralCodeUsage/>}/>
      <Route path="/messages" element={<Messages/>}/>
      <Route path="/messages/:id/:chat" element={<MessageInfo/>}/>
      <Route path="/chat_forum" element={<ChatForum/>}/>
      <Route path="/settings" element={<SettingsPage/>}/>
      <Route path="/activity_log" element={<ActvityLogs/>}/>
      <Route path="/services" element={<ServicesPage/>}/>
      <Route path='*' element={<NotFoundPage/>} />
    </Routes>
    :
    <Routes>
    <Route path="/" element={<Login />} />
     <Route path='*' element={<NotFoundPage/>} />
    </Routes>
    }
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
