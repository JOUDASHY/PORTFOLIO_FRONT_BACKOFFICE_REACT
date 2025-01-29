import axios from 'axios';
import { useEffect, useState } from "react";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import axiosClient from '../axiosClient';

Modal.setAppElement('#root');

function Langue() {

const [titre, setTitre] = useState('');
const [niveau, setNiveau] = useState('');

const [id, setId] = useState(null); // ID de l'éducation à modifier
const [selectedlangue, setSelectedlangue] = useState(null); // Éducation sélectionnée pour modification

// États pour la gestion de la modale
const [isModalOpen, setIsModalOpen] = useState(false); // Indique si la modale est ouverte

    const [langue, setLangues] = useState([]);
  
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Nouvel état pour la barre de recherche
    
 


    useEffect(() => {
        (async () => await Load())();
    }, []);

    async function Load() {
        const result = await axiosClient.get("/langues/");
        setLangues(result.data);
 
    }


    const handleClose = () => {
        setNotification(null);
    };

    const handleEditClick = (langue) => {
        setSelectedlangue(langue);
        setIsModalOpen(true);
        editLangue(langue);
    };
    
    async function editLangue(langue) {
        setTitre(langue.titre);             // Met à jour le nom de la langue
        setNiveau(langue.niveau);       // Met à jour le niveau de la langue (par exemple, Débutant, Intermédiaire, Expert)
        // setDescription(langue.description); // Met à jour la description
        setId(langue.id);               // Met à jour l'ID de la langue
    }
    
    async function save(event) {
        event.preventDefault();
        try {
            // FormData pour envoi multipart/form-data
            const formData = new FormData();
            formData.append('titre', titre);               // Nom de la langue
            formData.append('niveau', niveau);         // Niveau
            // formData.append('description', description); // Description (facultative)
            
            // Envoi de la requête POST pour créer une nouvelle langue
            await axiosClient.post('/langues/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            toast.success("Langue enregistrée avec succès");
            resetForm(); // Réinitialiser le formulaire après un ajout réussi
        } catch (err) {
            console.error(err); // Débogage
            toast.error("Échec de l'enregistrement de la langue");
        }
    }
    
    async function update(event) {
        event.preventDefault();
        try {
            // FormData pour envoi multipart/form-data
            const formData = new FormData();
            formData.append('titre', titre);               // Nom de la langue
            formData.append('niveau', niveau);         // Niveau
            // formData.append('description', description); // Description (facultative)
    
            // Envoi de la requête PUT pour mettre à jour la langue existante
            await axiosClient.put(`/langues/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            resetForm();
            toast.success('Langue mise à jour avec succès');
        } catch (err) {
            console.error(err); // Débogage
            toast.error('Échec de la mise à jour de la langue');
        }
    }
    
    const resetForm = () => {
        setTitre('');                    // Réinitialise le nom de la langue
        setNiveau('');                 // Réinitialise le niveau de la langue
        // setDescription('');            // Réinitialise la description
        setId(null);                   // Réinitialise l'ID de la langue
        setSelectedlangue(null);       // Réinitialise la langue sélectionnée
        Load();                 // Recharge les données ou effectue toute action nécessaire
        setIsModalOpen(false);         // Ferme le modal
        setIsDeleteModalOpen(false);   // Ferme le modal de suppression
    };
    
    // Fonction pour charger les langues (exemple)
 
    

    const openDeleteModal = (langue) => {
        setSelectedlangue(langue);
        setIsDeleteModalOpen(true); 
    };
    async function Deletelangue(id) {
        await axiosClient.delete(`/langues/${id}/`);
        resetForm();
        toast.success('langue supprimée avec succès');
    }
    const handleAddClick = () => {
        resetForm(); // Réinitialiser le formulaire avant d'ouvrir le modal d'ajout
        setIsModalOpen(true);
    };

    // Filtrer les langue en fonction de la recherche
    const filteredLangues = langue.filter(exp =>
        exp.titre.toLowerCase().includes(searchQuery.toLowerCase()) || // Recherche par entreprise
        exp.niveau.toLowerCase().includes(searchQuery.toLowerCase())      // Recherche par type (stage ou professionnel)
        // exp.role.toLowerCase().includes(searchQuery.toLowerCase())     // Recherche par rôle
    
    );
    
    
    return (
        <React.Fragment>

              <ToastContainer />
      
                    {/* Modal pour ajouter une langue */}
                    <Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && !selectedlangue} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Ajouter une langue</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={save}>
            <div className="form-group">
                <label htmlFor="entreprise">Nom de la langue</label>
                <input 
                    type="text" 
                    id="entreprise" 
                    className="form-control" 
                    placeholder="Nom de l'entreprise" 
                    value={titre} 
                    onChange={(e) => setTitre(e.target.value)} 
                    required 
                />
            </div>

       

            <div className="form-group">
    <label htmlFor="niveau">Niveau</label>
    <select 
        id="niveau" 
        className="form-control" 
        value={niveau} 
        onChange={(e) => setNiveau(e.target.value)} 
        required
    >
        <option value="" disabled>-- Sélectionner un niveau --</option>
        <option value="Débutant">Débutant</option>
        <option value="Intermédiaire">Intermédiaire</option>
        <option value="Avancé">Avancé</option>
    </select>
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
<Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && selectedlangue} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Modifier l'langue</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={update}>
            <div className="form-group">
                <label htmlFor="entreprise">Titre</label>
                <input 
                    type="text" 
                    id="entreprise" 
                    className="form-control" 
                    placeholder="Titre" 
                    value={titre} 
                    onChange={(e) => setTitre(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
    <label htmlFor="niveau">Niveau</label>
    <select 
        id="niveau" 
        className="form-control" 
        value={niveau} 
        onChange={(e) => setNiveau(e.target.value)} 
        required
    >
        <option value="" disabled>-- Sélectionner un niveau --</option>
        <option value="Débutant">Débutant</option>
        <option value="Intermédiaire">Intermédiaire</option>
        <option value="Avancé">Avancé</option>
    </select>
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
        <p>Voulez-vous supprimer l'langue {selectedlangue?.name} ?</p>
        <div className="modal-footer justify-content-center">
            <button className="btn btn-danger" onClick={() => Deletelangue(selectedlangue?.id)}>
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
            <h2>Liste des langues</h2>
          </div>
          <div className="header-bar">
            <button className="btn-create me-2" onClick={handleAddClick}>
              <i className="fas fa-plus"></i> <span className="btn-label ">Nouvelle langue</span>
            </button>
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
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Niveau</th>
                    <th className="text-secondary opacity-7">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLangues.length > 0 ? (
                    filteredLangues.map(langue => (
                      <tr key={langue.id}>
                        <td>
                          <p className="text-xs font-weight-bold mb-0">
                            {langue.titre || "Titre non défini"}
                          </p>
                        </td>
                        <td>
                          <p className="text-xs font-weight-bold mb-0">
                            {langue.niveau || "Niveau non défini"}
                          </p>
                        </td>
                        <td className="align-middle">
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => handleEditClick(langue)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => openDeleteModal(langue)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>Aucun résultat trouvé</td>
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

export default Langue;
