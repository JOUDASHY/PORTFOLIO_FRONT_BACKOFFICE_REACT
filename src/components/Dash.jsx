import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosClient from '../axiosClient';
import { NavLink, useNavigate } from 'react-router-dom';


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dash = () => {
  const [totalProjects, setTotalProjects] = useState(0);
  const [competences, setCompetences] = useState([]);
  const [data, setData] = useState([]);
  const [visitData, setVisitData] = useState({ months: [], counts: [] });
  const [totalVisits, setTotalVisits] = useState(null);
  

  // Fonction pour récupérer les statistiques de visites
  const fetchVisitStats = async () => {
    try {
      const response = await axiosClient.get('/monthly-visit-stats/');
      const data = response.data;

      console.log('Data from API:', data);

      const months = data.map(item => item.month);
      const counts = data.map(item => item.count);

      // Inverser les mois et les comptes pour afficher du plus ancien au plus récent
      setVisitData({ months, counts });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  // Charger les statistiques de visites lors du montage du composant
  useEffect(() => {
    fetchVisitStats();totalVisits
  }, []);

  // Inverser les mois et les comptes pour les afficher du plus ancien au plus récent
  const chartData = visitData.months
    .map((month, index) => ({
      month,
      count: visitData.counts[index]
    }))
    .reverse(); // Inverser l'ordre des données avant de les passer à Recharts



  useEffect(() => {
    // Appel API pour récupérer le nombre total de visites
    axiosClient.get('/total-visits/')
      .then(response => {
        // Met à jour l'état avec le total des visites récupéré
        setTotalVisits(response.data.total_visits);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du total des visites', error);
      });
  }, []);

  useEffect(() => {
    const fetchVisitStats = async () => {
      try {
        const response = await axiosClient.get('/monthly-visit-stats/');
        console.log('Data from API:', response.data); // Vérifie que les données sont reçues

        const data = response.data;
        const months = data.map(item => item.month);
        const counts = data.map(item => item.count);

        setVisitData({ months, counts });

        // Si un graphique existe déjà, le détruire avant d'en créer un nouveau
        if (window.chart) {
          window.chart.destroy();
        }

        // Créer un nouveau graphique avec les nouvelles données
        renderChart(months, counts);

      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
      }
    };

    fetchVisitStats();
  }, []);

;
  useEffect(() => {
    axiosClient.get('awards/')
      .then(response => {
        setData(response.data);
      
      })
      .catch(error => {
        console.error("Il y a une erreur:", error);
      });
  }, []);
  useEffect(() => {
    // Appel API pour récupérer les données des compétences
    axiosClient.get('competences/')
      .then(response => {
        // Limite les compétences à 6 éléments
        const firstSixCompetences = response.data.slice(0, 5);
        setCompetences(firstSixCompetences);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des compétences', error);
      });
  }, []);
  
  useEffect(() => {
    // Charger les projets
    const fetchProjects = async () => {
      try {
        const response = await axiosClient.get('projets/');
        const projects = response.data;
        setTotalProjects(projects.length); // Mettre à jour le nombre total de projets
      } catch (error) {
        console.error('Erreur lors de la récupération des projets :', error);
      }
    };

    fetchProjects();
  }, []);
  return (
    <div className="row">
      {/* Card 1 */}
      <div className="col-md-6 col-xxl-3">
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
              <div className="avtar avtar-s bg-light-primary">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M13 9H7"
                    stroke="#4680FF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.0002 10.9702V13.0302C22.0002 13.5802 21.5602 14.0302 21.0002 14.0502H19.0402C17.9602 14.0502 16.9702 13.2602 16.8802 12.1802C16.8202 11.5502 17.0602 10.9602 17.4802 10.5502C17.8502 10.1702 18.3602 9.9502 18.9202 9.9502H21.0002C21.5602 9.9702 22.0002 10.4202 22.0002 10.9702Z"
                    stroke="#4680FF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V15.5C21 18.5 19 20.5 16 20.5H7C4 20.5 2 18.5 2 15.5V8.5C2 5.78 3.64 3.88 6.19 3.56C6.45 3.52 6.72 3.5 7 3.5H16C16.26 3.5 16.51 3.50999 16.75 3.54999C19.33 3.84999 21 5.76 21 8.5V9.95001H18.92C18.36 9.95001 17.85 10.17 17.48 10.55Z"
                    stroke="#4680FF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-grow-1 ms-3">
              <h6 className="mb-0">Nombre total de projets</h6>
            </div>
          </div>
          <div className="bg-body p-3 mt-3 rounded">
            <div className="mt-3 row align-items-center">
              <div className="col-7">
                <div id="all-earnings-graph"></div>
              </div>
              <div className="col-5">
                <h5 className="mb-1">{totalProjects}</h5> {/* Affichage du total */}
                <p className="text-primary mb-0">
                  <i className="ti ti-arrow-up-right"></i> Projets 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Card 2 */}
      <div className="col-md-6 col-xxl-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avtar avtar-s bg-light-warning">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z"
                      stroke="#E58A00"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      opacity="0.6"
                      d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5"
                      stroke="#E58A00"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      opacity="0.6"
                      d="M8 13H12"
                      stroke="#E58A00"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      opacity="0.6"
                      d="M8 17H16"
                      stroke="#E58A00"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h6 className="mb-0">Compétences</h6>
              </div>
            </div>
            <div className="bg-body p-3 mt-3 rounded">
              <div className="mt-3 row align-items-center">
                <div className="col-7">
                  <div id="page-views-graph"></div>
                </div>
                <div className="col-5">
                  <h5 className="mb-1">{competences.length} </h5>
                  <p className="text-warning mb-0">
                    <i className="ti ti-arrow-up-right"></i> Comp..
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 1 */}
      <div className="col-md-6 col-xxl-3">
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
              <div className="avatar bg-light-success">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 2V5"
                    stroke="#2ca87f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 2V5"
                    stroke="#2ca87f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    opacity="0.4"
                    d="M3.5 9.08984H20.5"
                    stroke="#2ca87f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                    stroke="#2ca87f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-grow-1 ms-3">
              <h6>Diplomes et Certificats</h6>
            </div>
          </div>
          <div className="bg-body p-3 mt-3 rounded">
            <div className="row align-items-center">
              <div className="col-7">
                <div id="total-task-graph"></div>
              </div>
              <div className="col-5">
                <h5>{data.length}</h5> {/* Affiche le nombre total */}
                <p className="text-success">New</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-6 col-xxl-3">
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
              <div className="avatar bg-light-warning">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#DC2626"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    opacity="0.4"
                    d="M8.4707 10.7402L12.0007 14.2602L15.5307 10.7402"
                    stroke="#DC2626"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-grow-1 ms-3">
              <h6>Total Visits</h6>
            </div>
          </div>
          <div className="bg-body p-3 mt-3 rounded">
            <div className="row align-items-center">
              <div className="col-7">
                <div id="download-graph"></div>
              </div>
              <div className="col-5">
                <h5>{totalVisits !== null ? totalVisits : 'Loading...'}</h5>
                <p className="text-danger">30.6%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 
    <div className="col-lg-9">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Monthly Visitors</h5>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10 }}  // Réduction de la taille du texte sur l'axe X
              />
              <YAxis 
                tick={{ fontSize: 10 }}  // Réduction de la taille du texte sur l'axe Y
              />
              <Tooltip 
                contentStyle={{ fontSize: '12px' }}  // Réduction de la taille du texte dans le tooltip
              />
              <Legend 
                wrapperStyle={{ fontSize: 12 }}  // Réduction de la taille du texte dans la légende
              />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

      <div className="col-lg-3">
  <div className="card">
    <div className="card-header">
      <h5 className="mb-0">Mes compétences</h5>
    </div>
    <div className="card-body">
      {competences.map((competence) => (
        <div className="mb-4" key={competence.id}>
          <div className="d-flex align-items-center mb-2">
            {competence.image ? (
              <img
                src={competence.image}
                alt={competence.name}
                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                className="me-2"
              />
            ) : (
              <div style={{ width: '30px', height: '30px' }} className="bg-light-primary me-2 rounded-circle"></div>
            )}
            <p className="mb-0 flex-grow-1">{competence.name}</p>
            <span>{competence.niveau * 10}%</span>
          </div>
          <div className="progress progress-primary" style={{ height: '8px' }}>
            <div
              className="progress-bar"
              style={{ width: `${competence.niveau * 10}%` }}
            ></div>
          </div>
        </div>
      ))}

      <div className="d-grid mt-3">
      <NavLink 
  to="/competence" 
  className="btn btn-primary d-flex align-items-center justify-content-center"
>
  <i className="ti ti-eye"></i> View all
</NavLink>


      </div>
    </div>
  </div>
</div>


      {/* Add additional cards here similarly */}
    </div>
  );
};

export default Dash;
