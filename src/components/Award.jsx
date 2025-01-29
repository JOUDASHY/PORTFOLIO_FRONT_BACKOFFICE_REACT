import axios from 'axios';
import { useEffect, useState } from "react";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import axiosClient from '../axiosClient';

Modal.setAppElement('#root');

function Award() {
 
// États pour les champs de l'éducation


// const [image, setImage] = useState(null); // Image de l'éducation (fichier)
const [institution, setInstitution] = useState('');
const [annee, setAnnee] = useState('');
const [titre, setTitre] = useState('');
const [type, setType] = useState('');
const [role, setRole] = useState('');
// États pour la gestion de la sélection
const [id, setId] = useState(null); // ID de l'éducation à modifier
const [selectedAward, setSelectedAward] = useState(null); // Éducation sélectionnée pour modification

// États pour la gestion de la modale
const [isModalOpen, setIsModalOpen] = useState(false); // Indique si la modale est ouverte

    const [Award, setAward] = useState([]);
  
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   
    const [searchQuery, setSearchQuery] = useState(''); // Nouvel état pour la barre de recherche
    
 


    useEffect(() => {
        (async () => await Load())();
    }, []);

    async function Load() {
        const result = await axiosClient.get("/awards/");
        setAward(result.data);
        
    }


    const handleClose = () => {
        setNotification(null);
    };

    const handleEditClick = (Award) => {
        setSelectedAward(Award);
        setIsModalOpen(true);
        editeAward(Award);
    };
    
    async function editeAward(Award) {
        setInstitution(Award.institution); // Met à jour la Institution
        setAnnee(Award.annee);     // Met à jour la Annee
        setTitre(Award.titre); // Met à jour le nom de l'titre
        setType(Award.type);             // Met à jour le type (stage ou professionnel)
                // Met à jour le rôle
        setId(Award.id);                 // Met à jour l'ID de l'award
        // setImage(Award.image);           // Met à jour l'image, si disponible
    }
    


    async function save(event) {
        event.preventDefault();
        try {
            // FormData pour envoi multipart/form-data
            const formData = new FormData();
            formData.append('institution', institution); // Nouvelle variable pour la Institution
            formData.append('annee', annee);   // Nouvelle variable pour la Annee
            formData.append('titre', titre); // Nouvelle variable pour l'titre
            formData.append('type', type); // Nouvelle variable pour le type (stage ou professionnel)
          // Nouvelle variable pour le rôle
            
            // Si vous avez une image (facultatif)
            // if (image) formData.append('image', image);
    
            // Envoi de la requête POST pour créer une nouvelle award
            await axiosClient.post('/awards/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            toast.success("award enregistrée avec succès");
            resetForm(); // Réinitialiser le formulaire après un ajout réussi
        } catch (err) {
            console.error(err); // Débogage
            toast.error("Échec de l'enregistrement de l'award");
        }
    }
    
    async function update(event) {
        event.preventDefault();
   
    
        try {
            // FormData pour envoi multipart/form-data
            const formData = new FormData();
            formData.append('institution', institution); // Nouvelle variable pour la Institution
            formData.append('annee', annee);   // Nouvelle variable pour la Annee
            formData.append('titre', titre); // Nouvelle variable pour l'titre
            formData.append('type', type); // Nouvelle variable pour le type (stage ou professionnel)
          // Nouvelle variable pour le rôle
    
            // Si vous avez une image (facultatif)
            // if (image instanceof File) {
            //     formData.append('image', image);
            // }
    
            // Envoi de la requête PUT pour mettre à jour l'award existante
            await axiosClient.put(`/awards/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            resetForm();
            toast.success('award mise à jour avec succès');
        } catch (err) {
            console.error(err); // Débogage
            toast.error('Échec de la mise à jour de l\'award');
        }
    }
    
    
    

    async function DeleteAward(id) {
        await axiosClient.delete(`/awards/${id}/`);
        resetForm();
        toast.success('Award supprimée avec succès');
    }

    const resetForm = () => {
        setInstitution('');           // Réinitialise la Institution
        setAnnee('');             // Réinitialise la Annee
        setTitre('');          // Réinitialise le nom de l'titre
        setType('');                // Réinitialise le type (stage ou professionnel)
            // Réinitialise l'image (si applicable)
        setId(null);                // Réinitialise l'ID de l'award
        setSelectedAward(null); // Réinitialise l'award sélectionnée
        Load();                     // Recharge les données ou effectue toute action nécessaire
        setIsModalOpen(false);      // Ferme le modal
        setIsDeleteModalOpen(false); // Ferme le modal de suppression
    };
    

    const openDeleteModal = (Award) => {
        setSelectedAward(Award);
        setIsDeleteModalOpen(true); 
    };

    const handleAddClick = () => {
        resetForm(); // Réinitialiser le formulaire avant d'ouvrir le modal d'ajout
        setIsModalOpen(true);
    };

    // Filtrer les Award en fonction de la recherche
    const filteredAward = Award.filter(exp =>
        exp.titre.toLowerCase().includes(searchQuery.toLowerCase()) || // Recherche par titre
        exp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||      // Recherche par type (stage ou professionnel)
        // exp.annee.toLowerCase().includes(searchQuery.toLowerCase()) ||      // Recherche par type (stage ou professionnel)
        exp.institution.toLowerCase().includes(searchQuery.toLowerCase())     // Recherche par rôle
        
    );
    
    
    return (
        <React.Fragment>

              <ToastContainer />
      
                    {/* Modal pour ajouter une Award */}
                    <Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && !selectedAward} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Ajouter une award</h4>
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
                <label htmlFor="institution">Institution</label>
                <input 
                    type="text" 
                    id="institution" 
                    className="form-control" 
                    value={institution} 
                    onChange={(e) => setInstitution(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="annee">Annee</label>
                <input 
                    type="number" 
                    id="annee" 
                    className="form-control" 
                    value={annee} 
                    onChange={(e) => setAnnee(e.target.value)} 
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
<Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && selectedAward} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Modifier l'award</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={update}>
       
        <div className="form-group">
                <label htmlFor="titre">titre</label>
                <input 
                    type="text" 
                    id="titre" 
                    className="form-control" 
                    placeholder="titre" 
                    value={titre} 
                    onChange={(e) => setTitre(e.target.value)} 
                    required 
                />
            </div>


        

            <div className="form-group">
                <label htmlFor="institution">Institution</label>
                <input 
                    type="text" 
                    id="institution" 
                    className="form-control" 
                    value={institution} 
                    onChange={(e) => setInstitution(e.target.value)} 
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
                <label htmlFor="annee">Annee</label>
                <input 
                    type="number" 
                    id="annee" 
                    className="form-control" 
                    value={annee} 
                    onChange={(e) => setAnnee(e.target.value)} 
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
        <p>Voulez-vous supprimer l'Award {selectedAward?.name} ?</p>
        <div className="modal-footer justify-content-center">
            <button className="btn btn-danger" onClick={() => DeleteAward(selectedAward?.id)}>
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
      <h2>Liste des Awards</h2>
      </div>
      
      <div className="header-bar">
  {/* Bouton pour ajouter une Award */}
  <button className="btn-create me-2" onClick={handleAddClick}>
    <i className="fas fa-plus"></i> <span className="btn-label">Nouvelle Award</span>
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
{/* Table d'affichage des awards professionnelles */}
<table className="table align-items-center mb-0">
  <thead>
    <tr>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">titre</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Type</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Institution</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Annee</th>

      <th className="text-secondary opacity-7">Action</th>
    </tr>
  </thead>

  <tbody>
    {filteredAward.length > 0 ? (
      filteredAward.map(Award => (
        <tr key={Award.id}>
          <td>
            <p className="text-xs font-weight-bold mb-0">
              {Award.titre || 'titre non définie'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {Award.type || 'Type non défini'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {Award.institution || 'Institution non définie'}
            </p>
          </td>

          <td>
            <p className="text-xs font-weight-bold mb-0">
              {Award.annee || 'Annee non définie'}
            </p>
          </td>



          <td className="align-middle">
            <button className="btn btn-primary me-2" onClick={() => handleEditClick(Award)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn btn-danger" onClick={() => openDeleteModal(Award)}>
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

export default Award;
