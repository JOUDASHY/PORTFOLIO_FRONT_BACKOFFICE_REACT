import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosClient from '../axiosClient';

const Historic_mail = () => {
  const [historicMails, setHistoricMails] = useState([]);

  useEffect(() => {
    const fetchHistoricMails = async () => {
      try {
        const response = await axiosClient.get("/historic-mails/");
        setHistoricMails(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des emails :", error);
      }
    };

    fetchHistoricMails();
  }, []);

  return (
<div class="container mt-5">
  <h1 class="text-center mb-4 text-primary">Historique des Emails Envoyés</h1>
  <div class="list-group">
    {historicMails.map((mail) => (
      <div key={mail.id} class="list-group-item list-group-item-action border rounded shadow-sm mb-3">
      <p 
  className="mb-0" 
  style={{ lineHeight: "1.5" }}
>
  <i className="bi bi-envelope-fill me-2 text-primary"></i>
  L'email <strong>{mail.email_entreprise}</strong>, destiné à l'entreprise 
  <strong className="text-success"> {mail.nom_entreprise}</strong>, 
  située à <strong>{mail.lieu_entreprise}</strong>, a été envoyé avec succès le 
  <strong>{mail.date_envoi}</strong> à <strong>{mail.heure_envoi}</strong>.
</p>

      </div>
    ))}
  </div>
</div>


  );
};

export default Historic_mail;
