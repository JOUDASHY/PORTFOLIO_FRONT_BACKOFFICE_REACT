import React, { useState } from 'react';
import axios from 'axios'; // Importez axios
import axiosClient from '../axiosClient';
import { toast, ToastContainer } from 'react-toastify'; // Importer toastify
import 'react-toastify/dist/ReactToastify.css'; // Importer les styles
import { ClipLoader } from 'react-spinners'; // Import du spinner

const SendCV = () => {
  const [loading, setLoading] = useState(false); // État pour le spinner

  const [formData, setFormData] = useState({
    nomEntreprise: '',
    emailEntreprise: '',
    lieuEntreprise: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Afficher le spinner
    
    console.log('Formulaire soumis :', formData);

    // Envoyer les données au backend via axios
    axiosClient
      .post('/mail_entreprise/', formData) // Remplacez par l'URL de votre API backend
      .then((response) => {
        console.log('Réponse de l\'API :', response.data);
        // Afficher un message de succès
        toast.success('Email envoyé avec succès !');
      })
      .catch((error) => {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        // Afficher un message d'erreur
        toast.error('Erreur lors de l\'envoi de l\'email, veuillez réessayer.');
      })
      .finally(() => {
        setLoading(false); // Masquer le spinner
      });
};

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
       <ToastContainer />
      <h2>Formulaire Entreprise</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="nomEntreprise" style={{ display: 'block', marginBottom: '5px' }}>
            Nom de l'entreprise
          </label>
          <input
            type="text"
            id="nomEntreprise"
            name="nomEntreprise"
            value={formData.nomEntreprise}
            onChange={handleChange}
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
            value={formData.emailEntreprise}
            onChange={handleChange}
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
            value={formData.lieuEntreprise}
            onChange={handleChange}
            placeholder="Entrez le lieu"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <button disabled={loading}
          type="submit"
          style={{
            backgroundColor: '#007BFF',
            color: '#fff',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
           {loading ? (
                          <ClipLoader color="#ffffff" size={20} /> // Spinner ici
                        ) : (
         <> <i className="fas fa-paper-plane me-2"></i> Soumettre</>
                        )}
        </button>
      </form>
    </div>
  );
};

export default SendCV;
