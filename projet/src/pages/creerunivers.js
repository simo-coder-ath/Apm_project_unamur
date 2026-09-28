
/**
 * @fileoverview composant react pour la création d'un nouvel univers au sein d'une team
 *
 * ce composant affiche un formulaire permettant de créer un univers en renseignant
 * un nom (obligatoire) et une description (optionnelle)
 * 
 * L'identifiant de la team est récupéré depuis les query params de l'url afin d'associer l'univers à la team
 * concernée
 * 
 * en cas de succès l'utilisateur est redirigé vers la page de la team
 * 
 * Un bouton Annuler permet de revenir à la page précédente
 *
 * @module Creerunivers
 *
 * @requires react
 * @requires react-router-dom
 *
 */



import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';






import '../styles/creeruniver.css';







const Creerunivers = () => {





  const [searchParams] = useSearchParams();


  const navigate = useNavigate();




  const teamid = searchParams.get('teamId');




  const [name, setname] = useState('');



  const [description, setdescri] = useState('');





  const [error, seterror] = useState('');




/**
 * gere la soumission du formulaire de creation dun univers
 *
 * 
 * 
 * 
 * 
 * etapes
 * 
 * 
 * 
 * empeche le rechargement de la page
 * 
 * 
 * verifie que le nom nest pas vide
 * 
 * 
 * envoie une requete post a lapi avec le nom la description et lid de la team
 * 
 * 
 * redirige vers la page de la team si la creation reussit
 * 
 * 
 * 
 * 
 *
 * @async
 * 
 * @function gerersubm
 * 
 * 
 * @param e evenement de soumission du formulaire
 * 
 * @returns promesse vide
 * @erreur si la requete api echoue
 */


  const gerersubm = async (e) => {




    e.preventDefault();





    if (!name.trim()) {



      return;
    }










    try {





      const response = await fetch('http://localhost:5000/universe', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId: teamid,
          name,
          description,
        }),
      });

      if (!response.ok) {


        throw new Error('Erreur ');


      }

     
      navigate(`/team/${teamid}`);





    } catch (err) {




        
    }
  };




























  return (



 <div className="creerunivers-page">

   <div className="creerunivers-contain">

  <h2 className="creerunivers-titre">Créer un univers</h2>



      {error && <p style={{ color: 'red' }}>{error}</p>}



      <form onSubmit={gerersubm}>


        <div>
          <label>Nom de l’univers</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
          />
        </div>






        <div>


          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setdescri(e.target.value)}
          />
        </div>






        <button className="creerunivers-btn" type="submit">Créer</button>



        <button className="creerunivers-btn" type="button" onClick={() => navigate(-1)}>
          Annuler
        </button>




      </form>
    </div>
    </div>
  );
};











export default Creerunivers;
