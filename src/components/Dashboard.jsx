import React, { useEffect, useState, useRef } from "react";
import axios from "axios"; // Assurez-vous que axios est installé
import { useNavigate } from 'react-router-dom'; // Importer useNavigate pour gérer la navigation
import { Chart, registerables } from 'chart.js'; 
import axiosClient from "../axiosClient";
import TransactionsCard from './TransactionsCard';
import Dash from './Dash';
// Enregistrement des éléments de Chart.js
Chart.register(...registerables);

const Dashboard = ({ user }) => {
    const navigate = useNavigate(); // Initialiser useNavigate
    const chartRef = useRef(null); // Référence pour le graphique

    const [totalStudents, setTotalStudents] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);
    const [totalUnpaid, setTotalUnpaid] = useState(0);
    const [loading, setLoading] = useState(true); // État de chargement
    const [currentDate, setCurrentDate] = useState(""); // État pour la date actuelle
    const [totalDue, setTotalDue] = useState(0); // Montant total dû
    const [paidPercentage, setPaidPercentage] = useState(0);
    const [unpaidPercentage, setUnpaidPercentage] = useState(0);
    

    return (
     <>
     <Dash  />
     <TransactionsCard  /></>
    );
};

export default Dashboard;
