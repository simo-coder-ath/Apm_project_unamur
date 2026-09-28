/**
 * @fileoverview composant react pour la visualisation des détails d'une team
 * 
 * 
 * 
 * 
 * 
 * ce composant récupère et affiche les informations d'une team spécifique,
 * notamment la liste des membres et les pratiques associées
 * 
 * 
 * 
 * 
 * il permet également d'effectuer différentes actions selon le rôle de l'utilisateur :
 * - consulter les associations entre pratiques et méthodes
 * - consulter les associations entre pratiques
 * - créer une nouvelle pratique
 * - créer un univers
 * - ajouter un membre à la team
 * 
 * 
 * 
 * 
 * 
 * les données de la team sont récupérées dynamiquement depuis l'api
 * en fonction de l'id présent dans les paramètres de l'url
 * 
 * 
 * 
 * 
 * un formulaire conditionnel permet d'ajouter un membre via son email
 * avec gestion des erreurs retournées par l'api
 * 
 * 
 * 
 * 
 * les actions disponibles sont conditionnées par le rôle de l'utilisateur
 * stocké dans le localStorage
 * 
 * 
 * 
 * 
 * @module Teamdetails
 * 
 * 
 * 
 * 
 * @requires react
 * @requires react-router-dom
 * @requires ./Practices
 * 
 * 
 * 
 * 
 */






import React, { useEffect, useState } from 'react';



import { useParams, useNavigate } from 'react-router-dom';


import Practices from './Practices'; 



import "../styles/teamdetail.css";



const Teamdetails = () => {





  const { id } = useParams();



  const navigate = useNavigate();







  const user = JSON.parse(localStorage.getItem("user"));
























  const [showajoutuser, setshowajout] = useState(false);

const [emailajout, setemailajout] = useState("");

const [erreurmesg, seterreurmsg] = useState("");






/**
 * 
 * 
 * 
 * 
 * ajoute un membre a une team
 *
 * 
 * 
 * 
 * @async
 * 
 * 
 * 
 * 
 * @function ajoutmemebre
 * 
 * 
 * envoie une requete post vers team add member avec lid de la team et le mail du membre
 * 
 * 
 * met a jour le state teamdata avec le nouveau membre si la requete reussit
 * 
 * 
 * reinitialise le champ email ajout et ferme le modal
 * 
 * 
 * reinitialise le message derreur
 * 
 * 
 * 
 * capture les erreurs si elles surviennent
 */

const ajoutmemebre = async () => {






  try {




    const response = await fetch(`http://localhost:5000/team/${id}/add-member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: emailajout })
    });


    const data = await response.json();



    if (!response.ok) {
      seterreurmsg(data.message);
      return;



    }




    

    setteamdata(prev => ({
      ...prev,
      members: [...prev.members, data.newMember]
    }));



    setemailajout("");
    setshowajout(false);
    seterreurmsg("");

  } catch (err) {
    


  }
};






  const [datateam, setteamdata] = useState({
    members: [],
    practices: []
  });







  useEffect(() => {



/**
 * 
 * 
 * recupere les donnees dune team
 *
 * 
 * 
 * @async
 * 
 * 
 * 
 * 
 * @function fetchteamdata
 * 
 * 
 * envoie une requete get vers team avec lid de la team
 * 
 * 
 * met a jour le state teamdata avec les donnees recues
 * 
 * 
 * 
 * 
 * capture les erreurs si elles surviennent
 */
    const fetchteamdata = async () => {




      try {
        const response = await fetch(`http://localhost:5000/team/${id}`);
        const data = await response.json();
        setteamdata(data);







      } catch (err) {






      }
    };

    fetchteamdata();
  }, [id]);











  return (



     <div className="team-details-page">




    <div className="team-details-contain">
      


     



<div className="team-members-section">
  <h3>Membres</h3>
  <ul>
    {datateam.members.map(member => (
      <li key={member.id}>
        {member.name} ({member.email})
      </li>
    ))}
  </ul>
</div>

   
     <Practices teamId={id} />

      <div className="team-buttons-bar"> 

     
     <button className="associer-btn"  onClick={() => navigate(`/practice-methods?teamId=${id}`)}>
  Voir les association des methodes
</button>


      <button className="associer-btn" onClick={() => navigate(`/practice-associ?teamId=${id}`)}>
        Voir les association des pratiques
      </button>

      



















     <>
  
  {user?.roleId !== 4 && (
    <button className="associer-btn"  onClick={() => navigate(`/ajouter-practice?teamId=${id}`)}>
      Créer une nouvelle pratique
    </button>
  )}

 


  {user?.roleId === 1 && (
    <>
      <button className="associer-btn" onClick={() => navigate(`/creer-univers?teamId=${id}`)}>
        Créer un univers
      </button>

      <button className="associer-btn" onClick={() => setshowajout(!showajoutuser)}>
        Ajouter un membre
      </button>
    </>
  )}
</>




 </div>





{showajoutuser && (

  <div style={{ marginTop: "10px" }}>


    <input
      type="email"
      placeholder="Entrer l'email du membre"
      value={emailajout}
      onChange={(e) => setemailajout(e.target.value)}
    />





    <button className="associer-btn"  onClick={ajoutmemebre}>
      Ajouter
    </button>

    {erreurmesg && (
      <p style={{ color: "red" }}>{erreurmesg}</p>
    )}




    
  </div>
)}



    </div>
      </div>

  );
};

























export default Teamdetails;









