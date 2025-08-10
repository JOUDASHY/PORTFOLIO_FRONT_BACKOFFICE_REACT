import { createBrowserRouter, Route, Routes } from 'react-router-dom';
import { useStateContext } from './contexts/contextprovider';  // Assurez-vous que le chemin est correct
import DefaultLayout from './Components_layout/DefaultLayout.jsx';
import GuestLayout from './Components_layout/GuestLayout.jsx';
import Login from './auth/login.jsx';
import Register from './auth/register.jsx';
import AllEmails from './components/AllEmails.jsx';
import Facebook from './components/Facebook.jsx';
import NotificationsList from './components/NotificationsList.jsx';


import Cv from './components/Cv.jsx';
import Langue from './components/Langue.jsx';






import Formation from './components/Formation.jsx';



import Award from './components/Award.jsx';
import Education from './components/Education.jsx';
import Competence from './components/Competence.jsx';
import Experience from './components/Experience.jsx';
import Dashboard from './components/Dashboard.jsx';
import Projet from './components/Projet.jsx';

import Profile from './components/Profile.jsx';

import Chatbot from './components/Chatbot.jsx';

import Gemini_api from './components/Gemini_api.jsx';
import Historic_mail from './components/Historic_mail.jsx';

import NotFound from './components/NotFound.jsx';




import ForgotPassword from './auth/ForgotPassword.jsx'; // Assurez-vous que le chemin est correct
import ResetPassword from './auth/ResetPassword.jsx'; // Assurez-vous que le chemin est correct
import SetPassword from './auth/SetPassword.jsx'; // Assurez-vous que le chemin est correct

import AllMyLogins from './components/AllMyLogins.jsx'; // Importez le nouveau composant

// import Call_user from "./components/Call_user"; // Chemin vers Call_video.jsx

const RoutesWithAuth = () => {
  const { user } = useStateContext(); // Assurez-vous que l'utilisateur est bien récupéré
  console.log("user :", user); // Debug : Vérifiez dans la console

  // Si user n'est pas défini, afficher un message temporaire
  if (!user) {
    return <div>Chargement des informations utilisateur...</div>;
  }

  return (
    <Routes>
      {/* Routes pour l'admin */}
        <>
          <Route path="AllEmails" element={<AllEmails user={user} />} />
          <Route path="NotificationsList" element={<NotificationsList user={user} />} />
          <Route path="Facebook" element={<Facebook user={user} />} />
    
    
   
          <Route path="Formation" element={<Formation user={user} />} />
          <Route path="/" element={<Dashboard user={user} />} />
         
          {/* <Route path="User" element={<User user={user} />} /> */}
          <Route path="Projet" element={<Projet user={user} />} />
          <Route path="Experience" element={<Experience user={user} />} />
          <Route path="Competence" element={<Competence user={user} />} />
          <Route path="Education" element={<Education user={user} />} />
          <Route path="Award" element={<Award user={user} />} />
          <Route path="all-my-logins" element={<AllMyLogins user={user} />} /> {/* Nouvelle route ajoutée */}
          
          
          
        </>
 
    
      {/* Routes communes */}
 
      <Route path="Profile" element={<Profile user={user} />} />
      <Route path="Profile/:userId" element={<Profile user={user} />} />
     
      <Route path="Langue" element={<Langue user={user} />} />
      <Route path="Cv" element={<Cv user={user} />} />

      <Route path="Chatbot" element={<Chatbot user={user} />} />
      {/* <Route path="Chatbot_hugginface" element={<Chatbot_hugginface user={user} />} /> */}
      <Route path="Historic_mail" element={<Historic_mail user={user} />} />
      <Route path="Gemini_api" element={<Gemini_api user={user} />} />
      
   
      <Route path="*" element={<NotFound />} />
      


    </Routes>
  );
};


const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { path: '*', element: <RoutesWithAuth /> }, // Assurez-vous que toutes les routes d'authentification sont capturées
      { path: '/', element: <RoutesWithAuth /> }, // Assurez-vous que toutes les routes d'authentification sont capturées
    ],
  },
  // Routes invitées (non authentifiées)
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      { path: 'login', element: <Login /> },
      // { path: 'register', element: <Register /> },
      {
        path: 'forgot-password', 
        element: <ForgotPassword /> 
      },
      {
        path: 'password-reset/:token',  // Modifiez ici pour correspondre à l'URL dans l'email
        element: <ResetPassword /> 
      },
      {
        path: 'password-set/:token',  // Modifiez ici pour correspondre à l'URL dans l'email
        element: <SetPassword /> 
      }
      
    ],
  },
]);


export default router;
