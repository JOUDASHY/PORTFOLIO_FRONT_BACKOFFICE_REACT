import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosClient from "../axiosClient";
import { NavLink, useNavigate } from 'react-router-dom';

const TransactionsCard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch the data from your API
    axiosClient.get("/projets/")
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  
    // Function to render stars based on the average score
    const renderStars = (score) => {
      const fullStars = Math.floor(score); // Number of full stars
      const emptyStars = 5 - fullStars; // Number of empty stars
      return (
        <>
          {Array(fullStars).fill("★").map((star, index) => (
            <span key={index} style={{ color: "#f68c09", fontSize: "24px" }}>{star}</span> // Augmenter la taille de police
          ))}
          {Array(emptyStars).fill("☆").map((star, index) => (
            <span key={index} style={{ color: "black", fontSize: "24px" }}>{star}</span> // Augmenter la taille de police
          ))}
        </>
      );
    };
    
  
  return (
    <>
  <div className="col-lg-9">
  <div className="card">
    <div className="card-body">
      <h5 className="mb-0">Projects and Ratings</h5>
      <ul className="list-group list-group-flush mt-3">
        {projects.map((project) => (
          <li className="list-group-item" key={project.id}>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avtar avtar-s border">
                  {project.nom.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h6 className="mb-0">{project.nom}</h6>
                <p className="text-muted mb-0">
                  <small>{project.description}</small>
                </p>
              </div>
              <div className="text-end">
                <h6 className="mb-1">Rating</h6>
                <div>{renderStars(project.average_score)}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="card-footer">
      <div className="d-grid">
       
      <NavLink to="/projet" className="btn btn-primary">
  <span className="text-truncate w-100">
  <i className="ti ti-eye"></i> View all Projects
  </span>
</NavLink>

      </div>
    </div>
  </div>
</div>

     {/* <div className="col-md-6">
     <div className="card">
       <div className="card-body">
         <div className="d-flex align-items-center justify-content-between">
           <h5 className="mb-0">Total Income</h5>
           <div className="dropdown">
             <a
               className="avtar avtar-s btn-link-secondary dropdown-toggle arrow-none"
               href="#"
               data-bs-toggle="dropdown"
               aria-haspopup="true"
               aria-expanded="false"
             >
               <i className="ti ti-dots-vertical f-18"></i>
             </a>
             <div className="dropdown-menu dropdown-menu-end">
               <a className="dropdown-item" href="#">Today</a>
               <a className="dropdown-item" href="#">Weekly</a>
               <a className="dropdown-item" href="#">Monthly</a>
             </div>
           </div>
         </div>
         <div id="total-income-graph"></div>
         <div className="row g-3 mt-3">
           <div className="col-sm-6">
             <div className="bg-body p-3 rounded">
               <div className="d-flex align-items-center mb-2">
                 <div className="flex-shrink-0">
                   <span className="p-1 d-block bg-primary rounded-circle">
                     <span className="visually-hidden">New alerts</span>
                   </span>
                 </div>
                 <div className="flex-grow-1 ms-2">
                   <p className="mb-0">Income</p>
                 </div>
               </div>
               <h6 className="mb-0">
                 $23,876 <small className="text-muted"><i className="ti ti-chevrons-up"></i> +$763,43</small>
               </h6>
             </div>
           </div>
           <div className="col-sm-6">
             <div className="bg-body p-3 rounded">
               <div className="d-flex align-items-center mb-2">
                 <div className="flex-shrink-0">
                   <span className="p-1 d-block bg-warning rounded-circle">
                     <span className="visually-hidden">New alerts</span>
                   </span>
                 </div>
                 <div className="flex-grow-1 ms-2">
                   <p className="mb-0">Rent</p>
                 </div>
               </div>
               <h6 className="mb-0">
                 $23,876 <small className="text-muted"><i className="ti ti-chevrons-up"></i> +$763,43</small>
               </h6>
             </div>
           </div>
           <div className="col-sm-6">
             <div className="bg-body p-3 rounded">
               <div className="d-flex align-items-center mb-2">
                 <div className="flex-shrink-0">
                   <span className="p-1 d-block bg-success rounded-circle">
                     <span className="visually-hidden">New alerts</span>
                   </span>
                 </div>
                 <div className="flex-grow-1 ms-2">
                   <p className="mb-0">Download</p>
                 </div>
               </div>
               <h6 className="mb-0">
                 $23,876 <small className="text-muted"><i className="ti ti-chevrons-up"></i> +$763,43</small>
               </h6>
             </div>
           </div>
           <div className="col-sm-6">
             <div className="bg-body p-3 rounded">
               <div className="d-flex align-items-center mb-2">
                 <div className="flex-shrink-0">
                   <span className="p-1 d-block bg-light-primary rounded-circle">
                     <span className="visually-hidden">New alerts</span>
                   </span>
                 </div>
                 <div className="flex-grow-1 ms-2">
                   <p className="mb-0">Views</p>
                 </div>
               </div>
               <h6 className="mb-0">
                 $23,876 <small className="text-muted"><i className="ti ti-chevrons-up"></i> +$763,43</small>
               </h6>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div> */}
   </>
  );
};

export default TransactionsCard;
