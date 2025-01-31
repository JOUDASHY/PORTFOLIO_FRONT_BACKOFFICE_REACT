import axios from 'axios';
import { useEffect, useState } from "react";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import axiosClient from '../axiosClient';

Modal.setAppElement('#root');

function Competence() {
 // États pour les champs de la compétence
const [name, setName] = useState(''); // nom de la compétence
const [description, setDescription] = useState(''); // Description de la compétence
const [niveau, setNiveau] = useState(''); // Niveau de maîtrise (Débutant, Intermédiaire, Expert)
const [id, setId] = useState(null); // ID de la compétence à modifier
const [selectedCompetence, setSelectedCompetence] = useState(null); // Compétence sélectionnée pour modification
const [categorie, setCategorie] = useState(null); // Compétence sélectionnée pour modification

// États pour la gestion de la modale
const [isModalOpen, setIsModalOpen] = useState(false); // Indique si la modale est ouverte
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Indique si la modale de suppression est ouverte
const [notification, setNotification] = useState(null); // Notifications (succès/échec)
const [searchQuery, setSearchQuery] = useState(''); // Recherche
const [image, setImage] = useState(null);

// Liste des compétences
const [competences, setCompetences] = useState([]);

// Charger les données lors du montage du composant
useEffect(() => {
    (async () => await Load())();
}, []);

async function Load() {
    const result = await axiosClient.get("/competences/");
    setCompetences(result.data);
}

// Réinitialiser le formulaire
const resetForm = () => {
    setName('');
    setDescription('');
    setNiveau('');
    setCategorie('');
    setImage(null);
    setId(null);
    setSelectedCompetence(null);
    Load();
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    // setIsModalOpen(false);

};

// Ajouter une compétence
async function save(event) {
  event.preventDefault();
  try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("niveau", niveau);
      formData.append("categorie", categorie);
      formData.append("image", image); // image doit être un objet `File`

      console.log("Données envoyées :", Object.fromEntries(formData.entries())); // Debug

      await axiosClient.post("/competences/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Compétence enregistrée avec succès");
      resetForm();
  } catch (err) {
      console.error("Erreur Axios :", err.response?.data || err);
      toast.error("Échec de l'enregistrement de la compétence");
  }
}


// Mettre à jour une compétence
async function update(event) {
  event.preventDefault();

  try {
    // Création de l'objet FormData pour gérer les données
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('niveau', niveau);
    formData.append('categorie', categorie);

    // Ajout du fichier d'image si nécessaire
    if (image instanceof File) {
      formData.append('image', image);
    }

    // Envoi de la requête PUT avec les données
    await axiosClient.put(`/competences/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Notification de succès
    toast.success('Compétence mise à jour avec succès');
    
    // Réinitialisation du formulaire après mise à jour
    resetForm();
  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors de la mise à jour de la compétence :', err);
    toast.error("Échec de la mise à jour de la compétence");
  }
}


// Supprimer une compétence
async function deleteCompetence(id) {
    try {
        await axiosClient.delete(`/competences/${id}/`);
        toast.success('Compétence supprimée avec succès');
        resetForm();
    } catch (err) {
        console.error(err);
        toast.error("Échec de la suppression de la compétence");
    }
}

// Ouvrir le modal d'ajout
const handleAddClick = () => {
    resetForm();
    setIsModalOpen(true);
};

// Ouvrir le modal de modification
const handleEditClick = (competence) => {
    setSelectedCompetence(competence);
    setName(competence.name);
    setDescription(competence.description);
    setNiveau(competence.niveau);
    setId(competence.id);
    setImage(competence.image);
    setCategorie(competence.categorie);
    setIsModalOpen(true);
};

// Ouvrir le modal de suppression
const openDeleteModal = (competence) => {
    setSelectedCompetence(competence);
    setIsDeleteModalOpen(true);
};

// Filtrer les compétences en fonction de la recherche
const filteredCompetences = competences.filter(comp =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.categorie.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchQuery.toLowerCase()) 
    // comp.niveau.toLowerCase().includes(searchQuery.toLowerCase())
);

    
    return (
        <React.Fragment>

              <ToastContainer />
      
                    {/* Modal pour ajouter une Competence */}
{/* Modal pour ajouter une compétence */}
<Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && !selectedCompetence} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Ajouter une compétence</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={save}>
            <div className="form-group">
                <label htmlFor="nameCompetence">Nom de la compétence</label>
                <input 
                    type="text" 
                    id="nameCompetence" 
                    className="form-control" 
                    placeholder="Nom de la compétence" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="descriptionCompetence">Description</label>
                <textarea 
                    id="descriptionCompetence" 
                    className="form-control" 
                    placeholder="Décrivez brièvement la compétence" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                ></textarea>
            </div>

            <div className="form-group">
                <label htmlFor="niveauCompetence">Niveau</label>
                <input 
                    type="number" 
                    id="niveauCompetence" 
                    className="form-control" 
                    placeholder="Entrez le niveau (ex : 1 à 10)" 
                    value={niveau} 
                    onChange={(e) => setNiveau(e.target.value)} 
                    min="1" 
                    max="10" 
                    required 
                />
            </div>

            <label htmlFor="fileInput">Image(logo)</label>

{image ? (
<div className="form-group d-flex align-items-center justify-content-center">
<label htmlFor="fileInput" className="file-input-label image-selected">
<img 
    src={image instanceof File ? URL.createObjectURL(image) : `${import.meta.env.VITE_API_BASE_URL}/${image}`} 
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

<small>PNG, JPG, GIF up to 10MB</small>
<input 
    type="file" 
    id="fileInput" 
    className="form-control-file" 
    onChange={(e) => setImage(e.target.files[0])} 
/>
</label>
</div>
)}

<div className="form-group">
                <label htmlFor="categorieCompetence">Categorie de la compétence</label>
                <input 
                    type="text" 
                    id="categorieCompetence" 
                    className="form-control" 
                    placeholder="categorie de la compétence" 
                    value={categorie} 
                    onChange={(e) => setCategorie(e.target.value)} 
                    required 
                />
            </div>

            <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                    <i className="fas fa-plus"></i> Ajouter
                </button>
                <button 
                    className="btn btn-secondary" 
                    type="button" 
                    onClick={() => resetForm()}
                >
                    <i className="fas fa-times"></i> Annuler
                </button>
            </div>
        </form>
    </div>
</Modal>

{/* Modal pour modifier une compétence */}
<Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && selectedCompetence} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Modifier la compétence</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={update}>
            <div className="form-group">
                <label htmlFor="nameCompetence">Nom de la compétence</label>
                <input 
                    type="text" 
                    id="nameCompetence" 
                    className="form-control" 
                    placeholder="Nom de la compétence" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="descriptionCompetence">Description</label>
                <textarea 
                    id="descriptionCompetence" 
                    className="form-control" 
                    placeholder="Décrivez brièvement la compétence" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                ></textarea>
            </div>

            <div className="form-group">
                <label htmlFor="niveauCompetence">Niveau</label>
                <input 
                    type="number" 
                    id="niveauCompetence" 
                    className="form-control" 
                    placeholder="Entrez le niveau (ex : 1 à 10)" 
                    value={niveau} 
                    onChange={(e) => setNiveau(e.target.value)} 
                    min="1" 
                    max="10" 
                    required 
                />
            </div>

            <label htmlFor="fileInput">Image(logo)</label>

{image ? (
<div className="form-group d-flex align-items-center justify-content-center">
<label htmlFor="fileInput" className="file-input-label image-selected">
<img 
    src={image instanceof File ? URL.createObjectURL(image) : `${import.meta.env.VITE_API_BASE_URL}/${image}`} 
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

<small>PNG, JPG, GIF up to 10MB</small>
<input 
    type="file" 
    id="fileInput" 
    className="form-control-file" 
    onChange={(e) => setImage(e.target.files[0])} 
/>
</label>
</div>
)}

<div className="form-group">
                <label htmlFor="nameCompetence">Categorie de la compétence</label>
                <input 
                    type="text" 
                    id="nameCompetence" 
                    className="form-control" 
                    placeholder="categorie de la compétence" 
                    value={categorie} 
                    onChange={(e) => setCategorie(e.target.value)} 
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
                    onClick={() => resetForm()}
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
        <p>Voulez-vous supprimer la Competence {selectedCompetence?.name} ?</p>
        <div className="modal-footer justify-content-center">
            <button className="btn btn-danger" onClick={() => deleteCompetence(selectedCompetence?.id)}>
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
            <h2>Liste des compétences</h2>
          </div>

          <div className="header-bar">
            {/* Bouton pour ajouter une compétence */}
            <button className="btn-create me-2" onClick={handleAddClick}>
              <i className="fas fa-plus"></i> <span className="btn-label">Nouvelle compétence</span>
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
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Image
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      name
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Description
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Niveau
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Categorie
                    </th>
                    <th className="text-secondary opacity-7">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCompetences.length > 0 ? (
                    filteredCompetences.map((competence) => (
                      <tr key={competence.id}>
                        <td>
                          <img
                            src={competence.image}
                            className="avatar avatar-sm me-3 fixed-image"
                            alt={competence.name}
                          />
                        </td>
                        <td>
                          <p className="text-xs font-weight-bold mb-0">{competence.name}</p>
                        </td>
                        <td>
                          <p className="text-xs font-weight-bold mb-0">{competence.description}</p>
                        </td>
                        <td>
                          <p className="text-xs font-weight-bold mb-0">{competence.niveau}</p>
                        </td>
                        <td>
                          <p className="text-xs font-weight-bold mb-0">{competence.categorie}</p>
                        </td>
                        <td className="align-middle">
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => handleEditClick(competence)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => openDeleteModal(competence)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        Aucun résultat trouvé
                      </td>
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

export default Competence;
