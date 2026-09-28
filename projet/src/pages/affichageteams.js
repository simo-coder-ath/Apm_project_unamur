
/**
 * @fileoverview composant react pour l'affichage des teams de l'utilisateur connecté
 *
 * ce composant récupère et liste toutes les teams auxquelles appartient l'utilisateur
 * actuellement connecté en lisant son identifiant depuis le localstorage
 * 
 * 
 * chaque team est cliquable et redirige vers la page de détail de la team concernée
 * 
 * si user n'appartient à aucune team, un message informatif est affiché
 *
 * @module Mesteams
 *
 * @requires react
 * @requires react-router-dom
 *
 */





import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


import "../styles/affichageteam.css";

const Mesteams = () => {



  const [teams, setteam] = useState([]);


  const navig = useNavigate();






 

  useEffect(() => {



/**
 * récupère les teams de l'utilisateur connecté depuis api
 * 
 * 
 * 
 *
 * utilisateur est récupéré depuis le localstorage
 * 
 * 
 * si aucun utilisateur n'est trouvé la requête n'est pas exécuté
 * 
 * 
 *
 * @async
 * 
 * 
 * @function fetchteam
 * 
 * 
 * 
 * @returns {Promise<void>}
 * 
 * 
 */


  const fetchteam = async () => {



    try {


        

      const user = JSON.parse(localStorage.getItem("user"));



      if (!user) return; 




      const response = await fetch(`http://localhost:5000/myteams?userId=${user.id}`);



      const data = await response.json();



      setteam(data);




    } catch (err) {








    }
  };

  fetchteam();
}, []);








  return (

     <div className="teampage">


    <div className="teamcontain">




      <h2 className="teamtitre
">Mes Teams</h2>
      <ul>

        {teams.length > 0 ? (


          teams.map((team) => (

            <li key={team.id} onClick={() => navig(`/team/${team.id}`)} style={{ cursor: 'pointer', marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <strong>{team.name}</strong>
              <p>{team.description}</p>
            </li>




          ))
        ) : (

          <p>Vous ne faites partie d’aucune team pour le moment.</p>


        )}
      </ul>
    </div>
    </div>
  
  );
};





export default Mesteams;
