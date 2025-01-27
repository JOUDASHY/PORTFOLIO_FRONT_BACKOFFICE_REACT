
// import './Cv.css'; // On suppose que le CSS est dans un fichier séparé appelé Cv.css
import '../assets/css/Cv.css';
import axiosClient from '../axiosClient';
import React, { useState, useEffect } from 'react';
const Cv = () => {
  const [profile, setProfile] = useState(null);
  const [langues, setLangues] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projets, setProjets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, languesData, experiencesData, projetsData] = await Promise.all([
          axiosClient.get('/NilsenProfile/'),
          axiosClient.get('/langues/'),
          axiosClient.get('/experience/'),
          axiosClient.get('/projets/'),
        ]);

        setProfile(profileData.data);
        setLangues(languesData.data);
        setExperiences(experiencesData.data);
        setProjets(projetsData.data);

        console.log("Données chargées :", {
          profile: profileData.data,
          langues: languesData.data,
          experiences: experiencesData.data,
          projets: projetsData.data,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  if (!profile) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container-cv">
      {/* Left Column */}
      <div className="left-column">
      {/* Affichage dynamique des informations */}
      <img 
      // src={profile.image}
      src={
        profile?.image
          ? `${import.meta.env.VITE_API_BASE_URL}${profile?.image }`
          : user_pr
      }
      alt="Profile Picture" />
      <h2>{profile.username}</h2>
      <h2>{new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()} ans</h2>

      <div className="about">
        <h3 className="section-title">À PROPOS</h3>
        <p>{profile.about}</p>
      </div>

      <div className="contact-info">
        <h3 className="section-title">Contact</h3>
        <p>
          <i className="fas fa-phone"></i> {profile.phone_number}
        </p>
        <p>
          <i className="fas fa-envelope"></i> {profile.email}
        </p>
        <p>
          <i className="fas fa-map-marker-alt"></i> {profile.address}
        </p>
      </div>

      <div className="languages">
      <h3 className="section-title">Langues</h3>
      {langues.map((langue, index) => (
        <p key={index}>{langue.titre.charAt(0).toUpperCase() + langue.titre.slice(1)}</p>
      ))}
    </div>

      <div className="interests">
        <h3 className="section-title">Centres d'intérêt</h3>
        <p>
          <i className="fas fa-swimmer"></i> Natation
        </p>
        <p>
          <i className="fas fa-basketball-ball"></i> Basketball
        </p>
        <p>
          <i className="fas fa-paint-brush"></i> Dessin
        </p>
      </div>


    </div>

      {/* Right Column */}
      <div className="right-column">
      <div className="section">
      <h3>
        <i className="fas fa-briefcase"></i> Expériences Professionnelles
      </h3>
      <ul className="star-list">
        {experiences.map((experience, index) => (
          <li key={index}>
            <span className="bold">{experience.entreprise}</span> | En tant que {experience.type} ({experience.date_debut} – {experience.date_fin})
          </li>
        ))}
      </ul>
    </div>

        <div className="section">
          <h3>
            <i className="fas fa-graduation-cap"></i> Formations
          </h3>
          <ul className="star-list">
            <li>Troisième année / ENI Fianarantsoa - 2023–2024</li>
            <li>Cybersécurité / Orange Digital Fianarantsoa - Février 2023</li>
            <li>Cours Français / Centre Reniala Fianarantsoa - 2022–2023</li>
            <li>Maintenance et Réseau / Fyhar’soft Fianarantsoa - Décembre 2021</li>
            <li>Licence en Topographie / ISTE Fianarantsoa - 2019–2020</li>
            <li>Bacc série D / Saint Vincent de Paul Farafangana - 2016–2017</li>
          </ul>
        </div>

        <div className="section">
          <h3>
            <i className="fas fa-tools"></i> Compétences
          </h3>
          <ul className="square-list">
            <li>Administration de système Windows Serveur et Linux</li>
            <li>Langages de Programmation : JAVA, Python...</li>
            <li>Technologies Web : HTML, CSS, JS, PHP...</li>
            <li>Administration de Base de données : MySQL et PostgreSQL</li>
            <li>Déploiement en ligne : Pythonanywhere, Render, Vercel</li>
            <li>Framework : DJANGO, FLASK</li>
            <li>Système de sécurité : analyse de trafic, analyse malware, firewall...</li>
            <li>Conteneurisation : Docker</li>
          </ul>
        </div>

        <div className="section">
      <h3>
        <i className="fas fa-project-diagram"></i> Projets Réalisés
      </h3>
      <div className="projets-realises">
        <ul className="star-list">
          {projets.map((projet, index) => (
            <li key={index}>
              {projet.nom} : {projet.techno}
            </li>
          ))}
        </ul>
      </div>
    </div>
      </div>
    </div>
  );
};

export default Cv;
