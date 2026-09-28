/**
 * @fileoverview composant react représentant le tableau de bord principal de l'application
 * 
 * 
 *
 * ce composant constitue la page d'accueil de l'application il présente un message de bienvenue
 * ainsi qu'une grille d'actions rapides permettant à user de naviguer vers les
 * fonctionnalités principales : création de team, consultation de ses teams et accès à son profil
 * 
 * 
 * 
 * 
 * 
 * les types de pratiques sont chargés au montage depuis l'api pour un usage interne
 * 
 * 
 * un formulaire de création de pratique peut également être affiché à la demande
 * 
 * 
 * 
 * 
 *
 * @module Dashboard
 *
 * 
 * 
 * 
 * @requires react
 * @requires react-router-dom
 * @requires lucide-react
 *
 * 
 * 
 */














import React, { useState, useEffect } from 'react';
import { Search, Plus, List, MessageSquare, Users, User   } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Dashboard.css';


const Dashboard = () => {

  const [termsearch, settermsearch] = useState('');

  const [showform, setshowform] = useState(false);




  const [nompratique, setnompratique] = useState('');

  const [descriptionpratique, setdescription] = useState('');

  const [objectifspratique, setobjectifs] = useState('');

  const [typespratiques, setpratique] = useState([]);

  const [selecttype, setselectedtype] = useState('');

  const navig = useNavigate(); 





  useEffect(() => {
    


    /**
 * lance la recuperation des types de pratique au montage du composant
 *
 * 
 * 
 * 
 * @async
 * @function fetchpratiquetypes
 * 
 * 
 * @recupere les types depuis lapi
 * 
 * 
 * met a jour le state pratique avec les donnees recues
 * 
 * 
 * 
 * capture les erreurs si elles surviennent
 */

  
    const fetchpratiquetypes = async () => {


      try {
        const response = await fetch('http://localhost:5000/practicetypes');
        const data = await response.json();
        

        setpratique(data);
      } catch (err) {
        

      }
    };
    fetchpratiquetypes();
  }, []);







/**
 * 
 * 
 * gere la soumission du formulaire de recherche
 *
 * 
 * 
 * 
 * @function search
 * 
 * 
 * 
 * empeche le comportement par defaut du formulaire
 * 
 * 
*/
  const search = (e) => {
    e.preventDefault();
  };





  const actionvite = [

    


    









    {
  id: 4,
  title: 'Créer une team',
  description: 'Créer une nouvelle équipe et inviter des membres',
  icon: <Users size={24} />,
  path: '/creer-team',
  color: 'action-orange'
},








{
  id: 5,
  title: 'Mes Teams',
  description: 'Voir toutes les équipes dont vous faites partie',
  icon: <Users size={24} />,
  path: '/user-teams',
  color: 'action-cyan'
},





{
  id: 6,
  title: 'Mon Profil',
  description: 'Compléter votre profil et répondre au questionnaire',
  icon: <User size={24} />,
  path: '/mon-profil',
  color: 'action-purple'
}





  ];





  /**
 * gere le clic sur une action
 *
 * 
 * 
 * 
 * @function actionclik
 * si le chemin est espace-travail affiche le formulaire
 * sinon navigue vers le chemin passe en parametre
 * 
 * 
 * 
 * @param path chemin de navigation
 */
  const actionclik = (path) => {
    if (path === '/espace-travail') {
      setshowform(true);
    } else {
      navig(path); 
    }
  };



  
  const Creerpratique = async (e) => {

    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nompratique,
          description: descriptionpratique,
          objective: objectifspratique,
          typeId: selecttype
        })
      });



      if (response.ok) {
        const newPractice = await response.json();
       
        navig(`/practice/${newPractice.id}/version`);
      } else {
        


      }
    } catch (err) {
      


    }
  };






  return (
    <div className="containe">
      <div className="content">
        <div className="section">
          <h1>Bienvenue sur Agilia</h1>

          <p>
            Le référentiel collaboratif de pratiques agiles. Découvrez, partagez et améliorez 
            vos pratiques de développement agile grâce aux retours d'expérience de toute la communauté.
            Inspiré par le framework AMQuICK, Agilia vous aide à trouver les pratiques adaptées à votre contexte.
          </p>


        </div>

        


        {!showform && (
          <div className="actionsvite">
            
            <div className="grille">
              {actionvite.map((action) => (
                <div
                  key={action.id}
                  className={`carte ${action.color}`}
                  onClick={() => actionclik(action.path)}
                >
                  <div className="icon2">{action.icon}</div>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}



       










      </div>
    </div>
  );
};






export default Dashboard;



