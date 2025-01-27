import axios from 'axios';
import { useEffect, useState } from "react";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import axiosClient from '../axiosClient';

Modal.setAppElement('#root');

function Projet() {
 
// États pour les champs de l'éducation

const [nom, setNom] = useState(''); // nom de l'éducation

const [date_fin, setDate_fin] = useState('');
const [description, setDescription] = useState('');
const [type, setType] = useState('');
const [techno, setTechno] = useState('');
// États pour la gestion de la sélection
const [id, setId] = useState(null); // ID de l'éducation à modifier
const [selectedProjet, setSelectedProjet] = useState(null); // Éducation sélectionnée pour modification

// États pour la gestion de la modale
const [isModalOpen, setIsModalOpen] = useState(false); // Indique si la modale est ouverte

    const [Projet, setProjet] = useState([]);
  
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Nouvel état pour la barre de recherche
    
    const [selectedImage, setSelectedImage] = useState(null);
    const [projetId, setProjetId] = useState(null);
  
    useEffect(() => {
      (async () => await Load())();
  }, []);

  async function Load() {
      const result = await axiosClient.get("/projets/");
      setProjet(result.data);
      
  }
    // Fonction pour gérer le changement de fichier
    const handleImageChange = (e, projetId) => {
      setSelectedImage(e.target.files[0]);
      setProjetId(projetId);
    };
  
    // Fonction pour uploader l'image
    const handleImageUpload = async (projetId) => {
      if (!selectedImage) {
        alert('Veuillez sélectionner une image');
        return;
      }
  
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('projet', projetId);
  
      try {
        await axiosClient.post('/images/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast('Image ajoutée avec succès');
        // Réinitialiser le fichier après l'upload
        setSelectedImage(null);
        setProjetId(null);
        Load();
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'image:', error);
        toast('Erreur lors de l\'ajout de l\'image');
      }
    };





    const handleClose = () => {
        setNotification(null);
    };

    const handleEditClick = (Projet) => {
        setSelectedProjet(Projet);
        setIsModalOpen(true);
        editeProjet(Projet);
    };
    
    async function editeProjet(Projet) {
        setNom(Projet.nom); // Met à jour la date de début
        setDate_fin(Projet.date_fin);     // Met à jour la date de fin
        setDescription(Projet.description); // Met à jour le nom de l'description
               // Met à jour le type (stage ou professionnel)
        setTechno(Projet.techno);             // Met à jour le rôle
        setId(Projet.id);                 // Met à jour l'ID de l'expérience
        // setImage(Projet.image);           // Met à jour l'image, si disponible
    }
    


    async function save(event) {
        event.preventDefault();
        try {
            // FormData pour envoi multipart/form-data
            const formData = new FormData();
            formData.append('nom', nom); // Nouvelle variable pour la date de début
            // Nouvelle variable pour la date de fin
            formData.append('description', description); // Nouvelle variable pour l'description
          
            formData.append('techno', techno); // Nouvelle variable pour le rôle
            
            // Si vous avez une image (facultatif)
            // if (image) formData.append('image', image);
    
            // Envoi de la requête POST pour créer une nouvelle expérience
            await axiosClient.post('/projets/', formData, {
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
            formData.append('nom', nom); // Nouvelle variable pour la date de début

            formData.append('description', description); // Nouvelle variable pour l'description
      
            formData.append('techno', techno); // Nouvelle variable pour le rôle
    
            // Si vous avez une image (facultatif)
            // if (image instanceof File) {
            //     formData.append('image', image);
            // }
    
            // Envoi de la requête PUT pour mettre à jour l'expérience existante
            await axiosClient.put(`/projets/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            resetForm();
            toast.success('Expérience mise à jour avec succès');
        } catch (err) {
            console.error(err); // Débogage
            toast.error('Échec de la mise à jour de l\'expérience');
        }
    }
    
    
    

    async function DeleteProjet(id) {
        await axiosClient.delete(`/projets/${id}/`);
        resetForm();
        toast.success('Projet supprimée avec succès');
    }

    const resetForm = () => {
        setNom('');           // Réinitialise la date de début
          
        setDescription('');          // Réinitialise le nom de l'description
                
        setTechno('');                // Réinitialise le rôle
                // Réinitialise l'image (si applicable)
        setId(null);                // Réinitialise l'ID de l'expérience
        setSelectedProjet(null); // Réinitialise l'expérience sélectionnée
        Load();                     // Recharge les données ou effectue toute action nécessaire
        setIsModalOpen(false);      // Ferme le modal
        setIsDeleteModalOpen(false); // Ferme le modal de suppression
    };
    

    const openDeleteModal = (Projet) => {
        setSelectedProjet(Projet);
        setIsDeleteModalOpen(true); 
    };

    const handleAddClick = () => {
        resetForm(); // Réinitialiser le formulaire avant d'ouvrir le modal d'ajout
        setIsModalOpen(true);
    };

    // Filtrer les Projet en fonction de la recherche
    const filteredProjet = Projet.filter(exp =>
        exp.description.toLowerCase().includes(searchQuery.toLowerCase()) || // Recherche par description
        exp.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||      // Recherche par type (stage ou professionnel)
        exp.techno.toLowerCase().includes(searchQuery.toLowerCase())     // Recherche par rôle
    
    );
    
    
    return (
        <React.Fragment>

              <ToastContainer />
      
                    {/* Modal pour ajouter une Projet */}
                    <Modal 
    overlayClassName="modal-overlay" 
    className="customModal" 
    isOpen={isModalOpen && !selectedProjet} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Ajouter une expérience</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={save}>
          
          
            <div className="form-group">
                <label htmlFor="nom">nom</label>
                <input 
                    type="text" placeholder='nom'
                    id="nom" 
                    className="form-control" 
                    value={nom} 
                    onChange={(e) => setNom(e.target.value)} 
                    required 
                />
            </div>
          
            <div className="form-group">
                <label htmlFor="description">description </label>
                <input 
                    type="text" 
                    id="description" 
                    className="form-control" 
                    placeholder="Nom " 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label htmlFor="techno">techno</label>
                <input 
                    type="text" 
                    id="techno" 
                    className="form-control" 
                    placeholder="Rôle" 
                    value={techno} 
                    onChange={(e) => setTechno(e.target.value)} 
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
    isOpen={isModalOpen && selectedProjet} 
    onRequestClose={() => setIsModalOpen(false)}
>
    <div className="modal-header">
        <h4 className="modal-title">Modifier l'expérience</h4>
    </div>
    <div className="modal-body">
        <form onSubmit={update}>

        <div className="form-group">
                <label htmlFor="nom">nom</label>
                <input 
                    type="text" placeholder='nom'
                    id="nom" 
                    className="form-control" 
                    value={nom} 
                    onChange={(e) => setNom(e.target.value)} 
                    required 
                />
            </div>
            <div className="form-group">
                <label htmlFor="description">description</label>
                <input 
                    type="text" 
                    id="description" 
                    className="form-control" 
                    placeholder="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                />
          
          
            
          
            </div>

            <div className="form-group">
                <label htmlFor="techno">techno</label>
                <input 
                    type="text" 
                    id="techno" 
                    className="form-control" 
                    placeholder="Rôle" 
                    value={techno} 
                    onChange={(e) => setTechno(e.target.value)} 
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
        <p>Voulez-vous supprimer l'Projet {selectedProjet?.name} ?</p>
        <div className="modal-footer justify-content-center">
            <button className="btn btn-danger" onClick={() => DeleteProjet(selectedProjet?.id)}>
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
      <h2>Liste des Projets</h2>
      </div>
      
      <div className="header-bar">
  {/* Bouton pour ajouter une Projet */}
  <button className="btn-create" onClick={handleAddClick}>
    <i className="fas fa-plus"></i> <span className="btn-label">Nouvel Projet</span>
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
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nom</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Description</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Techno</th>
      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Galerie</th>
      <th className="text-secondary opacity-7">Action</th>
    </tr>
  </thead>

  <tbody>
  {filteredProjet.length > 0 ? (
    filteredProjet.map((Projet) => (
      <tr key={Projet.id}>
        {/* Nom du projet */}
        <td>
          <p className="text-xs font-weight-bold mb-0">
            {Projet.nom || 'Nom non défini'}
          </p>
        </td>

        {/* Description du projet */}
        <td style={{ maxWidth: '200px', padding: '0' }}>
  <div
    style={{
      whiteSpace: 'nowrap',        // Pour ne pas laisser le texte aller à la ligne
      overflow: 'hidden',          // Cache le texte qui déborde
      textOverflow: 'ellipsis',    // Affiche "..." si le texte dépasse
      display: 'block',            // Assure que le div occupe l'espace complet du td
      width: '100%'                // Assure que le div ne dépasse pas de la cellule
    }}
  >
    <p className="text-xs font-weight-bold mb-0">
      {Projet.description || 'Description non définie'}
    </p>
  </div>
</td>


        {/* Technologies utilisées */}
        <td>
          <p className="text-xs font-weight-bold mb-0">
            {Projet.techno || 'Techno non définie'}
          </p>
        </td>

        {/* Galerie d'images */}
        <td>
          <div className="d-flex flex-wrap">
            {Projet.related_images && Projet.related_images.length > 0 ? (
              Projet.related_images.map((imageObj, index) => (
                <img
                  key={imageObj.id}
                  src={imageObj.image}
                  alt={`Image ${index + 1}`}
                  className="img-fluid rounded-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    marginRight: '10px',
                    objectFit: 'cover',
                  }}
                />
              ))
            ) : (
              <p className="text-xs text-muted">Aucune image</p>
            )}
          </div>

          {/* Formulaire pour ajouter une nouvelle image */}
          <div className="mt-3 d-flex align-items-center">
          <i
  className="fas fa-images text-primary position-relative"
  style={{
    fontSize: '15px',
    cursor: 'pointer',
    border: '1px solid #007bff',
    borderRadius: '50%',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    position: 'relative', // Important pour positionner le "+"
  }}
  onClick={() => document.getElementById(`fileInput-${Projet.id}`).click()}
  title="Ajouter une image"
>
  {/* Symbole "+" */}
  <span
    style={{
      position: 'absolute',
      top: '2px',
      right: '13px',
      // background: '#007bff',
      color: '#00000',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 3px rgba(0, 0, 0, 0.3)',
    }}
  >
    +
  </span>
</i>


            <input
              id={`fileInput-${Projet.id}`}
              type="file"
              className="d-none"
              onChange={(e) => handleImageChange(e, Projet.id)}
            />
            <button
              className="btn btn-primary btn-sm ms-2"
              onClick={() => handleImageUpload(Projet.id)}
              disabled={!selectedImage || projetId !== Projet.id}
            >
              Ajouter
            </button>
          </div>
        </td>

        {/* Moyenne des scores */}
        <td>
          <div className="d-flex flex-column align-items-center">
            {Projet.average_score !== null ? (
              <>
                <p
                  className="badge bg-primary text-white"
                  style={{
                    fontSize: '14px',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    marginBottom: '5px',
                  }}
                >
                  {Projet.average_score}/5
                </p>
                <div className="text-warning">
                  {Array.from({ length: 5 }, (_, index) => (
                    <i
                      key={index}
                      className={`fas fa-star ${index < Projet.average_score ? '' : 'text-muted'}`}
                    ></i>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted">Pas encore noté</p>
            )}
          </div>
        </td>

        {/* Actions d'édition et de suppression */}
        <td className="align-middle">
          <button
            className="btn btn-primary me-2"
            onClick={() => handleEditClick(Projet)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-danger"
            onClick={() => openDeleteModal(Projet)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center">
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

export default Projet;
