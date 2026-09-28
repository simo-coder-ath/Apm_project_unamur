/**
 * @fileoverview composant react pour la création d'une nouvelle version de pratique
 * 
 * 
 * 
 *
 * ce composant affiche un formulaire permettant de créer une version d'une pratique
 * existante en renseignant un nom de version, une description du changement et un univers
 * 
 * 
 * id de la pratique et celui de la team sont récupérés depuis les query params
 * de l'url
 * Les univers disponibles sont chargés dynamiquement depuis l'api en fonction
 * de la team
 * 
 * en cas de succès l'utilisateur est redirigé vers l'espace de travail
 * de la version nouvellement créée
 * 
 * 
 * 
 *
 * @module Practiceversionform
 *
 * @requires react
 * @requires react-router-dom
 *
 */









import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';



import { useSearchParams } from 'react-router-dom';

import '../styles/creerversion.css';


const Practiceversionform = () => {

  const { id } = useParams(); 

  const [nomversion, setnomversion] = useState('');

  const [descriptionchange, setdescriptionchange] = useState('');


  const [universe, setuniverse] = useState([]);


  const [universeselected, setuniverseselected] = useState('');



  const navig = useNavigate();


 
  const userId = 1;






  const [searchParams] = useSearchParams();

const practiceid = searchParams.get('practiceId');


const teamid = searchParams.get('teamId');








  useEffect(() => {


/**
 * 
 * 
 * recupere lunivers dune team
 *
 * 
 * 
 * @async
 * 
 * 
 * 
 * @function fetchuniverse
 * 
 * 
 * envoie une requete get vers universes avec lid de la team
 * 
 * 
 * met a jour le state universe avec les donnees recues
 * 
 * 
 * 
 * capture les erreurs si elles surviennent
 */
    const fetchuniverse = async () => {


      try {
         const res = await fetch(`http://localhost:5000/universes/${teamid}`);
        const data = await res.json();
        setuniverse(data);
      } catch (err) {
        


      }
    };
    fetchuniverse();
  }, []);




/**
 * 
 * 
 * 
 * 
 * 
 * soumet une nouvelle version de pratique
 *
 * 
 * 
 * @async
 * 
 * 
 * 
 * @function submit
 * 
 * empêche le comportement par defaut du formulaire
 * 
 * envoie une requete post vers practiceversion avec lid de la pratique lid de lunivers nom de la version description des changements et lid de lu utilisateur
 * 
 * redirige vers lespace travail de la nouvelle version si la requete reussit
 * 
 * 
 * capture les erreurs si elles surviennent
 */
const submit = async (e) => {


  e.preventDefault();




  try {
    const res = await fetch('http://localhost:5000/practiceVersion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        practiceId: parseInt(practiceid),
        universeId: parseInt(universeselected),
        versionName: nomversion,
        changeDescription: descriptionchange,
        lastUpdateById: userId
      })
    });

    if (res.ok) {

      const newversion = await res.json();
      

      navig(`/espace-travail/${newversion.id}`); 
    }
  } catch (err) {
    //console.error(err);
  }
};









  return (


     <div className="creerversionpage">
    
    <div className="creerversion-contain">
      
      <h2 className="creerversiontitre">


        Créer une nouvelle version 


      </h2>


      <form onSubmit={submit}         className="creerversionform"  >


<div className="creer-form-group">
        <label>Nom de version:</label>
        <input
          type="text"
          value={nomversion}
          onChange={(e) => setnomversion(e.target.value)}
          placeholder="ex: v1.0 - Standard"
          required
        />
  </div>

<div className="creer-form-group">

        <label>Description du changement:</label>
        <textarea
          value={descriptionchange}
          onChange={(e) => setdescriptionchange(e.target.value)}
          placeholder="Expliquer ce qui diffère de la version précédente"
          required
        />

</div>






<div className="creer-form-group">
        <label>Univers:</label>
        <select
          value={universeselected}
          onChange={(e) => setuniverseselected(e.target.value)}
          required
        >
          <option value="">-- Sélectionner un univers --</option>
          {universe.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
 </div>


        <button type="submit" style={{ marginTop: '10px' }}>Créer la version</button>


      </form>
    </div>
      </div>

  );
};














export default Practiceversionform ;
