
import React, { useState, useEffect,useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';  
import Modal from 'react-modal';
import logo from '../assets/images/logo.png'; // Importez votre logo
import user_pr from "../assets/img/user.png";

const Sidebar = ({user, setUser, setToken}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const sidebarRef = useRef(null); // Référence pour le sidebar

  // Vérifie la taille de l'écran en temps réel
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ferme le sidebar en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);
  return (
    <>
    {/* Bouton Toggle (Affiché uniquement en mobile) */}
    {isMobile && (
      <button
        className="menu-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>
    )}

    {/* Sidebar */}
    <nav ref={sidebarRef} className={`pc-sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="navbar-wrapper">
        <div className="m-header">
          <a href="#" className="b-brand text-primary">
            <img
              src={logo}
              className="logo_img"
              alt="logo"
              style={{
                backgroundColor: "#f68c09",
                padding: "10px",
                borderRadius: "50%",
              }}
            />
          </a>
        </div>
        <div className="navbar-content">
          <UserCard user={user} setUser={setUser} setToken={setToken} />
          <NavigationMenu setIsSidebarOpen={setIsSidebarOpen} />
        </div>
      </div>
    </nav>
  </>
  );
};


const UserCard = ({ user, setUser, setToken }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState(null); 
  // Fonction pour récupérer le profil
  const fetchUserProfile = async () => {
    try {
      const response = await axiosClient.get("/profile/");
      setProfile(response.data); // Met à jour les données utilisateur
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      alert("Impossible de charger le profil utilisateur.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile(); // Récupère le profil uniquement si l'utilisateur est connecté
    }
  }, [user]);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmLogout = async (ev) => {
    ev.preventDefault();
    setIsLoggingOut(true);

    try {
      await axiosClient.post("/logout/");
      setUser(null);
      setToken(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      setIsModalOpen(false);
      alert("Une erreur est survenue lors de la déconnexion. Veuillez réessayer.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="card pc-user-card">
      <div className="card-body">
        <div className="d-flex align-items-center">
        <NavLink 
      to="profile" 
      // className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
          <div className="flex-shrink-0">
          <img
  src={
    profile?.image
      ? `${import.meta.env.VITE_API_BASE_URL}${profile.image}`
      : user_pr
  }
  alt="user-image"
  className="user-avtar wid-45 rounded-circle" 
/>

          </div>
          </NavLink>
          <NavLink 
      to="profile" 
      // className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
          <div className="flex-grow-1 ms-3 me-2">
            <h6 className="mb-0">{profile?.username || user.username}</h6>
            <small>{"Administrator"}</small>
          </div>
          </NavLink>

          <a
            className="btn btn-icon btn-link-secondary avatar"
            data-bs-toggle="collapse"
            href="#pc_sidebar_userlink"
          >
            <i className="fas fa-sort"></i>
          </a>
        </div>

        <div className="collapse pc-user-links" id="pc_sidebar_userlink">
          <div className="pt-3">
            <a href="#!">
              <i className="ti ti-user"></i>
              <span>My Account</span>
            </a>
            <a href="#!">
              <i className="ti ti-settings"></i>
              <span>Settings</span>
            </a>
            <a href="#!">
              <i className="ti ti-lock"></i>
              <span>Lock Screen</span>
            </a>
            <a href="" to="/login" onClick={handleLogoutClick}>
              <i className="ti ti-power"></i>
              <span>Logout</span>
            </a>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCancelLogout}
          contentLabel="Confirmation de déconnexion"
          overlayClassName="modal-overlay"
          className="customModal"
        >
          <div className="modal-header">
            <h4 className="modal-title">
              <i className="fas fa-sign-out-alt" style={{ marginRight: "8px" }}></i> Déconnexion
            </h4>
          </div>

          <div className="modal-body">
            {isLoggingOut ? (
              <p>Déconnexion en cours...</p>
            ) : (
              <p>Voulez-vous vraiment vous déconnecter ?</p>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleCancelLogout} disabled={isLoggingOut}>
              <i className="fas fa-ban"></i> Annuler
            </button>
            <button className="btn btn-danger" onClick={handleConfirmLogout} disabled={isLoggingOut}>
              <i className="fas fa-sign-out-alt"></i> Déconnecter
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};



const NavigationMenu = ({ setIsSidebarOpen }) => {
  return (
    <ul className="pc-navbar">
     {[
  { path: "/", icon: "fas fa-home", label: "Accueil" },
  { path: "/projet", icon: "fas fa-project-diagram", label: "Projet" },
  { path: "/experience", icon: "fas fa-briefcase", label: "Expérience" },
  { path: "/education", icon: "fas fa-graduation-cap", label: "Éducation" },
  { path: "/award", icon: "fas fa-award", label: "Award" },
  { path: "/competence", icon: "fas fa-cogs", label: "Compétences" },
  { path: "/cv", icon: "fas fa-eye", label: "Voir CV" },
  { path: "/Gemini_api", icon: "fas fa-robot", label: "Assistant IA" },
  { path: "/langue", icon: "fas fa-language", label: "Langue" },
  { path: "/Formation", icon: "fas fa-chalkboard-teacher", label: "Formation" },
  { path: "/facebook", icon: "fab fa-facebook", label: "Facebook" } // Ajout de Facebook
].map((item, index) => (
  <li className="pc-item" key={index}>
    <NavLink
      to={item.path}
      className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
      onClick={() => setIsSidebarOpen(false)}
    >
      <i className={`${item.icon} me-4`}></i>
      <span>{item.label}</span>
    </NavLink>
  </li>
))}

    </ul>
  );
};


const MenuItem = ({ title, icon, link, badge, subMenuItems }) => {
  return (
    <li className={`pc-item ${subMenuItems ? "pc-hasmenu" : ""}`}>
      <a href={link || "#!"} className="pc-link">
        <span className="pc-micon">
          <i className={icon}></i>
        </span>
        <span className="pc-mtext">{title}</span>
        {badge && <span className="pc-badge">{badge}</span>}
        {subMenuItems && <span className="pc-arrow">&#x3E;</span>}
      </a>
      {subMenuItems && (
        <ul className="pc-submenu">
          {subMenuItems.map((item, index) => (
            <li className="pc-item" key={index}>
              <a className="pc-link" href={item.link}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Sidebar;
