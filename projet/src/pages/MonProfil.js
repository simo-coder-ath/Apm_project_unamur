/**
 * @fileoverview composant react pour la page de profil et le questionnaire d'affinité de l'utilisateur
 * 
 * 
 *
 * ce composant affiche un questionnaire composé de sondages d'affinité actifs récupérés
 * depuis l'api 
 * 
 *  user connecté peut renseigner une note de 1 à 5 pour chaque question
 * 
 * les réponses existantes sont pré-chargées au montage
 * 
 *  à la soumission toutes les réponses sont enregistrées puis 
 * le profil Big Five de l'utilisateur est recalculé automatiquement
 * 
 * si aucun user n'est connecté une redirection vers la page de connexion est effectuée
 * 
 * 
 * 
 * 
 * 
 *
 * @module MonProfil
 *
 * @requires react
 * @requires react-router-dom
 *
 */





import React, { useState, useEffect } from 'react';


import { useNavigate } from 'react-router-dom';





import '../styles/monprofile.css';



const MonProfil = () => {



  const [surv, setsurv] = useState([]);




  const [reponses, setreponses] = useState({});





  const [loading, setload] = useState(true);



  const [enrg, setenr] = useState(false);



  const user = JSON.parse(localStorage.getItem('user'));



  const navigate = useNavigate();




  useEffect(() => {





    if (!user) {



      navigate('/login');



      return;



    }



    fetchSurveys();



    fetchuserrponses();



  }, []);


/**
 * recupere les surveys actives depuis lapi
 *
 * 
 * 
 * @async
 * 
 * 
 * 
 * 
 * @function fetchsurveys
 * 
 * 
 * envoie une requete get vers affinitysurvey active
 * 
 * 
 * met a jour le state surv avec les donnees recues
 * 
 * 
 * initialise le state reponses avec les versionid des surveys
 * 
 * 
 * 
 * 
 * capture les erreurs si elles surviennent
 */



  const fetchSurveys = async () => {



    try {



      const res = await fetch('http://localhost:5000/affinitySurvey/active');



      const data = await res.json();



      setsurv(data);



      const initial = {};



      data.forEach(s => { initial[s.versionid] = ''; });



      setreponses(initial);



    } catch (err) {



    }
  };








/**
 * recupere les reponses de lutilisateur depuis lapi
 *
 * @async
 * 
 * 
 * 
 * 
 * @function fetchuserrponses
 * 
 * envoie une requete get vers affinitysurveyresults avec lid de lutilisateur
 * 
 * 
 * met a jour le state reponses avec les resultats existants
 * 
 * 
 * capture les erreurs si elles surviennent
 * 
 * 
 * 
 * @finally met load a false
 * 
 * 
 * 
 */


  const fetchuserrponses = async () => {



    try {



      const res = await fetch(`http://localhost:5000/affinitySurveyResults?personId=${user.id}`);


      const data = await res.json();



      const existing = {};




      data.forEach(r => { existing[r.itemId] = r.result; });



      setreponses(prev => ({ ...prev, ...existing }));



    } catch (err) {




    } finally {



      setload(false);




    }
  };









/**
 * 
 * 
 * gere la modification dune reponse
 *
 * 
 * 
 * @function gererchangementreponses
 * 
 * 
 * met a jour le state reponses avec la nouvelle valeur pour une version donnee
 * 
 * 
 * 
 * 
 * @param versionid identifiant de la version
 * @param value valeur de la reponse
 */

  const gererchangementreponses = (versionId, value) => {




    setreponses(prev => ({ ...prev, [versionId]: value }));







  };











 




/**
 * 
 * 
 * enregistre toutes les reponses utilisateur et lance le calcul du profil
 *
 * 
 * 
 * @async
 * 
 * 
 * 
 * 
 * @function savetousrponses
 * 
 * 
 * 
 * active letat denregistrement
 * 
 * 
 * parcourt toutes les reponses et filtre les valeurs valides
 * 
 * 
 * envoie une requete post pour chaque reponse vers affinitysurveyresults
 * 
 * 
 * attend que toutes les requetes soient terminees
 * 
 * 
 * 
 * lance le calcul du profil bf avec lid utilisateur
 * 
 * 
 * affiche un message de succes ou derreur selon la reponse
 * 
 * 
 * 
 * capture les erreurs si elles surviennent
 * 
 * 
 * 
 * 
 * @finally desactive letat denregistrement
 * 
 * 
 */
  const savetousrponses = async () => {



  setenr(true);



  const promises = [];





  for (const [versionId, value] of Object.entries(reponses)) {







    
    if (versionId && !isNaN(versionId) && value !== '' && !isNaN(value)) {




      const itemId = parseInt(versionId, 10);



      promises.push(



        fetch('http://localhost:5000/affinitySurveyResults', {



          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personId: user.id,
            itemId: itemId,
            result: parseInt(value, 10),
            x: 0,
            y: 0
          })


        }).then(res => {





          if (!res.ok) throw new Error(`Erreur pour item ${versionId}`);



          return res.json();




        })
      );
    }
  }




  try {





    await Promise.all(promises);






    const calcRes = await fetch(`http://localhost:5000/bfProfile/calculate/${user.id}`, {



      method: 'POST'



    });







    const calcData = await calcRes.json();




    if (calcRes.ok) {




      alert('Toutes les réponses ont été enregistrées ');


    } else {




      alert(' erreur calcul: ' + calcData.error);




    }




  } catch (err) {



    
    alert('zrreuuuur');



  } finally {



    setenr(false);




  }
};














  

  if (loading) return <div className="loading">Chargement...</div>;









  

  return (



    <div className="mon-profil-container">



      <h2>Mon Profil – Questionnaire</h2>



      <p>Répondez aux questions ci‑dessous pour compléter votre profil. (Échelle de 1 à 5)</p>



      <div className="questions-list">



        {surv.map(survey => (
          <div key={survey.versionid} className="question-item">



            <p><strong>{survey.content}</strong></p>




            {survey.description && <p className="description">{survey.description}</p>}

            <input
              type="number"
              min="1"
              max="5"
              value={reponses[survey.versionid] || ''}
              onChange={(e) => gererchangementreponses(survey.versionid, e.target.value)}
            />




          </div>
        ))}













      </div>


      <div className="save-all">



        <button onClick={savetousrponses} disabled={enrg}>




          {enrg ? 'Enregistrement...' : 'Enregistrer toutes les réponses'}




        </button>


      </div>



    </div>
  );
};




































export default MonProfil;