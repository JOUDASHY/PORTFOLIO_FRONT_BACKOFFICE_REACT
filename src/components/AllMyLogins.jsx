import React from "react";
import { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import axiosClient from '../axiosClient';

Modal.setAppElement('#root');

function AllMyLogins() {
    const [logins, setLogins] = useState([]);
    const [site, setSite] = useState('');
    const [link, setLink] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [id, setId] = useState(null);
    const [selectedLogin, setSelectedLogin] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadLogins();
    }, []);

    async function loadLogins() {
        try {
            const result = await axiosClient.get("/all_my_logins/");
            setLogins(result.data);
        } catch (error) {
            toast.error("Erreur lors du chargement des logins");
        }
    }

    const resetForm = () => {
        setSite('');
        setLink('');
        setUsername('');
        setPassword('');
        setId(null);
        setSelectedLogin(null);
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    async function save(event) {
        event.preventDefault();
        try {
            await axiosClient.post('/all_my_logins/', {
                site, link, username, password
            });
            toast.success("Login ajouté avec succès");
            resetForm();
            loadLogins();
        } catch (err) {
            toast.error("Échec de l'ajout du login");
        }
    }

    async function update(event) {
        event.preventDefault();
        try {
            await axiosClient.put(`/all_my_logins/${id}/`, {
                site, link, username, password
            });
            toast.success("Login mis à jour avec succès");
            resetForm();
            loadLogins();
        } catch (err) {
            toast.error("Échec de la mise à jour du login");
        }
    }

    async function deleteLogin(id) {
        try {
            await axiosClient.delete(`/all_my_logins/${id}/`);
            toast.success("Login supprimé avec succès");
            resetForm();
            loadLogins();
        } catch (err) {
            toast.error("Échec de la suppression du login");
        }
    }

    const handleEditClick = (login) => {
        setSelectedLogin(login);
        setId(login.id);
        setSite(login.site);
        setLink(login.link);
        setUsername(login.username);
        setPassword(login.password);
        setIsModalOpen(true);
    };

    const openDeleteModal = (login) => {
        setSelectedLogin(login);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedLogin) {
            deleteLogin(selectedLogin.id);
        }
    };

    const handleLoginClick = (login) => {
        // Copy username and password to clipboard
        const credentials = `Username: ${login.username}\nPassword: ${login.password}`;
        navigator.clipboard.writeText(credentials)
            .then(() => {
                toast.success("Identifiants copiés dans le presse-papiers ! Collez-les dans le formulaire de connexion.");
                // Redirect to the website
                window.open(login.link, '_blank', 'noopener,noreferrer');
            })
            .catch(() => {
                toast.error("Échec de la copie des identifiants.");
            });
    };

    const filteredLogins = logins.filter(login =>
        login.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
        login.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <React.Fragment>
            <ToastContainer />

            {/* Modal de confirmation de suppression */}
            <Modal 
                overlayClassName="modal-overlay" 
                className="customModal" 
                isOpen={isDeleteModalOpen} 
                onRequestClose={() => setIsDeleteModalOpen(false)}
            >
                <div className="modal-header">
                    <h4 className="modal-title">
                        <i className="fas fa-trash"></i> Confirmer la suppression
                    </h4>
                </div>
                <div className="modal-body">
                    <p>Êtes-vous sûr de vouloir supprimer les identifiants pour {selectedLogin?.site} ?</p>
                    <div className="modal-footer">
                        <button className="btn-jaune" onClick={handleDeleteConfirm}>
                            <i className="fas fa-trash"></i> Supprimer
                        </button>
                        <button className="btn-blue" onClick={() => setIsDeleteModalOpen(false)}>
                            <i className="fas fa-times"></i> Annuler
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal d'ajout/modification */}
            <Modal 
                overlayClassName="modal-overlay" 
                className="customModal" 
                isOpen={isModalOpen} 
                onRequestClose={() => setIsModalOpen(false)}
            >
                <div className="modal-header">
                    <h4 className="modal-title">
                        {selectedLogin ? "Modifier le login" : "Ajouter un login"}
                    </h4>
                </div>
                <div className="modal-body">
                    <form onSubmit={selectedLogin ? update : save}>
                        <div className="form-group">
                            <label>Site</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={site} 
                                onChange={(e) => setSite(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Lien</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={link} 
                                onChange={(e) => setLink(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Nom d'utilisateur</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Mot de passe</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn-blue">
                                <i className="fas fa-save"></i> {selectedLogin ? "Modifier" : "Ajouter"}
                            </button>
                            <button className="btn-jaune" type="button" onClick={resetForm}>
                                <i className="fas fa-times"></i> Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Section principale */}
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">
                        <div className="card-header pb-0">
                            <h2>Mes identifiants</h2>
                            <div className="header-bar">
                                <button className="btn-create" onClick={() => setIsModalOpen(true)}>
                                    <i className="fas fa-plus"></i> Nouveau login
                                </button>
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                    <button className="search-btn">
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body px-0 pt-0 pb-2">
                            <div className="table-responsive p-0">
                                <table className="table align-items-center mb-0">
                                    <thead>
                                        <tr>
                                            <th>Site</th>
                                            <th>Lien</th>
                                            <th>Nom d'utilisateur</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLogins.map(login => (
                                            <tr key={login.id}>
                                                <td>{login.site}</td>
                                                <td>
                                                    <a href={login.link} target="_blank" rel="noopener noreferrer">
                                                        {login.link}
                                                    </a>
                                                </td>
                                                <td>{login.username}</td>
                                                <td>
                                                    <button 
                                                        className="btn-blue me-2" 
                                                        onClick={() => handleEditClick(login)}
                                                        aria-label={`Modifier le login pour ${login.site}`}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button 
                                                        className="btn-jaune me-2" 
                                                        onClick={() => openDeleteModal(login)}
                                                        aria-label={`Supprimer le login pour ${login.site}`}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                    <button 
                                                        className="btn-blue" 
                                                        onClick={() => handleLoginClick(login)}
                                                        aria-label={`Se connecter à ${login.site}`}
                                                    >
                                                        <i className="fas fa-sign-in-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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

export default AllMyLogins;