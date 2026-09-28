/**
 * @fileoverview composant react pour l'inscription d'un nouvel user
 *
 * ce composant affiche un formulaire d'inscription permettant de saisir un nom complet,
 * une adresse email, un mot de passe, sa confirmation et un rôle
 * 
 * les rôles disponibles sont chargés dynamiquement depuis l'api au montage du composant
 * en cas de succès user est redirigé vers la page de connexion
 * un message d'erreur est affiché
 * si les mots de passe ne correspondent pas ou si l'api retourne une erreur
 *
 * 

 * @module Inscription
 *
 * 
 * 
 * @requires react
 * @requires react-router-dom
 *
 * 
 * 
 */




import React, { useState } from "react";
import { useEffect} from 'react';

import { useNavigate } from "react-router-dom";


import "../styles/inscription.css";




function Inscription() {









  const [name, setname] = useState("");


  const [email, setemail] = useState("");


  const [password, setpassword] = useState("");

const navigate = useNavigate();



  const [confirmpass, setconfirmpass] = useState("");



  const [message, setmeessage] = useState("");














  const [roleid, setroleid] = useState(""); 

 const [roles, setroles] = useState([]); 






 useEffect(() => {


/**
 * recupere les roles depuis lapi
 *
 * @async
 * 
 * 
 * @function fetchroles
 * 
 * envoie une requete get vers roles
 * 
 * met a jour le state roles avec les donnees recues
 * 
 * 
 * capture les erreurs si elles surviennent
 */


    async function fetchroles() {


      try {
        const res = await fetch("http://localhost:5000/roles"); 

        const data = await res.json();

        setroles(data);


      } catch (err) {



      }
    }
    fetchroles();
  }, []);



/**
 * gere la soumission du formulaire dinscription
 *
 * 
 * 
 * 
 * @async
 * 
 * 
 * 
 * 
 * @function gerrersubmit
 * 
 * empeche le comportement par defaut du formulaire
 * 
 * 
 * verifie que tous les champs sont remplis
 * 
 * 
 * 
 * verifie que le mot de passe correspond a la confirmation
 * envoie une requete post vers register avec nom email motdepasse et roleid
 * 
 * 
 * 
 * si la reponse est ok reinitialise les champs et navigue vers connect
 * 
 * 
 * 
 * sinon met a jour le message derreur
 * 
 * 
 * 
 * 
 * capture les erreurs si elles surviennent
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * @param e evenement de soumission du formulaire
 */





  const gerrersubmit = async (e) => {

    e.preventDefault();

   



    if (!name || !email || !password || !confirmpass) {
      
      return;
    }

    if (password !== confirmpass) {
     
      return;
    }




    try {

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password , roleId: roleid }),
      });

      const data = await response.json();

      if (response.ok) {

        setname(""); setemail(""); setpassword(""); setconfirmpass("");
        setroleid("");
         navigate("/connect");


      } else {



        setmeessage(data.error || "errroooooor ");




      }



    } catch (err) {



     console.error(err);
     




    }
  };

























  return (
   


       <div className="inscription-page">



    <div className="inscription-carte">





      <h2 className="inscription-titre">Inscription</h2>





      {message && <div className="erreurmessage">{message}</div>}


      <form onSubmit={gerrersubmit}>

        <div>
          <label>Nom complet</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </div>






        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>







        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>










        <div>
          <label>Confirmation du mot de passe</label>
          <input
            type="password"
            value={confirmpass}
            onChange={(e) => setconfirmpass(e.target.value)}
          />
        </div>







<div>
          <label>Rôle</label>


          <select
            value={roleid}
            onChange={(e) => setroleid(e.target.value)}
          >
            <option value="">-- Choisir un rôle --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>



        </div>







        <button type="submit"  >S'inscrire</button>
      </form>
    </div>
  
  </div>
  );
}










export default Inscription;
