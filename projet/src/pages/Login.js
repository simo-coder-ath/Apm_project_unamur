/**
 * @fileoverview composant react pour la connexion d'un user existant
 * 
 * 
 *
 * ce composant affiche un formulaire de connexion permettant à user
 * de s'authentifier avec son email et son mot de passe
 * en cas de succès les informations d'user sont stockées dans le localstorage et
 * il est redirigé vers la page d'accueil
 *  Un message d'erreur est affiché
 * 
 * 
 * si les champs sont vides ou si l'api retourne une erreur d'authentification
 *
 * 
 * @module Login
 *
 * @requires react
 * @requires react-router-dom
 *
 */








import React, { useState } from "react";

import { useNavigate } from "react-router-dom";



import "../styles/login.css";








function Login() {





    const navigate = useNavigate();




  const [email, setemail] = useState("");



  const [password, setpassword] = useState("");




  const [message, setmsg] = useState("");



  










/**
 * gere la soumission du formulaire de connexion
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
 * @function geresubmit
 * 
 * 
 * 
 * empeche le comportement par defaut du formulaire
 * 
 * 
 * 
 * verifie que les champs email et mot de passe sont remplis
 * 
 * 
 * 
 * 
 * envoie une requete post vers login avec email et mot de passe
 * 
 * 
 * 
 * si la reponse est ok stocke lutilisateur dans localstorage et navigue vers lacceuil
 * 
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
 * @param e evenement de soumission du formulaire
 *
 * 
 * 
 * 
 */



  const geresubmit = async (e) => {




    e.preventDefault();





    if (!email || !password) {
      setmsg("les champs oblig ");

      return;
    }






    try {





      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });



      const data = await response.json();




      if (response.ok) {




        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");




      } else {



        setmsg(data.error || "Err");



      }




    } catch (err) {









     // setmsg("ERR SERVR");


    }
  };









  return (




    <div className="login-page" >




      <div className="logincarte">




        <h2>Bienvenue</h2>




        <p className="login-subtitre">Connectez-vous à votre espace Agilia</p>





        {message && <div className="loginerreurmesg">{message}</div>}




        <form onSubmit={geresubmit}>



          <div className="login-form-group">



            <label>Email  </label>



            <input
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="vous@exemple.com"
              required
            />




          </div>




          <div className="login-form-group">




            <label>Mot de passe</label>




            <input
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>




          <button type="submit" className="login-button">



            Se connecter



          </button>




        </form>





        <p className="loginregisterlien">



          Pas encore de compte ? <a href="/register">Créez-en un</a>



        </p>




      </div>




    </div>
  );



}

export default Login;


