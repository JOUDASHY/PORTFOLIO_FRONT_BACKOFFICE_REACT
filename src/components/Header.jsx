
import { NavLink } from "react-router-dom";
// import axiosClient from '../axiosClient';
import React, { useEffect, useState ,useRef} from 'react';
import axiosClient from '../axiosClient';
import { toast, ToastContainer } from 'react-toastify'; // Importer toastify
import 'react-toastify/dist/ReactToastify.css'; // Importer les styles
import { ClipLoader } from 'react-spinners'; // Import du spinner
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import user_pr from "../assets/img/user.png";

const Header = ({user,setUser,setToken}) => {
  const [modalOpen, setModalOpen] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [unansweredCount, setUnansweredCount] = useState(0);
  const [loading, setLoading] = useState(false); // État pour le spinner
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [emailEntreprise, setEmailEntreprise] = useState("");
  const [lieuEntreprise, setLieuEntreprise] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPwdOpen, setIsModalPwdOpen] = useState(false);
  const [formData, setFormData] = useState({
    nomEntreprise: '',
    emailEntreprise: '',
    lieuEntreprise: '',
  });

  const [isOpenNotif, setIsOpenNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  let isOpen = false;

  const toggleDropdown = (e) => {
    e.preventDefault();
    isOpen = !isOpen; // Change l'état local
    if (dropdownRef.current) {
      dropdownRef.current.style.display = isOpen ? "block" : "none"; // Met à jour l'affichage du menu
    }
  };
  const toggleDropdownNotif = () => {
    setIsOpenNotif(!isOpenNotif);
   
  };
  const clearAllNotifications = async () => {
    try {
      await axiosClient.delete("notifications/clear-all/");
      setNotifications([]); // Efface après confirmation
      setUnreadCount(0);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };
  
  useEffect(() => {
    axiosClient
      .get("/notifications/")
      .then((response) => {
        const data = response.data;
  
        // Trier par date décroissante (du plus récent au plus ancien)
        const sortedNotifications = data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4); // Prendre uniquement les 4 plus récentes
  
        setNotifications(sortedNotifications);
  
        // Compter les notifications non lues
        setUnreadCount(sortedNotifications.filter((notif) => !notif.is_read).length);
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }, []);
  

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({ ...notif, is_read: true }))
    );
    setUnreadCount(0);
    // Optionally send a request to mark notifications as read in the backend
    axiosClient.post("/notifications/mark-all-read/").catch((error) => {
      console.error("Error marking notifications as read:", error);
    });
  };




  
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };
  const handleChangePwdClick = (e) => {
    e.preventDefault();
    setIsModalPwdOpen(true);
  };
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await axiosClient.post(`/change-password/`,
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
       
      );

      setMessage(response.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "An error occurred.");
      } else {
        setError("Unable to connect to the server.");
      }
    }
  };







  const handleConfirmLogout = async (ev) => {
    ev.preventDefault();
    setIsLoggingOut(true);
  
    try {
      await axiosClient.post("/logout/");
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      alert("Une erreur est survenue lors de la déconnexion.");
    } finally {
      setIsModalOpen(false); // Toujours fermer la modal ici
      setIsLoggingOut(false);
    }
  };
  

  const handleCancelLogout = () => {
    setIsModalOpen(false);
  };
  const handleCancelPWD = () => {
    setIsModalPwdOpen(false);
  };

  
  const [profile, setProfile] = useState(null); // Stockage des données utilisateur

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

  // Fonction pour gérer les changements dans les champs de formulaire


  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setEmailEntreprise('');
    setLieuEntreprise('');
    setNomEntreprise('');
    setModalOpen(false); // Assurez-vous que modalOpen est défini quelque part si vous l'utilisez.
  };

  // Fonction pour gérer la soumission du formulaire
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Afficher le spinner
  
    try {
      const formData = new FormData();
      formData.append('emailEntreprise', emailEntreprise);
      formData.append('lieuEntreprise', lieuEntreprise);
      formData.append('nomEntreprise', nomEntreprise);
  
      // Envoi des données au backend via axios
      const response = await axiosClient.post('/mail_entreprise/', formData);
      console.log('Réponse de l\'API :', response.data);
  
      // Affichage du message de succès avec SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Votre CV et LM sont envoyés avec succès !',
        confirmButtonText: 'OK',
      });
  
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
  
      // Affichage du message d'erreur avec SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Erreur lors de l\'envoi de l\'email',
        text: 'Veuillez réessayer.',
        confirmButtonText: 'OK',
      });
  
      resetForm();
    } finally {
      setLoading(false); // Masquer le spinner
    }
  };
  
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axiosClient.get("/emails/");
        const emails = response.data;
        // Vérifier si chaque email a des réponses
        const unansweredEmails = emails.filter(
          (email) => email.responses && email.responses.length === 0
        );
        setUnansweredCount(unansweredEmails.length);
        console.log("res ....... ",unansweredEmails.length);
      } catch (error) {
        console.error("Erreur lors de la récupération des emails :", error);
      }
    };

    fetchEmails();
  }, []); // Exécuter uniquement lors du montage du composant

 
  

  return (
    <header className="pc-header">
       {/* <ToastContainer /> */}
      <div className="header-wrapper">
        {/* Mobile Media Block Start */}
        <div className="me-auto pc-mob-drp ">
        <ul className="list-unstyled ">


  <li className="dropdown pc-h-item">
    <a
      className="pc-head-link dropdown-toggle arrow-none m-0 trig-drp-search"
      data-bs-toggle="dropdown"
      href="#"
      role="button"
      aria-haspopup="false"
      aria-expanded="false"
    >
      <i className="ti ti-search"></i>
    </a>
    <div className="dropdown-menu pc-h-dropdown drp-search">
      <form className="px-3 py-2">
        <input
          type="search"
          className="form-control border-0 shadow-none"
          placeholder="Search here. . ."
        />
      </form>
    </div>
  </li>

  {/* New Mail Tab */}
  <li className="pc-h-item ms-1">
    <NavLink
      to="/allemails"
      className={({ isActive }) =>
        isActive ? "pc-head-link " : "pc-head-link"
      }
    >
      <i className="ti ti-mail"></i>
      {unansweredCount > 0 && (
        <span className="badge bg-danger pc-h-badge">{unansweredCount}</span>
      )}
    </NavLink>
  </li>
</ul>


        </div>
        {/* Mobile Media Block End */}
        <div className="ms-auto">
          <ul className="list-unstyled">
          <li className="dropdown pc-h-item" style={{ position: "relative" }}>
      <a
        className="pc-head-link dropdown-toggle arrow-none me-0"
        href="#"
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
      >
        <i className="ti ti-settings"></i> {/* Icône principale */}
      </a>
      <div
        ref={dropdownRef}
        className="dropdown-menu dropdown-menu-end pc-h-dropdown"
        style={{
          display: "none", // Par défaut, le menu est masqué
          position: "absolute",
          top: "100%",
          right: 0,
        }}
      >
         <NavLink 
      to="profile" 
      // className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
        <a href="#!" className="dropdown-item">
          <i className="ti ti-user"></i>
          <span>My Account</span>
        </a></NavLink>
        <a href="#!" className="dropdown-item">
          <i className="ti ti-settings"></i>
          <span>Settings</span>
        </a>
        <a href="#!" className="dropdown-item">
          <i className="ti ti-headset"></i>
          <span>Support</span>
        </a>
        <a href="#!" className="dropdown-item">
          <i className="ti ti-lock"></i>
          <span>Lock Screen</span>
        </a>
        <a href="#!" className="dropdown-item" onClick={handleLogoutClick}>
          <i className="ti ti-power"></i>
          <span>Logout</span>
        </a>
      </div>
    </li>
      {/* Announcement Button */}
      <li className="pc-h-item">
        <a
          href="#"
          className="pc-head-link me-0"
          aria-controls="announcement"
        >
            <NavLink
        to="/historic_mail"
        className={({ isActive }) =>
          isActive ? "pc-head-link " : "pc-head-link"
        }
      >
                    <i className="fas fa-history"></i> 
                    </NavLink>
        </a>
      </li>

      <li className="dropdown pc-h-item">
  <a
    className="pc-head-link dropdown-toggle arrow-none me-0"
    href="#"
    role="button"
    aria-haspopup="false"
    aria-expanded="false"
    onClick={() => setModalOpen(true)}  // Ouvrir le modal
  >
    <i className="fas fa-paper-plane"></i> {/* Icône de papier avion pour l'envoi */}
    
  </a>
</li>

<li className="dropdown pc-h-item">
  <a
    className="pc-head-link dropdown-toggle arrow-none me-0"
    href="#"
    role="button"
    aria-haspopup="true"
    aria-expanded={isOpenNotif}
    onClick={(e) => {
      e.preventDefault();
      toggleDropdownNotif();
    }}
  >
    <i className="ti ti-bell"></i> {/* Icône de notification */}
    <span className="badge bg-danger pc-h-badge">{unreadCount}</span>
  </a>
  {isOpenNotif && (
  <div className="dropdown-menu dropdown-notification dropdown-menu-end pc-h-dropdown show">
    <div className="dropdown-header d-flex align-items-center justify-content-between">
      <h5 className="m-0">Notifications</h5>
      <button onClick={markAllAsRead} className="btn btn-link btn-sm">
        Mark all read
      </button>
    </div>
    <div
      className="dropdown-body text-wrap header-notification-scroll"
      style={{ maxHeight: "calc(100vh - 215px)", overflowY: "auto" }}
    >
      {notifications.length === 0 ? (
        <p className="text-muted text-center">No notifications</p>
      ) : (
        notifications.map((notif) => {
          const formattedDate = new Date(notif.created_at).toLocaleDateString();
          const formattedTime = new Date(notif.created_at).toLocaleTimeString();

          return (
            <div className="card mb-2" key={notif.id || `notif-${notif.created_at}`}>
              <div className="card-body">
                <div className="d-flex">
                  <i className="ti ti-layer text-primary"></i> {/* Icône pour chaque notification */}
                  <div className="ms-3">
                    <span className="float-end text-sm text-muted">
                      {formattedDate} à {formattedTime}
                    </span>
                    <h5 className="text-body mb-2">{notif.title}</h5>
                    <p>{notif.message}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
    <div className="text-center py-2 d-flex justify-content-between px-3">
      <button onClick={clearAllNotifications} className="link-danger btn btn-link">
        Clear all Notifications
      </button>
      <NavLink to="/NotificationsList" className="btn btn-primary btn-sm">
        View all
      </NavLink>
    </div>
  </div>
)}


</li>


{/* User Profile Dropdown */}
<li className="dropdown pc-h-item header-user-profile">
  <a
    className="pc-head-link dropdown-toggle arrow-none me-0"
    data-bs-toggle="dropdown"
    href="#"
    role="button"
    aria-haspopup="false"
    data-bs-auto-close="outside"
    aria-expanded="false"
  >
    
    <img
  src={
    profile?.image
      ? `${import.meta.env.VITE_API_BASE_URL}${profile.image}`
      : user_pr
  }
  alt="user-avatar"
    className="user-avtar"
/>

  </a>
  <div className="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown">
    <div className="dropdown-header d-flex align-items-center justify-content-between">
      <h5 className="m-0">Profile</h5>
    </div>
    <div className="dropdown-body">
  <div
    className="profile-notification-scroll position-relative"
    style={{ maxHeight: "calc(100vh - 225px)" }}
  >
    {/* User Profile Section */}
    <div className="d-flex mb-1">
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
  alt="user-avatar"
  className="user-avtar wid-35"
/>

      </div>
      </NavLink>
      <NavLink 
      to="profile" 
      // className={({ isActive }) => `pc-link ${isActive ? "active" : ""}`}
    >
      <div className="flex-grow-1 ms-3">
        <h6 className="mb-1">{user.username} 🖖</h6>
        <span>{user.email}</span>
      </div>
      </NavLink>

    </div>

    <hr className="border-secondary border-opacity-50" />

    {/* Notification Section */}
    <div className="card">
      <div className="card-body py-3">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0 d-inline-flex align-items-center">
            <svg className="pc-icon text-muted me-2">
              <use xlinkHref="#custom-notification-outline" />
            </svg>
            Notification
          </h5>
          <div className="form-check form-switch form-check-reverse m-0">
            <input className="form-check-input f-18" type="checkbox" role="switch" />
          </div>
        </div>
      </div>
    </div>

    <p className="text-span">Manage</p>

    {/* Additional Links */}
    <a href="#" className="dropdown-item">
      <span>
        <svg className="pc-icon text-muted me-2">
          <use xlinkHref="#custom-setting-outline" />
        </svg>
        <span>Settings</span>
      </span>
    </a>
    <a href="#" className="dropdown-item">
      <span>
        <svg className="pc-icon text-muted me-2">
          <use xlinkHref="#custom-share-bold" />
        </svg>
        <span>Share</span>
      </span>
    </a>
    <a href="#" className="dropdown-item" onClick={handleChangePwdClick}>
      <span>
        <svg className="pc-icon text-muted me-2">
          <use xlinkHref="#custom-lock-outline" />
        </svg>
        <span>Change Password</span>
      </span>
    </a>

    <hr className="border-secondary border-opacity-50" />

    <p className="text-span">Team</p>

    {/* Team Links */}
    <a href="#" className="dropdown-item">
      <span>
        <svg className="pc-icon text-muted me-2">
          <use xlinkHref="#custom-profile-2user-outline" />
        </svg>
        <span>UI Design team</span>
      </span>
      <div className="user-group">
        <img src="../assets/images/user/avatar-1.jpg" alt="user" className="avtar" />
        <span className="avtar bg-danger text-white">K</span>
        <span className="avtar bg-success text-white">
          <svg className="pc-icon m-0">
            <use xlinkHref="#custom-user" />
          </svg>
        </span>
        <span className="avtar bg-light-primary text-primary">+2</span>
      </div>
    </a>
    <a href="#" className="dropdown-item">
      <span>
        <svg className="pc-icon text-muted me-2">
          <use xlinkHref="#custom-profile-2user-outline" />
        </svg>
        <span>Friends Groups</span>
      </span>
      <div className="user-group">
        <img src="../assets/images/user/avatar-1.jpg" alt="user" className="avtar" />
        <span className="avtar bg-danger text-white">K</span>
        <span className="avtar bg-success text-white">
          <svg className="pc-icon m-0">
            <use xlinkHref="#custom-user" />
          </svg>
        </span>
      </div>
    </a>onClick={handleLogoutClick}
    <a href="#" className="dropdown-item">
      <span>
        <svg className="pc-icon text-muted me-2">
          <use xlinkHref="#custom-add-outline" />
        </svg>
        <span>Add new</span>
      </span>
      <div className="user-group">
        <span className="avtar bg-primary text-white">
          <svg className="pc-icon m-0">
            <use xlinkHref="#custom-add-outline" />
          </svg>
        </span>
      </div>
    </a>

    <hr className="border-secondary border-opacity-50" />

    {/* Logout and Upgrade Section */}
    <div className="d-grid mb-3">
      <button className="btn btn-primary" onClick={handleLogoutClick}>
        <svg className="pc-icon me-2">
          <use xlinkHref="#custom-logout-1-outline" />
        </svg>
        Logout
      </button>
    </div>
    <div
      className="card border-0 shadow-none drp-upgrade-card mb-0"
      style={{ backgroundImage: "url(../assets/images/layout/img-profile-card.jpg)" }}
    >
      <div className="card-body">
        <div className="user-group">
          <img src="../assets/images/user/avatar-1.jpg" alt="user" className="avtar" />
          <img src="../assets/images/user/avatar-2.jpg" alt="user" className="avtar" />
          <img src="../assets/images/user/avatar-3.jpg" alt="user" className="avtar" />
          <img src="../assets/images/user/avatar-4.jpg" alt="user" className="avtar" />
          <img src="../assets/images/user/avatar-5.jpg" alt="user" className="avtar" />
          <span className="avtar bg-light-primary text-primary">+20</span>
        </div>
        <h3 className="my-3 text-dark">245.3k <small className="text-muted">Followers</small></h3>
        <button className="btn btn-warning">
          <svg className="pc-icon me-2">
            <use xlinkHref="#custom-logout-1-outline" />
          </svg>
          Upgrade to Business
        </button>
      </div>
    </div>
  </div>
</div>

  </div>
</li>

          </ul>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}  // Fermer le modal
        contentLabel="Envoyer un CV"
        ariaHideApp={false}
      overlayClassName="modal-overlay"
                className="customModal"
      >
        <div className="modal-header">
        <button onClick={() => setModalOpen(false)} className="close-btn">X</button>
        <h2>Formulaire Entreprise</h2>
        </div>

     <form>
  <div className="modal-header">
    <div style={{ marginBottom: '15px' }}>
      <label htmlFor="nomEntreprise" style={{ display: 'block', marginBottom: '5px' }}>
        Nom de l'entreprise
      </label>
      <input
        type="text"
        id="nomEntreprise"
        name="nomEntreprise"
        value={nomEntreprise}
        onChange={(e) => setNomEntreprise(e.target.value)} 
        placeholder="Entrez le nom"
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        required
      />
    </div>
    <div style={{ marginBottom: '15px' }}>
      <label htmlFor="emailEntreprise" style={{ display: 'block', marginBottom: '5px' }}>
        Email de l'entreprise
      </label>
      <input
        type="email"
        id="emailEntreprise"
        name="emailEntreprise"
        value={emailEntreprise}
        onChange={(e) => setEmailEntreprise(e.target.value)} 
        placeholder="Entrez l'email"
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        required
      />
    </div>
    <div style={{ marginBottom: '15px' }}>
      <label htmlFor="lieuEntreprise" style={{ display: 'block', marginBottom: '5px' }}>
        Lieu de l'entreprise
      </label>
      <input
        type="text"
        id="lieuEntreprise"
        name="lieuEntreprise"
        value={lieuEntreprise}
        onChange={(e) => setLieuEntreprise(e.target.value)}
        placeholder="Entrez le lieu"
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        required
      />
    </div>
  </div>
  
  <div className="modal-footer">
    <button onClick={() => resetForm()} className="btn btn-secondary">
      X annuler
    </button>

    <button
      onClick={handleSubmit} // Remplacer le type="submit" par onClick
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? (
        <ClipLoader color="#ffffff" size={20} /> // Spinner ici
      ) : (
        <> 
          <i className="fas fa-paper-plane me-2"></i> Envoyer
        </>
      )}
    </button>
  </div>
</form>

      </Modal>
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

        <Modal
      isOpen={isModalPwdOpen}
      onRequestClose={handleCancelPWD}
      contentLabel="Changer le mot de passe"
      overlayClassName="modal-overlay"
      className="customModal"
    >
      <div className="modal-header">
        <h4 className="modal-title">
          <i className="fas fa-lock" style={{ marginRight: "8px" }}></i> Changer le mot de passe
        </h4>
      </div>

      <div className="modal-body">
        {message ? (
          <p className="success-message">{message}</p>
        ) : (
          <>
            {error && <p className="error-message">{error}</p>}





            <div className="form-group">
              <label htmlFor="oldPassword">Ancien mot de passe</label>
              <input
                    className="form-control" 

                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>




            <div className="form-group">
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input
                    className="form-control" 

                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>




            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                    className="form-control" 

                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </>
        )}
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={handleCancelPWD} disabled={isSubmitting}>
          <i className="fas fa-ban"></i> Annuler
        </button>
        <button
          className="btn btn-primary"
          onClick={handleChangePassword}
          disabled={isSubmitting || message !== ""}
        >
          <i className="fas fa-save"></i> {isSubmitting ? "Modification..." : "Changer"}
        </button>
      </div>
    </Modal>
    </header>
  );
};

const layoutChange = (mode) => {
  console.log(`Switching to ${mode} mode`);
};

const layoutChangeDefault = () => {
  console.log("Switching to default layout");
};

export default Header;
