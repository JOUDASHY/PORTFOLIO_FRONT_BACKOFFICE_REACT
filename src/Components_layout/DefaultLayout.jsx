import { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useStateContext } from '../contexts/contextprovider';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';


import Footer from '../components/Footer';
// import LoadingBar from 'react-top-loading-bar'; // Importez LoadingBar
// import bgImage from '../assets/css/images/bg.jpg';

export default function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();
    const location = useLocation();
    const userId = user?.id;

    // const progressRef = useRef(null); // Référence pour la barre de progression

    // WebSocket effect



    if (!token) {
        return <Navigate to='/login' />;
    }

    if (token) {
        console.log('USER : ',user);
        console.log('TOKEN : ',token);
    }


    return (
        <>
      <div class="loader-bg">
  <div class="loader-track">
    <div class="loader-fill"></div>
  </div>
</div>
<Sidebar user={user} setUser={setUser} setToken={setToken} />
<Header  user={user} setUser={setUser} setToken={setToken} />
<div class="pc-container">
<div class="pc-content">
<div class="row">



                <Outlet />
                </div>
                </div>
                </div>
                <Footer  />
    </>
    
    );
}
