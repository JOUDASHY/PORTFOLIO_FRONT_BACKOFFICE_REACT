
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';  
import Modal from 'react-modal';
import logo from '../assets/images/logo.png'; // Importez votre logo

const Sidebar = ({user, setUser, setToken}) => {

  return (
    <nav className="pc-sidebar">
      <div className="navbar-wrapper">
        <div className="m-header">
          <a href="#" className="b-brand text-primary">
            <img
              src={logo}
              className="logo_img"
              alt="logo"
              style={{
                backgroundColor: "#f68c09", // Jaune foncé
                padding: "10px",            // Optionnel : espace autour de l'image
                borderRadius:'50%'        // Optionnel : arrondir les bords
              }}
            />
          
          </a>
        </div>
        <div className="navbar-content">
          <UserCard user={user} setUser={setUser} setToken={setToken}/>
          <NavigationMenu user={user}/>
        </div>
      </div>
    </nav>
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
              src={`${import.meta.env.VITE_API_BASE_URL}${profile?.image }`}
              alt="user-image"
              class="user-avtar wid-45 rounded-circle" 
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



const NavigationMenu = () => {
  return (
<ul className="pc-navbar">
  <li className="pc-item pc-caption">
    <label>Navigation</label>
  </li>
  <li className="pc-item">
    <NavLink 
      to="/" 
      className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
      <i className="fas fa-home me-4"></i>
      <span>Accueil</span>
    </NavLink>
  </li>
  <li className="pc-item">
    <NavLink 
      to="/projet" 
      className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
      <i className="fas fa-project-diagram me-4"></i>
      <span>Projet</span>
    </NavLink>
  </li>
  <li className="pc-item">
    <NavLink 
      to="/experience" 
      className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
      <i className="fas fa-briefcase me-4"></i>
      <span>Expérience</span>
    </NavLink>
  </li>
  <li className="pc-item">
    <NavLink 
      to="/education" 
      className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
      <i className="fas fa-graduation-cap me-4"></i>
      <span>Éducation</span>
    </NavLink>
  </li>
  <li className="pc-item">
    <NavLink 
      to="/award" 
      className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
      <i className="fas fa-award me-4"></i>
      <span>Award</span>
    </NavLink>
  </li>
  <li className="pc-item">
    <NavLink 
      to="/competence" 
      className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
      <i className="fas fa-cogs me-4"></i>
      <span>Compétences</span>
    </NavLink>
  </li>
  <li className="pc-item">
    <NavLink 
      to="/cv" 
      className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
      <i className="fas fa-eye me-4"></i>
      <span>Voir CV</span>
    </NavLink>
  </li>
  <li className="pc-item">
    <NavLink 
      to="/Gemini_api" 
      className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
      <i className="fas fa-robot me-4"></i>
      <span>Assistant IA</span>
    </NavLink>
  </li>
  <li className="pc-item">
    <NavLink 
      to="/langue" 
      className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
      <i className="fas fa-language me-4"></i>
      <span>Langue</span>
    </NavLink>
  </li>
  <li className="pc-item">
    <NavLink 
      to="/Formation" 
      className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
      <i className="fas fa-chalkboard-teacher me-4"></i>
      <span>Formation</span>
    </NavLink>
  </li>
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
