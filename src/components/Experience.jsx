import axios from 'axios';
import { useEffect, useState } from "react";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import axiosClient from '../axiosClient';

Modal.setAppElement('#root');

function Experience() {
 
// États pour les champs de l'éducation

const [lieu, setLieu] = useState(''); // Lieu de l'éducation
// const [image, setImage] = useState(null); // Image de l'éducation (fichier)
const [date_debut, setDate_debut] = useState('');
const [date_fin, setDate_fin] = useState('');
const [entreprise, setEntreprise] = useState('');
const [type, setType] = useState('');
const [role, setRole] = useState('');
const [description, setDescription] = useState(''); // Ajouter cet état
// États pour la gestion de la sélection
const [id, setId] = useState(null); // ID de l'éducation à modifier
const [selectedExperience, setSelectedExperience] = useState(null); // Éducation sélectionnée pour modification

// États pour la gestion de la modale
const [isModalOpen, setIsModalOpen] = useState(false); // Indique si la modale est ouverte

    const [experience, setExperience] = useState([]);
  
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Nouvel état pour la barre de recherche
    
 


    useEffect(() => {
        (async () => await Load())();
    }, []);

    async function Load() {
        const result = await axiosClient.get("/experience/");
        setExperience(result.data);
        
    }


    const handleClose = () => {
        setNotification(null);
    };

    const handleEditClick = (experience) => {
        setSelectedExperience(experience);
        setIsModalOpen(true);
        editeExperience(experience);
    };
    
    async function editeExperience(experience) {
        setDate_debut(experience.date_debut); // Met à jour la date de début
        setDate_fin(experience.date_fin);     // Met à jour la date de fin
        setEntreprise(experience.entreprise); // Met à jour le nom de l'entreprise
        setType(experience.type);             // Met à jour le type (stage ou professionnel)
        setRole(experience.role);             // Met à jour le rôle
        setDescription(experience.description); // Ajouter ceci
        setId(experience.id);                 // Met à jour l'ID de l'expérience
        // setImage(experience.image);           // Met à jour l'image, si disponible
    }
    


    async function save(event) {
        event.preventDefault();
        try {
            // FormData pour envoi multipart/form-data
            const formData = new FormData();
            formData.append('date_debut', date_debut); // Nouvelle variable pour la date de début
            formData.append('date_fin', date_fin);   // Nouvelle variable pour la date de fin
            formData.append('entreprise', entreprise); // Nouvelle variable pour l'entreprise
            formData.append('type', type); // Nouvelle variable pour le type (stage ou professionnel)
            formData.append('role', role); // Nouvelle variable pour le rôle
            formData.append('description', description); // Ajouter la description
            
            // Si vous avez une image (facultatif)
            // if (image) formData.append('image', image);
    
            // Envoi de la requête POST pour créer une nouvelle expérience
            await axiosClient.post('/experience/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            toast.success("Expérience enregistrée avec succès");
            resetForm(); // Réinitialiser le formulaire après un ajout réussi
        } catch (err) {
            console.error(err); // Débogage
            toast.error("Échec de l'enregistrement de l'expérience");
        }
    }
    
    async function update(event) {
        event.preventDefault();
   
    
        try {
            // FormData pour envoi multipart/form-data
            const formData = new FormData();
            formData.append('date_debut', date_debut); // Nouvelle variable pour la date de début
            formData.append('date_fin', date_fin);   // Nouvelle variable pour la date de fin
            formData.append('entreprise', entreprise); // Nouvelle variable pour l'entreprise
            formData.append('type', type); // Nouvelle variable pour le type (stage ou professionnel)
            formData.append('role', role); // Nouvelle variable pour le rôle
            formData.append('description', description); // Ajouter la description
    
            // Si vous avez une image (facultatif)
            // if (image instanceof File) {
            //     formData.append('image', image);
            // }
    
            // Envoi de la requête PUT pour mettre à jour l'expérience existante
            await axiosClient.put(`/experience/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            resetForm();
            toast.success('Expérience mise à jour avec succès');
        } catch (err) {
            console.error(err); // Débogage
            toast.error('Échec de la mise à jour de l\'expérience');
        }
    }
    
    
    

    async function DeleteExperience(id) {
        await axiosClient.delete(`/experience/${id}/`);
        resetForm();
        toast.success('experience supprimée avec succès');
    }

    const resetForm = () => {
        setDate_debut('');           // Réinitialise la date de début
        setDate_fin('');             // Réinitialise la date de fin
        setEntreprise('');          // Réinitialise le nom de l'entreprise
        setType('');                // Réinitialise le type (stage ou professionnel)
        setRole('');                // Réinitialise le rôle
        setDescription(''); // Ajouter ceci
        setId(null);                // Réinitialise l'ID de l'expérience
        setSelectedExperience(null); // Réinitialise l'expérience sélectionnée
        Load();                     // Recharge les données ou effectue toute action nécessaire
        setIsModalOpen(false);      // Ferme le modal
        setIsDeleteModalOpen(false); // Ferme le modal de suppression
    };
    

    const openDeleteModal = (experience) => {
        setSelectedExperience(experience);
        setIsDeleteModalOpen(true); 
    };

    const handleAddClick = () => {
        resetForm(); // Réinitialiser le formulaire avant d'ouvrir le modal d'ajout
        setIsModalOpen(true);
    };

    // Filtrer les experience en fonction de la recherche
    const filteredExperience = experience.filter(exp =>
        exp.entreprise.toLowerCase().includes(searchQuery.toLowerCase()) || // Recherche par entreprise
        exp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||      // Recherche par type (stage ou professionnel)
        exp.role.toLowerCase().includes(searchQuery.toLowerCase())     // Recherche par rôle
    
    );
    
    
    return (
        <React.Fragment>

              <ToastContainer />
      
                    {/* Modal pour ajouter une experience */}
                    <Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && !selectedExperience} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Ajouter une expérience</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={save}>
            <div className="form-group">
                <label htmlFor="entreprise">Nom de l'entreprise</label>
                <input 
                    type="text" 
                    id="entreprise" 
                    className="form-control" 
                    placeholder="Nom de l'entreprise" 
                    value={entreprise} 
                    onChange={(e) => setEntreprise(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="role">Rôle</label>
                <input 
                    type="text" 
                    id="role" 
                    className="form-control" 
                    placeholder="Rôle" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="type">Type</label>
                <input 
                    type="text" 
                    id="type" 
                    className="form-control" 
                    placeholder="Type (stage ou professionnel)" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="date_debut">Date de début</label>
                <input 
                    type="date" 
                    id="date_debut" 
                    className="form-control" 
                    value={date_debut} 
                    onChange={(e) => setDate_debut(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="date_fin">Date de fin</label>
                <input 
                    type="date" 
                    id="date_fin" 
                    className="form-control" 
                    value={date_fin} 
                    onChange={(e) => setDate_fin(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                    id="description" 
                    className="form-control" 
                    placeholder="Description de l'expérience" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows="4"
                    required 
                />
            </div>

            <div className="modal-footer">
                <button type="submit" className="btn-blue">
                    <i className="fas fa-plus"></i> Ajouter
                </button>
                <button className="btn-jaune" type="button" onClick={() => resetForm()}>
                    <i className="fas fa-times"></i> Annuler
                </button>
            </div>
        </form>
    </div>
</Modal>
<Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && selectedExperience} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Modifier l'expérience</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={update}>
            <div className="form-group">
                <label htmlFor="entreprise">Nom de l'entreprise</label>
                <input 
                    type="text" 
                    id="entreprise" 
                    className="form-control" 
                    placeholder="Nom de l'entreprise" 
                    value={entreprise} 
                    onChange={(e) => setEntreprise(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="role">Rôle</label>
                <input 
                    type="text" 
                    id="role" 
                    className="form-control" 
                    placeholder="Rôle" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="type">Type</label>
                <input 
                    type="text" 
                    id="type" 
                    className="form-control" 
                    placeholder="Type (stage ou professionnel)" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="date_debut">Date de début</label>
                <input 
                    type="date" 
                    id="date_debut" 
                    className="form-control" 
                    value={date_debut} 
                    onChange={(e) => setDate_debut(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="date_fin">Date de fin</label>
                <input 
                    type="date" 
                    id="date_fin" 
                    className="form-control" 
                    value={date_fin} 
                    onChange={(e) => setDate_fin(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                    id="description" 
                    className="form-control" 
                    placeholder="Description de l'expérience" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows="4"
                    required 
                />
            </div>

            <div className="modal-footer">
                <button type="submit" className="btn-blue">
                    <i className="fas fa-save"></i> Sauvegarder les modifications
                </button>
                <button 
                    className="btn-jaune" 
                    type="button" 
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(false);
                    }}
                >
                    <i className="fas fa-times"></i> Annuler
                </button>
            </div>
        </form>
    </div>
</Modal>





{/* Modal de suppression */}
<Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isDeleteModalOpen} 
    onRequestClose={() => setIsDeleteModalOpen(false)}
>
    <div className="modal-body text-center">
        <p>Voulez-vous supprimer l'experience {selectedExperience?.name} ?</p>
        <div className="modal-footer justify-content-center">
            <button className="btn-jaune" onClick={() => DeleteExperience(selectedExperience?.id)}>
                <i className="fas fa-trash"></i> Supprimer
            </button>
            <button className="btn-jaune" onClick={() => resetForm()}>
                <i className="fas fa-times"></i> Annuler
            </button>
        </div>
    </div>
</Modal>




<div className="row">
  <div className="col-12">
    <div className="card mb-4">
      <div className="card-header pb-0">
      <h2>Liste des experiences</h2>
      </div>
      
      <div className="header-bar">
  {/* Bouton pour ajouter une experience */}
  <button className="btn-create me-2" onClick={handleAddClick}>
  <i className="fas fa-plus"></i> <span className="btn-label">Nouvelle expérience</span>
</button>

  
  {/* Barre de recherche */}
  <div className="search-bar">
    <input
      type="text"
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
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Entreprise</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Type</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Date de début</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Date de fin</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Rôle</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Description</th>
      <th className="text-secondary opacity-7">Action</th>
    </tr>
  </thead>

  <tbody>
    {filteredExperience.length > 0 ? (
      filteredExperience.map(experience => (
        <tr key={experience.id}>
          <td>
            <p className="text-xs font-weight-bold mb-0">
              {experience.entreprise || 'Entreprise non définie'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {experience.type || 'Type non défini'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {experience.date_debut || 'Date de début non définie'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {experience.date_fin || 'Date de fin non définie'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {experience.role || 'Rôle non défini'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {experience.description || 'Aucune description'}
            </p>
          </td>

          <td className="align-middle">
            <div className="modal-footer">
            <button className="btn-blue me-2" onClick={() => handleEditClick(experience)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn-jaune" onClick={() => openDeleteModal(experience)}>
              <i className="fas fa-trash"></i>
            </button>
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="7" style={{ textAlign: 'center' }}>Aucun résultat trouvé</td>
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

export default Experience;
