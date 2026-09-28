/**
 * @fileoverview composant react pour l'ajout d'une nouvelle pratique
 *
 * Ce composant affiche un formulaire permettant de créer une pratique en renseignant
 * son nom, sa description, son objectif et son type les types de pratiques sont
 * récupérés dynamiquement depuis l'api
 * 
 * 
 * après soumission user est redirigé vers la page d'ajout de version
 * de la pratique nouvellement crée
 *
 * 
 * @module Addpractice
 *
 * @requires react
 * @requires react-router-dom
 *
 * @param {Object} props 
 *
 */


import React, { useState, useEffect } from 'react';


import { useNavigate } from 'react-router-dom';

import { useSearchParams } from 'react-router-dom';





import '../styles/addpractice.css';

const Addpractice = () => {

  const [name, setname] = useState('');
  const [description, setdescription] = useState('');
  const [objectif, setobjectif] = useState('');
  const [practiquetype, settype] = useState([]);
  const [selectedtype, setselectedtype] = useState('');
  const navig = useNavigate();



const [searchParams] = useSearchParams();

const teamid = searchParams.get('teamId');



  
 useEffect(() => {


/**
 * 
 * 
 * Récupère les types de pratiques depuis l'api
 * et met à jour le state practiquetype
 * 
 * 
 * 
 *
 * 
 * 
 * @async
 * 
 * 
 * 
 * 
 * 
 * @function fetchpratiquetypes
 * @returns {Promise<void>}
 */


  const fetchpratiquetypes = async () => {



    try {

      const response = await fetch('http://localhost:5000/practicetypes');

      if (!response.ok) {
       




      }

      const data = await response.json(); 

      settype(data); 
    } catch (error) {








      settype([]); 
    }
  };




  fetchpratiquetypes();
}, []);






/**
 * 
 * 
 * Gere la soumission du form
 * 
 *
 * envoie les données au backend pour créer une pratique
 * puis redirige vers la page d'ajout de version
 * 
 * 
 * 
 *
 * @async
 * 
 * 
 * @function hndlesubmit
 * 
 * @param {React.FormEvent<HTMLFormElement>} e 
 * 
 * 
 * 
 * @returns {Promise<void>}
 */


  const hndlesubmit = async (e) => {
    e.preventDefault();

    try {
      


      const response = await fetch('http://localhost:5000/practice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          objective: objectif,
          typeId: selectedtype,
        }),
      });

       const newpractice = await response.json();





      
      navig(`/ajouter-practice-version?practiceId=${newpractice.id}&teamId=${teamid}`);





    } catch (error) {
      
    }
  };

  










  return (



  <div className="ajouterprat-page">



    

    <form onSubmit={hndlesubmit} className="ajouterpra-form">









      <h2 className="ajouterpratiquetitre">Ajouter une nouvelle pratique</h2>












      
      <div className="group-formulaire">



        <label className="form-lab">Nom :</label>



        <input
          type="text"
          value={name}
          onChange={(e) => setname(e.target.value)}
          className="formu-input"
          required
        />



      </div>

















      <div className="group-formulaire">








        <label className="form-lab">Description :</label>








        <textarea
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          className="formu-text"
          required
        />











      </div>

      <div className="group-formulaire">











        <label className="form-lab">Objectif :</label>







        <input
          type="text"
          value={objectif}
          onChange={(e) => setobjectif(e.target.value)}
          className="formu-input"
        />











      </div>

      <div className="group-formulaire">







        <label className="form-lab">Type de pratique :</label>










        <select
          value={selectedtype}
          onChange={(e) => setselectedtype(e.target.value)}
          className="formu-select"
          required
        >
          <option value="">Sélectionner un type</option>
          {practiquetype.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>











      </div>

      <button type="submit" className="ajouterprat-btn">Créer la pratique</button>











    </form>






  </div>
);



};

















export default Addpractice;
