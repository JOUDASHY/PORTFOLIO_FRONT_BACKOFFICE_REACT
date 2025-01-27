import React, { useEffect, useState,useRef } from 'react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosClient from "../axiosClient";
import team2 from "../assets/img/team-2.jpg";
import user_pr from "../assets/img/user.png";
import profile_bg from "../assets/img/bg-profile.jpg";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ClipLoader } from 'react-spinners';

const Profile = ({ user }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [about, setAbout] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [image, setPhoto] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [facebook_link, setFacebook_link] = useState("");
  const [linkedin_link, setlinkedin_link] = useState("");
  const [github_link, setGithub_link] = useState("");
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // État pour le spinner
  const [mdpisModalOpen, mdpsetIsModalOpen] = useState(false); // Pour gérer l'état du modal
  const ws = useRef(null);
  // const { Id } = useParams();
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fonction pour ouvrir le modal
  const openModal = () => {
    mdpsetIsModalOpen(true);
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    mdpsetIsModalOpen(false);
  };


  const handleEditClick = () => {
    setIsModalOpen(true);
  };
// Fonction pour charger les informations de profil de l'utilisateur connecté
const fetchUserData = async () => {
  try {
    const response = await axiosClient.get('/users/');
    const usersData = response.data;
    setUsers(usersData);

    // Détermine l'ID de l'utilisateur cible : soit userId (profil d'un autre), soit user.id (profil personnel)
    const idToFind = userId || user.id;
    console.log("ID recherché :", idToFind);

    // Recherche de l'utilisateur correspondant
    const foundUser = usersData.find(
      (u) => u.id.toString() === idToFind.toString()
    );

    if (foundUser) {
      console.log('Found ....: ', foundUser);
      // Mise à jour des états avec les données de l'utilisateur trouvé
      setSelectedUser(foundUser);
      setUsername(foundUser.username || '');
      setEmail(foundUser.email || '');
      setImage(foundUser.profile?.image || null);
      setAbout(foundUser.profile?.about || '');
      setDateOfBirth(foundUser.profile?.date_of_birth || '');
      setFacebookLink(foundUser.profile?.link_facebook || '');
      setLinkedinLink(foundUser.profile?.link_linkedin || '');
      setGithubLink(foundUser.profile?.link_github|| '');
      setPhoneNumber(foundUser.profile?.phone_number || '');
      setAddress(foundUser.profile?.address || '');
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil :', error);
    toast.error('Erreur lors du chargement du profil.');
  }
};

// Charger les informations de profil de l'utilisateur connecté au montage du composant ou lors du changement de `userId` ou `user.id`
useEffect(() => {
  fetchUserData();
}, [userId, user.id]);

const handleSave = async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('about', about);
  formData.append('date_of_birth', dateOfBirth);
  formData.append('link_facebook', facebookLink);
  formData.append('link_linkedin', linkedinLink);
  formData.append('link_github', githubLink);
  formData.append('phone_number', phoneNumber);
  formData.append('address', address);
  if (image) formData.append('image', image);

  try {
    const response = await axiosClient.put(`/profile/update/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
  });
    setSelectedProfile(response.data);
    setIsModalOpen(false);
    toast.success('Profil mis à jour avec succès !');

    // Recharger les données utilisateur après une mise à jour réussie
    await fetchUserData();
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil :', error);
    toast.error('Erreur lors de la mise à jour du profil.');
  }
};
const handleChange = (e) => {
  const file = e.target.files[0];
  setImage(file); // Mettre à jour l'état avec le fichier sélectionné
};


  const handleResetPasswordClick = async (e) => {
    e.preventDefault();
   
    setLoading(true); // Afficher le spinner

    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, { email });
        toast.success(response.data.message);
    } catch (err) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
    } finally {
        setLoading(false); // Masquer le spinner
        closeModal();
    }
  }

  if (!selectedUser) {
    return <div>Chargement...</div>;
  }
  const handleMessagesClick = () => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="row">
       <Modal 
        isOpen={mdpisModalOpen} 
        onRequestClose={closeModal} 
                overlayClassName="modal-overlay"
        className="user-card-modal"
        contentLabel="Confirmation de réinitialisation"
        ariaHideApp={false} // Nécessaire pour éviter des erreurs d'accessibilité
      >
        <h3>Êtes-vous sûr de vouloir réinitialiser votre mot de passe ?</h3>
        <div className="mt-4">
        {loading ? (
                            <ClipLoader color="#36d7b7" size={35}             className="me-4"/> 
                        ) : (
          <button 
            className="btn btn-success btn-sm me-4"
            onClick={handleResetPasswordClick} // Confirmer la réinitialisation
          >
            Oui, réinitialiser
          </button>
)}
          <button 
            className="btn btn-secondary btn-sm ml-2"
            onClick={closeModal} // Fermer le modal sans rien faire
          >
            Non, annuler
          </button>
        </div>
      </Modal>
      <Modal
  overlayClassName="modal-overlay"
  className="user-card-modal"
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
>
  <div className="user-card-container">
    <div className="user-card-header">
      <div className="ussi je fais dans input file la aussier-avatar">
        {image ? (
          <img
            src={image instanceof File 
              ? URL.createObjectURL(image) 
              : `${import.meta.env.VITE_API_BASE_URL}/${image}`}
            alt="User Profile"
            className="user-image"
          />
        ) : selectedUser.image ? (
          <img
          src={`${import.meta.env.VITE_API_BASE_URL}/${selectedUser.image}`}
            alt="User Profile"
            className="user-image"
          />
        ) : (
          <div className="user-image-placeholder">+</div>
        )}
      </div>
      <h2 className="user-card-title">Modifier le profil</h2>
    </div>

    <form onSubmit={handleSave} className="user-card-form">
      <div className="user-card-input-group">
        <label htmlFor="username" className="user-label">Nom</label>
        <input 
          type="text" 
          id="username" 
          className="user-input" 
          placeholder="Nom de l'utilisateur" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
      </div>

      <div className="user-card-input-group">
        <label htmlFor="email" className="user-label">Email</label>
        <input 
          type="email" 
          id="email" 
          className="user-input" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>

      <div className="user-card-input-group">
        <label htmlFor="date_of_birth" className="user-label">Date de naissance</label>
        <input 
          type="date" 
          id="date_of_birth" 
          className="user-input" 
          value={dateOfBirth} 
          onChange={(e) => setDateOfBirth(e.target.value)} 
        />
      </div>

      <div className="user-card-input-group">
        <label htmlFor="phone_number" className="user-label">Numéro de téléphone</label>
        <div className="phone-input-group d-flex align-items-center mb-3">
          <span className="country-code me-2">+261</span>
          <input
            type="tel"
            id="phone_number"
            className="form-control"
            placeholder="Ex : 348 655 523"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            pattern="^[0-9]{9}$"
            maxLength="9"
          />
        </div>
      </div>

      <div className="user-card-input-group">
        <label htmlFor="address" className="user-label">Adresse</label>
        <input type="text"
          id="address"
          className="user-input"
          placeholder="Adresse"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="user-card-input-group">
        <label htmlFor="about" className="user-label">a propos</label>
        <textarea
          id="about"
          className="user-input"
          placeholder="a propos"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </div>
      <div className="user-card-input-group">
        <label htmlFor="facebook_link" className="user-label">Lien Facebook</label>
        <input 
          type="url" 
          id="facebook_link" 
          className="user-input" 
          placeholder="Lien Facebook" 
          value={facebookLink} 
          onChange={(e) => setFacebookLink(e.target.value)} 
        />
      </div>
      <div className="user-card-input-group">
        <label htmlFor="github_link" className="user-label">Lien github</label>
        <input 
          type="url" 
          id="github_link" 
          className="user-input" 
          placeholder="Lien github" 
          value={githubLink} 
          onChange={(e) => setGithubLink(e.target.value)} 
        />
      </div>
      <div className="user-card-input-group">
        <label htmlFor="linkedin_link" className="user-label">Lien LinkedIn</label>
        <input 
          type="url" 
          id="linkedin_link" 
          className="user-input" 
          placeholder="Lien LinkedIn" 
          value={linkedinLink} 
          onChange={(e) => setLinkedinLink(e.target.value)} 
        />
      </div>

      <div className="user-card-input-group">
        <label htmlFor="fileInput" className="user-label">Photo</label>
        <input 
          type="file" 
          id="fileInput" 
          className="user-file-input"
           
          onChange={(e) => setImage(e.target.files[0])} 
        />
      </div>

      <div className="user-card-footer">
        <button
          type="button"
          className="user-card-button user-card-button-cancel"
          onClick={() => setIsModalOpen(false)}
        >
          <i className="fas fa-times" style={{ marginRight: '5px' }}></i> Annuler
        </button>
        <button
          type="submit"
          className="user-card-button user-card-button-save"
        >
          <i className="fas fa-edit" style={{ marginRight: '5px' }}></i> Modifier
        </button>
      </div>
    </form>
  </div>
</Modal>

<div className="container my-5">
  <div className="card shadow-lg">
    {/* Cover Photo */}
    <div
      className="card-header p-0 position-relative"
      style={{
        height: "250px",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
      }}
    >
      <img
        src="https://s.yimg.com/ny/api/res/1.2/RnGAnxwsXF7tAqYtImzhVA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xNjAy/https://media.zenfs.com/en/azcentral-the-arizona-republic/3131e8a3a9fb9eb7e01ee94cd62fe3c8"
        alt="Profile background"
        className="img-fluid w-100 h-100 object-fit-cover"
      />
      <button className="btn btn-light position-absolute bottom-0 end-0 m-3">
        Change Cover
      </button>
    </div>

    {/* Profile Picture and Info */}
    <div className="card-body d-flex align-items-start">
      <div className="position-relative me-4" style={{ marginTop: "-75px" }}>
        <img
          src={
            selectedUser.profile?.image
              ? `${import.meta.env.VITE_API_BASE_URL}${selectedUser.profile?.image }`
              : user_pr
          }
          alt="Profile"
          className="rounded-circle border border-light shadow"
          style={{ width: "140px", height: "140px" }}
        />
        {userId && userId.toString() === user.id.toString() && (
          <button
            className="btn btn-primary btn-sm position-absolute bottom-0 start-50 translate-middle-x"
            onClick={handleEditClick}
          >
            Edit
          </button>
        )}
      </div>
      <div>
        <h1 className="mt-3">{selectedUser.username}</h1>
        <p className="text-muted">{selectedUser.email}</p>
        <p className="text-muted">{selectedUser.profile?.about}</p>
        <div className="d-flex gap-2">
          {userId && userId.toString() !== user.id.toString() ? (
            <>
              <button
                className="btn btn-dark btn-sm"
                onClick={() => handleMessagesClick(userId)}
              >
                <i className="fas fa-paper-plane"></i> Message
              </button>
              <div className="custom-chat-status">
                {onlineUsers.some((user) => user.id == userId) ? (
                  <>
                    <span className="custom-status-indicator online"></span>
                    <span className="custom-status-text-dark">En ligne</span>
                  </>
                ) : (
                  <>
                    <span className="custom-status-indicator offline"></span>
                    <span className="custom-status-text-dark">Hors ligne</span>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="btn btn-info btn-sm" onClick={handleEditClick}>
                <i className="fas fa-edit"></i> Editer mon Profil
              </button>
              <button className="btn btn-danger btn-sm" onClick={openModal}>
                <i className="fas fa-key"></i> Restaurer mot de passe
              </button>
            </>
          )}
        </div>
      </div>
    </div>

    {/* User Details */}
    <div className="card-footer">
  <h2 className="h5">À propos</h2>
  <div className="row mt-3">
    {selectedUser.profile?.address && (
      <div className="col-md-6 mb-3">
        <p className="bg-light p-3 rounded border">
          <i className="fas fa-map-marker-alt me-2"></i>
          <strong>Adresse:</strong> {selectedUser.profile.address}
        </p>
      </div>
    )}
    {selectedUser.profile?.phone_number && (
      <div className="col-md-6 mb-3">
        <p className="bg-light p-3 rounded border">
          <i className="fas fa-phone me-2"></i>
          <strong>Téléphone:</strong> {selectedUser.profile.phone_number}
        </p>
      </div>
    )}
    {selectedUser.profile?.date_of_birth && (
      <div className="col-md-6 mb-3">
        <p className="bg-light p-3 rounded border">
          <i className="fas fa-birthday-cake me-2"></i>
          <strong>Date de naissance:</strong>{" "}
          {new Date(selectedUser.profile.date_of_birth).toLocaleDateString()}
        </p>
      </div>
    )}
    {selectedUser.profile?.link_facebook && (
      <div className="col-md-6 mb-3">
        <p className="bg-light p-3 rounded border">
          <i className="fab fa-facebook-f me-2"></i>
          <strong>Facebook:</strong>{" "}
          <a
            href={selectedUser.profile.link_facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir le profil Facebook
          </a>
        </p>
      </div>
    )}
    {selectedUser.profile?.link_linkedin && (
      <div className="col-md-6 mb-3">
        <p className="bg-light p-3 rounded border">
          <i className="fab fa-linkedin me-2"></i>
          <strong>LinkedIn:</strong>{" "}
          <a
            href={selectedUser.profile.link_linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir le profil LinkedIn
          </a>
        </p>
      </div>
    )}
         {selectedUser.profile?.link_github && (
      <div className="col-md-6 mb-3">
        <p className="bg-light p-3 rounded border">
          <i className="fab fa-github me-2"></i>
          <strong>github:</strong>{" "}
          <a
            href={selectedUser.profile.link_github}
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir le profil github
          </a>
        </p>
      </div>
    )}
  </div>
</div>

  </div>
</div>





      <ToastContainer />
    </div>
  );
};

export default Profile;
