import axios from 'axios';
import { useEffect, useState } from "react";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import axiosClient from '../axiosClient';

Modal.setAppElement('#root');

function Education() {
 
// États pour les champs de l'éducation
const [nom_ecole, setNomEcole] = useState(''); // Nom de l'école
const [nom_parcours, setNomParcours] = useState(''); // Nom du parcours
const [annee_debut, setAnneeDebut] = useState(''); // Année de début
const [annee_fin, setAnneeFin] = useState(''); // Année de fin
const [lieu, setLieu] = useState(''); // Lieu de l'éducation
const [image, setImage] = useState(null); // Image de l'éducation (fichier)

// États pour la gestion de la sélection
const [id, setId] = useState(null); // ID de l'éducation à modifier
const [selectedEducation, setSelectedEducation] = useState(null); // Éducation sélectionnée pour modification

// États pour la gestion de la modale
const [isModalOpen, setIsModalOpen] = useState(false); // Indique si la modale est ouverte

    const [education, setEductions] = useState([]);
  
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Nouvel état pour la barre de recherche
    
 


    useEffect(() => {
        (async () => await Load())();
    }, []);

    async function Load() {
        const result = await axiosClient.get("/education/");
        setEductions(result.data);
        
    }


    const handleClose = () => {
        setNotification(null);
    };

    const handleEditClick = (education) => {
        setSelectedEducation(education);
        setIsModalOpen(true);
        editEducation(education);
    };
    
    async function editEducation(education) {
        setNomEcole(education.nom_ecole);
        setNomParcours(education.nom_parcours);
        setAnneeDebut(education.annee_debut);
        setAnneeFin(education.annee_fin);
        setLieu(education.lieu);
        setId(education.id);
        setImage(education.image);
    }
    
    async function save(event) {
        event.preventDefault();
        try {
            // FormData pour envoi multipart/form-data
            const formData = new FormData();
            formData.append('nom_ecole', nom_ecole);
            if (nom_parcours) formData.append('nom_parcours', nom_parcours);
            if (annee_debut) formData.append('annee_debut', annee_debut);
            if (annee_fin) formData.append('annee_fin', annee_fin);
            if (lieu) formData.append('lieu', lieu);
            if (image) formData.append('image', image);
          
            
            await axiosClient.post('/education/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            toast.success("Éducation enregistrée avec succès");
            resetForm(); // Réinitialiser le formulaire après un ajout réussi
        } catch (err) {
            console.error(err); // Débogage
            toast.error("Échec de l'enregistrement de l'éducation");
        }
    }
    
    async function update(event) {
        event.preventDefault();
        console.log("Updating with data:", { 
            id, 
            nom_ecole, 
            nom_parcours, 
            annee_debut, 
            annee_fin, 
            lieu, 
            image 
        }); // Débogage
    
        try {
            const formData = new FormData();
            formData.append('nom_ecole', nom_ecole);
            if (nom_parcours) formData.append('nom_parcours', nom_parcours);
            if (annee_debut) formData.append('annee_debut', annee_debut);
            if (annee_fin) formData.append('annee_fin', annee_fin);
            if (lieu) formData.append('lieu', lieu);
           
            if (image instanceof File) {
                formData.append('image', image);
            }
    
            await axiosClient.put(`/education/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            resetForm();
            toast.success('Éducation mise à jour avec succès');
        } catch (err) {
            console.error(err); // Débogage
            toast.error('Échec de la mise à jour de l\'éducation');
        }
    }
    
    

    async function DeleteEducation(id) {
        await axiosClient.delete(`/education/${id}/`);
        resetForm();
        toast.success('education supprimée avec succès');
    }

    const resetForm = () => {
        setNomEcole('');
    setNomParcours('');
    setAnneeDebut('');
    setAnneeFin('');
    setLieu('');
    setImage(null);
    setId(null);
        setSelectedEducation(null);
        Load();
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const openDeleteModal = (education) => {
        setSelectedEducation(education);
        setIsDeleteModalOpen(true); 
    };

    const handleAddClick = () => {
        resetForm(); // Réinitialiser le formulaire avant d'ouvrir le modal d'ajout
        setIsModalOpen(true);
    };

    // Filtrer les education en fonction de la recherche
    const filteredEducation = education.filter(edu =>
        edu.nom_ecole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        edu.nom_parcours.toLowerCase().includes(searchQuery.toLowerCase()) ||
        edu.lieu.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
        <React.Fragment>

              <ToastContainer />
      
                    {/* Modal pour ajouter une education */}
                    <Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && !selectedEducation} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Ajouter une éducation</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={save}>
            <div className="form-group">
                <label htmlFor="nomEcole">Nom de l'école</label>
                <input 
                    type="text" 
                    id="nomEcole" 
                    className="form-control" 
                    placeholder="Nom de l'école" 
                    value={nom_ecole} 
                    onChange={(e) => setNomEcole(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="nomParcours">Nom du parcours</label>
                <input 
                    type="text" 
                    id="nomParcours" 
                    className="form-control" 
                    placeholder="Nom du parcours" 
                    value={nom_parcours} 
                    onChange={(e) => setNomParcours(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="anneeDebut">Année de début</label>
                <input 
                    type="number" 
                    id="anneeDebut" 
                    className="form-control" 
                    placeholder="Année de début" 
                    value={annee_debut} 
                    onChange={(e) => setAnneeDebut(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="anneeFin">Année de fin</label>
                <input 
                    type="number" 
                    id="anneeFin" 
                    className="form-control" 
                    placeholder="Année de fin" 
                    value={annee_fin} 
                    onChange={(e) => setAnneeFin(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="lieu">Lieu</label>
                <input 
                    type="text" 
                    id="lieu" 
                    className="form-control" 
                    placeholder="Lieu" 
                    value={lieu} 
                    onChange={(e) => setLieu(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="fileInput">Logo ou Image</label>
                {image ? (
                    <div className="form-group d-flex align-items-center justify-content-center">
                        <label htmlFor="fileInput" className="file-input-label image-selected">
                            <img 
                                src={image instanceof File ? URL.createObjectURL(image) : `${import.meta.env.VITE_API_BASE_URL}/storage/${image}`} 
                                alt="Aperçu de l'image" 
                                className="image-preview"
                            />
                            <input 
                                type="file" 
                                id="fileInput" 
                                className="form-control-file" 
                                onChange={(e) => setImage(e.target.files[0])} 
                            />
                        </label>
                    </div>
                ) : (
                    <div className="form-group d-flex align-items-center justify-content-center">
                        <label htmlFor="fileInput" className="file-input-label">
                            <span className="icon">+</span>
                            <small>PNG, JPG, GIF jusqu'à 10MB</small>
                            <input 
                                type="file" 
                                id="fileInput" 
                                className="form-control-file" 
                                onChange={(e) => setImage(e.target.files[0])} 
                            />
                        </label>
                    </div>
                )}
            </div>

            <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                    <i className="fas fa-plus"></i> Ajouter
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => resetForm()}>
                    <i className="fas fa-times"></i> Annuler
                </button>
            </div>
        </form>
    </div>
</Modal>

{/* Modal pour modifier une education */}
<Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && selectedEducation} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Modifier l'éducation</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={update}>
            <div className="form-group">
                <label htmlFor="nomEcole">Nom de l'école</label>
                <input 
                    type="text" 
                    id="nomEcole" 
                    className="form-control" 
                    placeholder="Nom de l'école" 
                    value={nom_ecole} 
                    onChange={(e) => setNomEcole(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="nomParcours">Nom du parcours</label>
                <input 
                    type="text" 
                    id="nomParcours" 
                    className="form-control" 
                    placeholder="Nom du parcours" 
                    value={nom_parcours} 
                    onChange={(e) => setNomParcours(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="anneeDebut">Année de début</label>
                <input 
                    type="number" 
                    id="anneeDebut" 
                    className="form-control" 
                    placeholder="Année de début" 
                    value={annee_debut} 
                    onChange={(e) => setAnneeDebut(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="anneeFin">Année de fin</label>
                <input 
                    type="number" 
                    id="anneeFin" 
                    className="form-control" 
                    placeholder="Année de fin" 
                    value={annee_fin} 
                    onChange={(e) => setAnneeFin(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="lieu">Lieu</label>
                <input 
                    type="text" 
                    id="lieu" 
                    className="form-control" 
                    placeholder="Lieu" 
                    value={lieu} 
                    onChange={(e) => setLieu(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="fileInput">Logo ou Image</label>
                {image ? (
                    <div className="form-group d-flex align-items-center justify-content-center">
                        <label htmlFor="fileInput" className="file-input-label image-selected">
                            <img 
                                src={image instanceof File ? URL.createObjectURL(image) : `${import.meta.env.VITE_API_BASE_URL}/storage/${image}`} 
                                alt="Aperçu de l'image" 
                                className="image-preview"
                            />
                            <input 
                                type="file" 
                                id="fileInput" 
                                className="form-control-file" 
                                onChange={(e) => setImage(e.target.files[0])} 
                            />
                        </label>
                    </div>
                ) : (
                    <div className="form-group d-flex align-items-center justify-content-center">
                        <label htmlFor="fileInput" className="file-input-label">
                            <span className="icon">+</span>
                            <small>PNG, JPG, GIF jusqu'à 10MB</small>
                            <input 
                                type="file" 
                                id="fileInput" 
                                className="form-control-file" 
                                onChange={(e) => setImage(e.target.files[0])} 
                            />
                        </label>
                    </div>
                )}
            </div>

            <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save"></i> Sauvegarder les modifications
                </button>
                <button 
                    className="btn btn-secondary" 
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
        <p>Voulez-vous supprimer la education {selectedEducation?.name} ?</p>
        <div className="modal-footer justify-content-center">
            <button className="btn btn-danger" onClick={() => DeleteEducation(selectedEducation?.id)}>
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
      <h2>Liste des educations</h2>
      </div>
      
      <div className="header-bar">
  {/* Bouton pour ajouter une education */}
  <button className="btn-create me-2" onClick={handleAddClick}>
    <i className="fas fa-plus"></i> <span className="btn-label">Nouvelle education</span>
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
        <table className="table align-items-center mb-0">
  <thead>
    <tr>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nom de l'école</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nom du parcours</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Année de début</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Année de fin</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Lieu</th>
      <th className="text-secondary opacity-7">Action</th>
    </tr>
  </thead>

  <tbody>
    {filteredEducation.length > 0 ? (
      filteredEducation.map(education => (
        <tr key={education.id}>
          <td>
            <p className="text-xs font-weight-bold mb-0">
              <img
                src={`${education.image}`}
                className="avatar avatar-sm me-3 fixed-image"
                alt={education.nom_ecole}
              />
              {education.nom_ecole}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {education.nom_parcours || 'Nom de parcours non défini'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {education.annee_debut ? education.annee_debut : 'Année de début non définie'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {education.annee_fin ? education.annee_fin : 'Année de fin non définie'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {education.lieu || 'Lieu non défini'}
            </p>
          </td>

          <td className="align-middle">
            <button className="btn btn-primary me-2" onClick={() => handleEditClick(education)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn btn-danger" onClick={() => openDeleteModal(education)}>
              <i className="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" style={{ textAlign: 'center' }}>Aucun résultat trouvé</td>
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

export default Education;
