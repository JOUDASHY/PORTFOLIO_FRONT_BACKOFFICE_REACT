import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import logo from '../assets/img/logo_unit.png'; // Importez votre logo
import { Link } from "react-router-dom";
import { ClipLoader } from 'react-spinners';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // État pour le spinner

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Réinitialiser les erreurs et afficher le spinner
        setError('');
        setLoading(true);
    
        try {
            // Envoyer l'email au backend
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/password-reset/`, 
                { email }
            );
    
            // Afficher un toast de succès
            toast.success(response.data.message || 'Email de réinitialisation envoyé avec succès.');
        } catch (err) {
            // Gestion des erreurs avec un message utilisateur clair
            const errorMessage = err.response?.data?.message || 'Une erreur est survenue, veuillez réessayer.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            // Cacher le spinner
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-img">
            <ToastContainer />
            <div className="content">
                {/* <img src={logo} alt="UNIT Logo" className="logo" /> */}
                <header>Mot de passe oublié</header>
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <span className="fa fa-user"></span>
                        <input
                            type="email"
                            placeholder="Email ou Téléphone"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <br />
                    <div className="field">
                        {loading ? (
                            <ClipLoader color="#36d7b7" size={35} /> // Spinner ici
                        ) : (
                            <input type="submit" value="ENVOYER" />
                        )}
                    </div>
                </form>
                <div className="signup">
                    Vous avez un compte ? <Link to='/login'>Connectez-vous maintenant</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
