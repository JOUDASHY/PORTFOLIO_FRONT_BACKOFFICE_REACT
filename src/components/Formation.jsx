import axios from 'axios';
import { useEffect, useState } from "react";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import axiosClient from '../axiosClient';

Modal.setAppElement('#root');

function Formation() {
 
// États pour les champs de l'Formation
const [titre, setTitre] = useState(''); // Titre
const [formateur, seFormateur] = useState(''); // Formateur
const [description, setDescription] = useState(''); // description
const [debut, setDebut] = useState(''); // debut
const [fin, setFin] = useState(''); // fin de l'Formation

// États pour la gestion de la sélection
const [id, setId] = useState(null); // ID de l'Formation à modifier
const [selectedFormation, setSelectedFormation] = useState(null); // Formation sélectionnée pour modification

// États pour la gestion de la modale
const [isModalOpen, setIsModalOpen] = useState(false); // Indique si la modale est ouverte

    const [Formation, setFormations] = useState([]);
  
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 
    const [searchQuery, setSearchQuery] = useState(''); // Nouvel état pour la barre de recherche
    
 


    useEffect(() => {
        (async () => await Load())();
    }, []);

    async function Load() {
        const result = await axiosClient.get("/formations/");
        setFormations(result.data);
        
    }


    const handleClose = () => {
        setNotification(null);
    };

    const handleEditClick = (Formation) => {
        setSelectedFormation(Formation);
        setIsModalOpen(true);
        editFormation(Formation);
    };
    
    async function editFormation(Formation) {
        setTitre(Formation.titre);
        seFormateur(Formation.formateur);
        setDescription(Formation.description);
        setDebut(Formation.debut);
        setFin(Formation.fin);
        setId(Formation.id);
    
    }
    
    async function save(event) {
        event.preventDefault();
        try {
            // FormData pour envoi multipart/form-data
            const formData = new FormData();
            formData.append('titre', titre);
            if (formateur) formData.append('formateur', formateur);
            if (description) formData.append('description', description);
            if (debut) formData.append('debut', debut);
            if (fin) formData.append('fin', fin);
            
            await axiosClient.post('/formations/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            toast.success("Formation enregistrée avec succès");
            resetForm(); // Réinitialiser le formulaire après un ajout réussi
        } catch (err) {
            console.error(err); // Débogage
            toast.error("Échec de l'enregistrement de l'Formation");
        }
    }
    
    async function update(event) {
        event.preventDefault();
        console.log("Updating with data:", { 
            id, 
            titre, 
            formateur, 
            description, 
            debut, 
            fin
        }); // Débogage
    
        try {
            const formData = new FormData();
            formData.append('titre', titre);
            if (formateur) formData.append('formateur', formateur);
            if (description) formData.append('description', description);
            if (debut) formData.append('debut', debut);
            if (fin) formData.append('fin', fin);
           
       
            await axiosClient.put(`/formations/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            resetForm();
            toast.success('Formation mise à jour avec succès');
        } catch (err) {
            console.error(err); // Débogage
            toast.error('Échec de la mise à jour de l\'Formation');
        }
    }
    
    

    async function DeleteFormation(id) {
        await axiosClient.delete(`/formations/${id}/`);
        resetForm();
        toast.success('Formation supprimée avec succès');
    }

    const resetForm = () => {
        setTitre('');
    seFormateur('');
    setDescription('');
    setDebut('');
    setFin('');
  
    setId(null);
        setSelectedFormation(null);
        Load();
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const openDeleteModal = (Formation) => {
        setSelectedFormation(Formation);
        setIsDeleteModalOpen(true); 
    };

    const handleAddClick = () => {
        resetForm(); // Réinitialiser le formulaire avant d'ouvrir le modal d'ajout
        setIsModalOpen(true);
    };

    // Filtrer les Formation en fonction de la recherche
    const filteredFormation = Formation.filter(edu =>
        edu.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        edu.formateur.toLowerCase().includes(searchQuery.toLowerCase()) ||
        edu.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
        <React.Fragment>

              <ToastContainer />
      
                    {/* Modal pour ajouter une Formation */}
                    <Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && !selectedFormation} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Ajouter une Formation</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={save}>
            <div className="form-group">
                <label htmlFor="titre">Titre</label>
                <input 
                    type="text" 
                    id="titre" 
                    className="form-control" 
                    placeholder="Titre" 
                    value={titre} 
                    onChange={(e) => setTitre(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="nomParcours">Formateur</label>
                <input 
                    type="text" 
                    id="nomParcours" 
                    className="form-control" 
                    placeholder="Formateur" 
                    value={formateur} 
                    onChange={(e) => seFormateur(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">description</label>
                <input 
                    type="texte" 
                    id="description" 
                    className="form-control" 
                    placeholder="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="debut">debut</label>
                <input 
                    type="date" 
                    id="debut" 
                    className="form-control" 
                    placeholder="debut" 
                    value={debut} 
                    onChange={(e) => setDebut(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="fin">fin</label>
                <input 
                    type="date" 
                    id="fin" 
                    className="form-control" 
                    placeholder="fin" 
                    value={fin} 
                    onChange={(e) => setFin(e.target.value)} 
                    required 
                />
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

{/* Modal pour modifier une Formation */}
<Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && selectedFormation} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Modifier la Formation</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={update}>
            <div className="form-group">
                <label htmlFor="titre">Titre</label>
                <input 
                    type="text" 
                    id="titre" 
                    className="form-control" 
                    placeholder="Titre" 
                    value={titre} 
                    onChange={(e) => setTitre(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="nomParcours">Formateur</label>
                <input 
                    type="text" 
                    id="nomParcours" 
                    className="form-control" 
                    placeholder="Formateur" 
                    value={formateur} 
                    onChange={(e) => seFormateur(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">description</label>
                <input 
                    type="texte" 
                    id="description" 
                    className="form-control" 
                    placeholder="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="debut">debut</label>
                <input 
                    type="date" 
                    id="debut" 
                    className="form-control" 
                    placeholder="debut" 
                    value={debut} 
                    onChange={(e) => setDebut(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="fin">fin</label>
                <input 
                    type="date" 
                    id="fin" 
                    className="form-control" 
                    placeholder="fin" 
                    value={fin} 
                    onChange={(e) => setFin(e.target.value)} 
                    required 
                />
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
        <p>Voulez-vous supprimer la Formation {selectedFormation?.name} ?</p>
        <div className="modal-footer justify-content-center">
            <button className="btn btn-danger" onClick={() => DeleteFormation(selectedFormation?.id)}>
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
      <h2>Liste des Formations</h2>
      </div>
      
      <div className="header-bar">
  {/* Bouton pour ajouter une Formation */}
  <button className="btn-create" onClick={handleAddClick}>
    <i className="fas fa-plus"></i> <span className="btn-label">Nouvelle Formation</span>
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
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Titre</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Formateur</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">description</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">debut</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">fin</th>
      <th className="text-secondary opacity-7">Action</th>
    </tr>
  </thead>

  <tbody>
    {filteredFormation.length > 0 ? (
      filteredFormation.map(Formation => (
        <tr key={Formation.id}>
          <td>
            <p className="text-xs font-weight-bold mb-0">
            
              {Formation.titre}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {Formation.formateur || 'Nom de parcours non défini'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {Formation.description ? Formation.description : 'description non définie'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {Formation.debut ? Formation.debut : 'debut non définie'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {Formation.fin || 'fin non défini'}
            </p>
          </td>

          <td className="align-middle">
            <button className="btn btn-primary me-2" onClick={() => handleEditClick(Formation)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn btn-danger" onClick={() => openDeleteModal(Formation)}>
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

export default Formation;
