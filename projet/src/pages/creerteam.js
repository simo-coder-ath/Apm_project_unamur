/**
 * @fileoverview composant React pour la création d'une nouvelle team
 *
 * ce composant affiche un formulaire permettant à l'utilisateur connecté de créer
 * une team en renseignant un nom et une description 
 * 
 * l'identifiant de l'utilisateur est lu depuis le localstorage pour l'associer
 * à la team créée en cas de succès l'utilisateur est redirigé vers la page d'accueil
 * 
 * 
 * un message d'erreur est affiché si le nom est manquant ou si l'utilisateur
 * n'est pas connecté
 *
 * @module Creerteam
 *
 * @requires react
 * @requires react-router-dom
 *
 */




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';





import "../styles/creerteam.css";




/**
 * composant React permettant de créer une nouvelle team
 *
 * 
 * 
 * gère les états du formulaire nom, description, message
 * et la soumission vers api
 *
 * @component
 * 
 * 
 * 
 * @returns {JSX.Element}
 */


const Creerteam = () => {





  const [name, setname] = useState('');




  const [description, setdescription] = useState('');




  const [message, setmessage] = useState('');






  const navigate = useNavigate();





const user = JSON.parse(localStorage.getItem("user"));


















/**
 * gere la soumission du formulaire de création de team
 * 
 * 
 * 
 *
 * etapes :
 *  empeche le rechargement de la page
 *  verifie si user est connecté
 * verifie si le nom est renseigné
 * envoie une requête post a api
 * et redirige vers l'accueil si succès
 *
 * @async
 * 
 * @function gerersubmit
 * 
 * 
 * @param {React.FormEvent<HTMLFormElement>} e 
 * 
 * 
 * 
 * 
 * @returns {Promise<void>}
 */

  const gerersubmit = async (e) => {




    e.preventDefault();





const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user || !user.id) {




    return;


  }
  



    if (!name) {




      setmessage('Le nom est obligatoire');

      return;
    }







    try {


      const response = await fetch('http://localhost:5000/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          userId: user.id
        })
      });






      const data = await response.json();





      if (response.ok) {


        navigate('/');



      } else {






      }




    } catch (err) {












    }
  };































  return (
     <div className="creerteampage ">


    <div className="creerteamcarte">


      <h2 className="creerteamtitre">Créer une team</h2>


      <h2>Créer une team</h2>





      {message && <p className="error">{message}</p>}






      <form onSubmit={gerersubmit} className="creerteamform ">




        <label>Nom de la team </label>


        <input
          type="text"
          value={name}
          onChange={(e) => setname(e.target.value)}
          placeholder="Ex : Team Agile"
          required
        />




        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          placeholder="Description de la team"
        />





        <div className="creerteam-actions">
          <button type="submit">Créer</button>
          <button type="button" onClick={() => navigate('/')}>
            Annuler
          </button>
        </div>
      </form>
    </div>
     </div>

  );
};

export default Creerteam;
