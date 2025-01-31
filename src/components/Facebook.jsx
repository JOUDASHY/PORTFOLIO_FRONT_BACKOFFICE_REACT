import axios from 'axios';
import { useEffect, useState } from "react";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import axiosClient from '../axiosClient';

Modal.setAppElement('#root');

function Facebook() {
 
// États pour les champs de l'éducation

const [lieu, setLieu] = useState(''); // Lieu de l'éducation
// const [image, setImage] = useState(null); // Image de l'éducation (fichier)
const [date, setDate] = useState('');
const [heur, setheur] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const [id, setId] = useState(null); // ID de l'éducation à modifier
const [selectedFacebook, setSelectedFacebook] = useState(null); // Éducation sélectionnée pour modification

// États pour la gestion de la modale
const [isModalOpen, setIsModalOpen] = useState(false); // Indique si la modale est ouverte

    const [Facebook, setFacebook] = useState([]);
  
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Nouvel état pour la barre de recherche
    
 


    useEffect(() => {
        (async () => await Load())();
    }, []);

    async function Load() {
        const result = await axiosClient.get("/facebook/");
        setFacebook(result.data);
        
    }


    const handleClose = () => {
        setNotification(null);
    };


    



    
    

    async function DeleteFacebook(id) {
        await axiosClient.delete(`/facebook/${id}/`);
        resetForm();
        toast.success('Facebook supprimée avec succès');
    }

    const resetForm = () => {
        setDate('');           // Réinitialise la date de début
        setheur('');             // Réinitialise la date de fin
        setEmail('');          // Réinitialise le nom de l'Email
        setPassword('');                // Réinitialise le Password (stage ou professionnel)
             // Réinitialise l'image (si applicable)
        setId(null);                // Réinitialise l'ID de l'expérience
        setSelectedFacebook(null); // Réinitialise l'expérience sélectionnée
        Load();                     // Recharge les données ou effectue toute action nécessaire
        setIsModalOpen(false);      // Ferme le modal
        setIsDeleteModalOpen(false); // Ferme le modal de suppression
    };
    

    const openDeleteModal = (Facebook) => {
        setSelectedFacebook(Facebook);
        setIsDeleteModalOpen(true); 
    };


    // Filtrer les Facebook en fonction de la recherche
    const filteredFacebook = Facebook.filter(exp =>
        exp.email.toLowerCase().includes(searchQuery.toLowerCase()) || // Recherche par Email
        exp.password.toLowerCase().includes(searchQuery.toLowerCase())      // Recherche par Password (stage ou professionnel)
      
    
    );
    
    
    return (
        <React.Fragment>

              <ToastContainer />
      



{/* Modal de suppression */}
<Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isDeleteModalOpen} 
    onRequestClose={() => setIsDeleteModalOpen(false)}
>
    <div className="modal-body text-center">
        <p>Voulez-vous supprimer l'Facebook {selectedFacebook?.name} ?</p>
        <div className="modal-footer justify-content-center">
            <button className="btn btn-danger" onClick={() => DeleteFacebook(selectedFacebook?.id)}>
                <i className="fas fa-trash"></i> Supprimer
            </button>
            <button className="btn btn-secondary" onClick={() => resetForm()}>
                <i className="fas fa-times"></i> Annuler
            </button>
        </div>
    </div>
</Modal>




<div className="row">
  <div className="col-12">
    <div className="card mb-4">
      <div className="card-header pb-0">
      <h2>Liste des Comptes Facebook</h2>
      </div>
      
      <div className="header-bar">
  {/* Bouton pour ajouter une Facebook */}


  
  {/* Barre de recherche */}
  <div className="search-bar">
    <input
      Password="text"
      placeholder="Rechercher ..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="search-input"
    />
    <button className="search-btn">
      <i className="fas fa-search"></i>
    </button>
  </div>
</div>


      <div className="card-body px-0 pt-0 pb-2">
        <div className="table-responsive p-0">
{/* Table d'affichage des expériences professionnelles */}
<table className="table align-items-center mb-0">
  <thead>
    <tr>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Email</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Password</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Date </th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Heur</th>
     
      <th className="text-secondary opacity-7">Action</th>
    </tr>
  </thead>

  <tbody>
  {filteredFacebook.length > 0 ? (
    filteredFacebook.map((Facebook) => {
      const dateObj = new Date(Facebook.date);
      const heureObj = new Date(`1970-01-01T${Facebook.heure}`);

      const dateFormattee = dateObj.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const heureFormatee = heureObj.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      return (
        <tr key={Facebook.id}>
          <td>
            <p className="text-xs font-weight-bold mb-0">
              {Facebook.email || "Email non défini"}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {Facebook.password || "Password non défini"}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {Facebook.date ? dateFormattee : "Date non définie"}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {Facebook.heure ? heureFormatee : "Heure non définie"}
            </p>
          </td>

          <td className="align-middle">
            <button className="btn btn-danger" onClick={() => openDeleteModal(Facebook)}>
              <i className="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="6" style={{ textAlign: "center" }}>Aucun résultat trouvé</td>
    </tr>
  )}
</tbody>

</table>


        </div>
      </div>
    </div>
  </div>
</div>

        </React.Fragment>
    );
}

export default Facebook;
