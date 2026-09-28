/**
 * @fileoverview composant react pour l'affichage et la gestion des pratiques d'une team
 * 
 * 
 * 
 *
 * ce composant liste toutes les pratiques associées à une team et permet de consulter
 * leurs versions
 * 
 * 
 * un clic sur une pratique charge ses versions et un clic sur une version
 * redirige vers l'espace de travail correspondant
 * 
 * 
 * les utilisateurs avec le rôle expert (roleid == 1) disposent d'actions supplémentaires : création de méthode, ajout de version
 * de méthode, association de versions de pratiques entre elles, association pratique–méthode,
 * liaison d'items de questionnaire d'affinité à une version, consultation des items liés
 * et des scores d'affinité des membres de la team
 * 
 * 
 * 
 * 
 * 
 *
 * @module Practices
 *
 * @requires react
 * @requires react-router-dom
 *
 * @param {Object} props
 * @param {number} props.teamId - Identifiant de la team dont on affiche les pratiques
 * 
 * 
 * 
 * 
 */





import React, { useEffect, useState } from 'react';
import '../styles/practicecss.css';
import { useParams } from "react-router-dom";





import { useNavigate } from "react-router-dom";
















const Practices  = ({ teamId }) => {




const navigate = useNavigate();




  const user = JSON.parse(localStorage.getItem("user"));


  const [pratiques, setpratiques] = useState([]);


  const [versions, setversion] = useState([]);
  const [selectedpractice, setselectedpract] = useState(null);


  const [telechargement, settelechargement] = useState(true);





  const [showassoc, setshowassoc] = useState(false);
const [allversion, setallversion] = useState([]);






const [showformmethod, setcreermethode] = useState(false);



const [newmethod, setnouveaumethod] = useState({
  name: '',
  objective: '',
  description: '',
  typeId: ''
});









const [selectedversion, setselectedversion] = useState([]); 



const [associationtype, setassociattype] = useState(null);



const [asociationtype, setassociationtypes] = useState([]);




const [methodetype, setmethodtypes] = useState([]);






const [showformmethodversion, setformmethodeversion] = useState(false);






const [methods, setmethods] = useState([]);


const [universes, setunivers] = useState([]);




const [newmethodversion, setnewmethodversion] = useState({
  methodId: '',
  universeId: '',
  versionName: '',
  changeDescription: '',
  lastUpdateById: 1 
});





const [showassocierpratiquemethode, setshowasspratiquemethode] = useState(false);




const [pratiqueversion, setpratiqueversions] = useState([]);




const [selectpratiqueversion, setselectedpracticeversion] = useState(null);





const [selectedmethod, setselectedmethod] = useState(null);



const [methodversion, setmethodversion] = useState([]);







const [selectedversiondemethode, setselectedversiondemethode] = useState([]);






const [practiceversioncontext, setpracticeversioncontext] = useState({


  visible: false,
  x: 0,
  y: 0,
  versionId: null
});











const [affinitymodel, setafflinkmod] = useState({



  open: false,
  selectedItems: [],
  versionId: null
});







const [availableitem, setavaitem] = useState([]);






const [linkeditem, setlinkeditem] = useState([]);



const [showlinkeditemmodal, setshowlinkeditemmodal] = useState(false);



const [memscore, setmemscore] = useState([]);



const [showscoremod, setshowscoremod] = useState(false);


const [selectedVersionForScores, setdelectedversionforscore] = useState(null);



const [loadscores, setloadscores] = useState(false);












/**
 * 
 * 
 * charge les items lies a une version de pratique
 *
 * @async
 * 
 * 
 * @function loadlinkeditem
 * 
 * 
 * envoie une requete get vers practiceversion affinityitems avec lid de version
 * 
 * 
 * met a jour le state linkeditem avec les donnees recues
 * 
 * 
 * affiche le modal des items lies
 * 
 * 
 * capture les erreurs si elles surviennent
 * 
 * 
 * 
 * 
 * 
 * @param versionid identifiant de la version
 */

const loadlinkeditem = async (versionId) => {



  try {




    const res = await fetch(`http://localhost:5000/practiceVersion/${versionId}/affinityItems`);



    const data = await res.json();



    setlinkeditem(data);



    setshowlinkeditemmodal(true);



  } catch (err) {










  }
};












/**
 * 
 * 
 * charge les scores des membres pour une version de pratique
 *
 * 
 * 
 * 
 * 
 * @async
 * 
 * 
 * 
 * @function loadmemscores
 * 
 * 
 * active letat de chargement des scores
 * 
 * 
 * envoie une requete get vers practiceversion memberscores avec lid de version et lid de la team
 * 
 * 
 * met a jour le state memscore avec les donnees recues
 * 
 * 
 * enregistre la version selectionnee pour les scores
 * 
 * 
 * affiche le modal des scores
 * 
 * 
 * capture les erreurs si elles surviennent
 * 
 * 
 * 
 * @finally desactive letat de chargement
 * 
 * 
 * 
 * 
 * @param versionid identifiant de la version
 */

const loadmemscores = async (versionId) => {




  setloadscores(true);



  try {



    const res = await fetch(`http://localhost:5000/practiceVersion/${versionId}/memberScores?teamId=${teamId}`);



    const data = await res.json();



    setmemscore(data);



    setdelectedversionforscore(versionId);



    setshowscoremod(true);



  } catch (err) {







    
  } finally {








    setloadscores(false);









  }
};













/**
 * recupere les versions de pratiques et reinitialise les etats
 *
 * @async
 * 
 * 
 * 
 * @function gererstates
 * 
 * 
 * 
 * envoie une requete get vers teams practiceversions avec lid de la team
 * 
 * 
 * met a jour le state pratiqueversions avec les donnees recues
 * 
 * 
 * reinitialise les selections de pratique et methode
 * 
 * 
 * 
 * vide la liste des versions de methode
 * 
 * 
 * 
 * active laffichage de lassociation pratique methode
 * 
 * 
 * 
 * capture les erreurs si elles surviennent
 */

const gererstates = async () => {



  try {



 const response = await fetch(`http://localhost:5000/teams/${teamId}/practiceversions`);
    const data = await response.json();

    setpratiqueversions(data);



    setselectedpracticeversion(null);



    setselectedmethod(null);



    setmethodversion([]);



    setselectedversiondemethode([]);


    setshowasspratiquemethode(true);



  } catch (err) {


   // console.error(err);


  }


};














/**
 * 
 * 
 * charge les versions dune methode
 *
 * 
 * 
 * @async
 * 
 * 
 * 
 * @function loadmethodeversion
 * 
 * met a jour la methode selectionnee
 * 
 * reinitialise les versions selectionnees de la methode
 * 
 * envoie une requete get vers methods versions avec lid de la methode
 * 
 * met a jour le state methodversion avec les donnees recues
 * 
 * 
 * 
 * 
 * @param method methode selectionnee
 */

const loadmethodeversion = async (method) => {



  setselectedmethod(method);


  setselectedversiondemethode([]);

  const res = await fetch(
    `http://localhost:5000/methods/${method.id}/versions`
  );



  const data = await res.json();


  setmethodversion(data);



};













/**
 * gere la selection multiple des versions de methode
 *
 * 
 * 
 * @function gerermultipleselection
 * 
 * verifie si la version est deja selectionnee
 * 
 * si oui la retire de la liste
 * 
 * sinon lajoute a la liste des versions selectionnees
 * 
 * met a jour le state selectedversiondemethode
 * 
 * 
 * 
 * 
 * 
 * 
 * @param version version de methode
 */

const gerermultipleselection = (version) => {




  if (selectedversiondemethode.find(v => v.id === version.id)) {



    setselectedversiondemethode(


      selectedversiondemethode.filter(v => v.id !== version.id)
    );


  }
  
  
  
  
  
  else {


    setselectedversiondemethode([...selectedversiondemethode, version]);


  }





};






















/**
 * 
 * 
 * associe une pratique avec une ou plusieurs versions de methode
 *
 * 
 * 
 * @async
 * 
 * 
 * 
 * @function associerpratiquemethode
 * 
 * verifie quune pratique et au moins une version de methode sont selectionnees
 * 
 * envoie une requete post vers practicemethod avec lid de la pratique et la liste des ids des versions de methode
 * 
 * 
 * ferme le modal dassociation apres succes
 * 
 * 
 * capture les erreurs si elles surviennent
 */


const associerpratiquemethode = async () => {



  if (!selectpratiqueversion || selectedversiondemethode.length === 0) {


    
    return;




  }










  try {



    await fetch('http://localhost:5000/practiceMethod', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        practiceVersionId: selectpratiqueversion.id,
        methodVersionIds: selectedversiondemethode.map(v => v.id)
      })
    });





    setshowasspratiquemethode(false);


    
  } catch (err) {



   // console.error(err);




  }
};





















































useEffect(() => {


/**
 * 
 * 
 * recupere les types de methode depuis lapi
 *
 * 
 * 
 * 
 * @async
 * 
 * 
 * 
 * 
 * @function fetchmethodtypes
 * 
 * envoie une requete get vers methodtypes
 * 
 * met a jour le state methodtypes avec les donnees recues
 * 
 * initialise le type de la nouvelle methode si la liste nest pas vide
 * 
 * 
 * 
 * capture les erreurs si elles surviennent
 */
  const fetchmethodtypes = async () => {

    try {


      const res = await fetch('http://localhost:5000/methodtypes');
      const data = await res.json();
      setmethodtypes(data);

    


      if (data.length > 0) {
        setnouveaumethod(m => ({ ...m, typeId: data[0].id }));
      }




    } catch (err) {


//console.log(err);

     



    }
  };



  fetchmethodtypes();
}, []);











useEffect(() => {


/**
 * 
 * 
 * recupere les methodes depuis lapi
 * 
 * 
 *
 * @async
 * 
 * 
 * 
 * @function fetchmethods
 * 
 * 
 * 
 * envoie une requete get vers methods
 * 
 * 
 * met a jour le state methods avec les donnees recues
 * 
 * 
 * 
 * initialise lid de la nouvelle version de methode si la liste nest pas vide
 */



  const fetchMethods = async () => {



    const res = await fetch('http://localhost:5000/methods');

    const data = await res.json();

    setmethods(data);

    if (data.length > 0) {


      setnewmethodversion(v => ({ ...v, methodId: data[0].id }));





    }
  };






  fetchMethods();




}, []);







useEffect(() => {

/**
 * 
 * 
 * recupere les univers depuis lapi
 *
 * 
 * 
 * 
 * @async
 * 
 * 
 * 
 * @function fetchuniver
 * 
 * 
 * 
 * 
 * 
 * envoie une requete get vers universes
 * 
 * 
 * met a jour le state univers avec les donnees recues
 * 
 * 
 * initialise lid de lunivers pour la nouvelle version de methode si la liste nest pas vide
 * 
 * 
 * 
 */

  const fetchuniver = async () => {



    const res = await fetch('http://localhost:5000/universes');
    const data = await res.json();

    setunivers(data);



    if (data.length > 0) {

      setnewmethodversion(v => ({ ...v, universeId: data[0].id }));
    }
  };

  fetchuniver();
}, []);










const creerversionpourmethode = async () => {





  try {





    await fetch('http://localhost:5000/methodVersion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newmethodversion,
        methodId: Number(newmethodversion.methodId),
        universeId: Number(newmethodversion.universeId)
      })
    });




    setformmethodeversion(false);



    setnewmethodversion({
      methodId: '',
      universeId: '',
      versionName: '',
      changeDescription: '',
      lastUpdateById: 1
    });






  } catch (err) {








   // console.error(err);



  }
};




  

/**
 * 
 * 
 * 
 * charge toutes les versions de pratiques dune team
 * 
 * 
 *
 * @async
 * 
 * 
 * 
 * @function loadallversions
 * 
 * 
 * 
 * envoie une requete get vers teams practiceversions avec lid de la team
 * 
 * 
 * met a jour le state allversion avec les donnees recues
 * 
 * 
 * affiche le modal dassociation
 * 
 * 
 * capture les erreurs si elles surviennent
 */

const loadallversions = async () => {



  try {
    const response = await fetch(`http://localhost:5000/teams/${teamId}/practiceversions`);
    const data = await response.json();
    setallversion(data);
    setshowassoc(true);








  } catch (error) {



  }
};



















/**
 * 
 * 
 * 
 * 
 * cree une nouvelle methode
 *
 * 
 * 
 * 
 * 
 * @async
 * 
 * 
 * @function creermethode
 * 
 * envoie une requete post vers method avec les donnees de newmethod
 * 
 * 
 * 
 * ferme le modal de creation de methode apres succes
 * 
 * 
 * 
 * capture les erreurs si elles surviennent
 */
const creermethode = async () => {


  try {



    await fetch('http://localhost:5000/method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newmethod)
    });

    setcreermethode(false);
  



  





  } catch (err) {



   
  }


};








useEffect(() => {



/**
 * 
 * 
 * 
 * 
 * recupere les types dassociation de pratiques depuis lapi
 *
 * 
 * 
 * @async
 * 
 * 
 * 
 * 
 * @function fetchassociationtypes
 * 
 * 
 * envoie une requete get vers practiceassociationtypes
 * 
 * 
 * met a jour le state associationtypes avec les donnees recues
 * 
 * 
 * initialise lassociation selectionnee si la liste nest pas vide
 * 
 * 
 * 
 * capture les erreurs si elles surviennent
 */
  const fetchassociationtypes = async () => {

    try {


      const res = await fetch('http://localhost:5000/practiceAssociationTypes');

      const data = await res.json();

      setassociationtypes(data);

      if (data.length > 0) setassociattype(data[0].id);

    } catch (err) {




      console.error(err);



    }
  };

  fetchassociationtypes();
}, []);














/**
 * 
 * gere la selection des versions de pratique
 *
 * 
 * 
 * @function selectversions
 * 
 * verifie si la version est deja selectionnee
 * 
 * 
 * si oui la retire de la liste
 * 
 * 
 * sinon ajoute la version si le nombre de versions selectionnees est inferieur a deux
 * 
 * 
 * sinon affiche un message dalerte
 * 
 * 
 * met a jour le state selectedversion
 * 
 * 
 * 
 * 
 * @param version version de pratique
 */

const selectversions = (version) => {



  if (selectedversion.find(v => v.id === version.id)) {


    setselectedversion(selectedversion.filter(v => v.id !== version.id));


  } else {




    if (selectedversion.length < 2) {


      setselectedversion([...selectedversion, version]);


    } else {


      alert("Faut que 2 versions à la fois ");


    }
  }
};







/**
 * 
 * 
 * 
 * cree une association entre deux versions de pratique
 * 
 * 
 *
 * @async
 * 
 * 
 * 
 * @function createassocia
 * 
 * 
 * 
 * verifie que deux versions sont selectionnees sinon affiche un message dalerte
 * 
 * 
 * envoie une requete post vers practiceassociation avec lid des versions source et cible et lid du type dassociation
 * 
 * 
 * 
 * affiche un message de succes apres creation
 * 
 * 
 * reinitialise la liste des versions selectionnees
 * 
 * 
 * capture les erreurs si elles surviennent
 */
const createassocia = async () => {



  if (selectedversion.length !== 2) {



    alert("Sélectionnez deux versions ");
    return;
  }





  try {

    await fetch('http://localhost:5000/practiceAssociation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourcePracticeVersionId: selectedversion[0].id,
        targetPracticeVersionId: selectedversion[1].id,
        typeId: associationtype
      })
    });


    alert("Association créée ");

    setselectedversion([]);



  } catch (err) {
    
    console.error(err);
  }
};






  



useEffect(() => {




  const fetchpratiques = async () => {
    try {
      const response = await fetch(`http://localhost:5000/teams/${teamId}/pratiques`);
      const data = await response.json();
      setpratiques(data);





    } catch (error) {
      






    } finally {
      settelechargement(false);
    }
  };





  if (teamId) fetchpratiques();
}, [teamId]);



 useEffect(() => {
  const handleClickOutside = () => {
    setpracticeversioncontext({ visible: false, x: 0, y: 0, versionId: null });
  };
  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, []);








/**
 * 
 * 
 * charge les versions dune pratique
 *
 * 
 * 
 * 
 * @async
 * 
 * 
 * 
 * 
 * @function loadversions
 * 
 * 
 * envoie une requete get vers practices versions avec lid de la pratique
 * 
 * 
 * met a jour le state version avec les donnees recues
 * 
 * 
 * enregistre lid de la pratique selectionnee
 * 
 * 
 * 
 * 
 * 
 * 
 * @param practiceid identifiant de la pratique
 */

   const loadversions = async (practiceId) => {



    const response = await fetch(`http://localhost:5000/practices/${practiceId}/versions`);

    const data = await response.json();

    setversion(data);


    setselectedpract(practiceId);
  };






  if (telechargement) return <p>Chargement ....</p>;



 


/**
 * 
 * 
 * charge les items du survey actif
 *
 * 
 * 
 * @async
 * 
 * 
 * 
 * 
 * @function loadsurveyitems
 * 
 * 
 * envoie une requete get vers affinitysurvey active
 * 
 * 
 * met a jour le state avaitem avec les donnees recues
 * 
 * 
 * 
 * capture les erreurs si elles surviennent
 */
const loadSurveyItems = async () => {
  try {
    const res = await fetch('http://localhost:5000/affinitySurvey/active');
    const data = await res.json();
    setavaitem(data);
  } catch (err) {
    console.error(err);
  }
};





   return (



    <div className="practices-contain">
      <h1>Toutes les pratiques</h1>


      <div className="header-bar">
 {user?.roleId === 1 && (
      <div className="header-bar">
        <button className="associer-btn" onClick={loadallversions}>
          Associer Les versions
        </button>

        <button
          className="associer-btn"
          onClick={() => setcreermethode(true)}
        >
          Créer une méthode
        </button>

        <button
          className="associer-btn"
          onClick={() => setformmethodeversion(true)}
        >
          Ajouter une version
        </button>

        <button
          className="associer-btn"
          onClick={gererstates}
        >
          Associer pratique methode
        </button>
      </div>
    )}







</div>








      <div className="practice-grille">
        {pratiques.map((p) => (
          <div
            key={p.id}
            onClick={() => loadversions(p.id)}
            className={`practicecarte ${selectedpractice === p.id ? 'selected' : ''}`}
          >
            <h2>{p.name}</h2>
            <p>{p.description}</p>
            <small>type : {p.type}</small>
          </div>
        ))}
      </div>

      {versions.length > 0 && (
        <div className="versioncontain">
          <h2>Versions de la pratique</h2>
          {versions.map((v) => (
            <div
  key={v.id}
  className="versioncarte"
  onClick={() => navigate(`/espace-travail/${v.id}`)}
  onContextMenu={(e) => {
    e.preventDefault();
    e.stopPropagation();




    if (user?.roleId === 1) {  
      setpracticeversioncontext({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        versionId: v.id
      });
    }






  }}
  style={{ cursor: "pointer" }}
>
  <strong>{v.versionname}</strong><br />
  <small>Univers : {v.universe}</small><br />
  <em>{v.changedescription}</em>
</div>

          ))}
        </div>
      )}



     
{practiceversioncontext.visible && (



  <div className="context-menu"  
  
  
  
  style={{
      position: 'fixed',
      left: practiceversioncontext.x,
      top: practiceversioncontext.y,
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '8px',
      zIndex: 1000
    }} 
    
    
    
    onClick={(e) => e.stopPropagation()}>





    <div className="context-menu-item" onClick={() => {




      setpracticeversioncontext({ visible: false, x: 0, y: 0, versionId: null });



      loadSurveyItems();



      setafflinkmod({
        open: true,
        selectedItems: [],
        versionId: practiceversioncontext.versionId
      });








    }}>




      Lier à des items de questionnaire



    </div>










    <div className="context-menu-item" onClick={() => {







      setpracticeversioncontext({ 
        
        
        
        
        
        
        
        visible: false, x: 0, y: 0, versionId: null });










      loadlinkeditem(practiceversioncontext.versionId);














    }}>
      Voir les items liés
    </div>









    <div className="context-menu-item" onClick={() => {



      setpracticeversioncontext({ visible: false, x: 0, y: 0, versionId: null });



      loadmemscores(practiceversioncontext.versionId);


    }}>


      Voir les scores des membres
    </div>







  </div>
)}
















{affinitymodel.open && (








  <div className="modalover" onClick={() => setafflinkmod({ open: false, selectedItems: [], versionId: null })}>



    <div className="modalcontent" onClick={e => e.stopPropagation()}>



      <h3>Lier des items de questionnaire à cette version</h3>





      <div style={{
        
        
        
        
        
        
        maxHeight: '300px', overflowY: 'auto' 
        
        
        
        
        
        
        
        
        }}>






        {availableitem.map(item => (
          <div key={item.versionid} style={{ margin: '5px 0' }}>
            <label>
              <input
                type="checkbox"
                checked={affinitymodel.selectedItems.includes(item.versionid)}
                onChange={(e) => {
                  const newSelected = e.target.checked
                    ? [...affinitymodel.selectedItems, item.versionid]
                    : affinitymodel.selectedItems.filter(id => id !== item.versionid);
                  setafflinkmod({ ...affinitymodel, selectedItems: newSelected });
                }}
              />
              {item.content} (v{item.version})
            </label>
          </div>
        ))}


















      </div>



      <div className="modal-buttons">




        <button onClick={async () => {





          try {

            const promises = affinitymodel.selectedItems.map(itemId =>
              fetch('http://localhost:5000/affinityPractice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  itemId: itemId,
                  practiceVersionId: affinitymodel.versionId,
                  x: 0,
                  y: 0
                })
              })
            );
            await Promise.all(promises);
            alert('Liaisons enregistrées');
            setafflinkmod({ open: false, selectedItems: [], versionId: null });
          } 
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          catch (err) {














          }
        }}>Valider</button>








        <button onClick={() => setafflinkmod({ open: false, selectedItems: [], versionId: null })}>Annuler</button>







      </div>
    </div>
  </div>
)}

















    {showassoc && (






  <div className="modalover" onClick={() => setshowassoc(false)}>


    <div className="modalcontent" onClick={(e) => e.stopPropagation()}>


      <div className="modalheader">


        <h2>Toutes les versions des pratiques</h2>



        <button className="fermer-btn" onClick={() => setshowassoc(false)}>X</button>



      </div>

      <div>
        <label>Type d'association :</label>
        <select
          value={associationtype}
          onChange={(e) => setassociattype(Number(e.target.value))}
        >
          {asociationtype.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>








      <div className="versions-grille">
        {allversion.map((v) => (
          <div
            key={v.id}
            className={`versioncarte2 ${selectedversion.find(sv => sv.id === v.id) ? 'selected-version' : ''}`}
            onClick={() => selectversions(v)}
          >
            <strong>{v.practicename}</strong><br />
            <span>Version : {v.versionname}</span><br />
            <small>Univers : {v.universe}</small><br />
            <em>{v.changedescription}</em>
          </div>
        ))}
      </div>











      <button className="boutton_associer" onClick={createassocia}>Associer les versions</button>
    </div>
  </div>
)}



















{showformmethod && (


  <div className="modalover" onClick={() => setcreermethode(false)}>


    <div className="modalcontent" onClick={e => e.stopPropagation()}>



      <h2>Créer une méthode</h2>

      <input

        placeholder="Nom"

        value={newmethod.name}

        onChange={e => setnouveaumethod({ ...newmethod, name: e.target.value })}
      />

      <input
        placeholder="Objectif"
        value={newmethod.objective}
        onChange={e => setnouveaumethod({ ...newmethod, objective: e.target.value })}
      />


      <textarea
        placeholder="Description"
        value={newmethod.description}
        onChange={e => setnouveaumethod({ ...newmethod, description: e.target.value })}
      />



      <select
        value={newmethod.typeId}
        onChange={e => setnouveaumethod({ ...newmethod, typeId: e.target.value })}
      >




        {methodetype.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>


      <button onClick={creermethode}>Créer</button>
    </div>
  </div>
)}










{showformmethodversion && (




  <div className="modalover" onClick={() => setformmethodeversion(false)}>

    <div className="modalcontent" onClick={e => e.stopPropagation()}>


      <h2>Ajouter une version à une méthode</h2>




      <label>Méthode</label>

      <select
        value={newmethodversion.methodId}
        onChange={e =>
          setnewmethodversion({ ...newmethodversion, methodId: e.target.value })
        }
      >


        {methods.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>




      <label>Univers</label>


      <select
        value={newmethodversion.universeId}
        onChange={e =>
          setnewmethodversion({ ...newmethodversion, universeId: e.target.value })
        }


      >



        {universes.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>




      <input
        placeholder="Nom de la version"
        value={newmethodversion.versionName}
        onChange={e =>
          setnewmethodversion({ ...newmethodversion, versionName: e.target.value })
        }
      />




      <textarea
        placeholder="Description des changements"
        value={newmethodversion.changeDescription}
        onChange={e =>
          setnewmethodversion({ ...newmethodversion, changeDescription: e.target.value })
        }
      />





      <button onClick={creerversionpourmethode}>


        Ajouter la version
      </button>
    </div>
  </div>
)}


























{showlinkeditemmodal && (






  <div className="modalover"
  
  onClick={() => setshowlinkeditemmodal(false)}>








    <div className="modalcontent"
    
    
    onClick={e => e.stopPropagation()}>





      <h3>Items de questionnaire liés à cette version</h3>




      {linkeditem.length === 0 ? (
        <p>Aucun item lié. L'expert doit d'abord lier des items.</p>
      )
      
      
      
      
      
      
      
      
      
      
      
      : (
        <ul>
          {linkeditem.map(item => (
            <li key={item.itemid}>
              <strong>{item.content}</strong> (v{item.version})
              {item.description && <p>{item.description}</p>}
            </li>
          ))}
        </ul>
      )}











      <button onClick={() => setshowlinkeditemmodal(false)}>Fermer</button>




    </div>
  </div>
)}








{showscoremod && (





  <div className="modalover"
  
  
  onClick={() => setshowscoremod(false)}>



    <div className="modalcontent" 
    
    
    
    
    
    onClick={e => e.stopPropagation()}>








      <h3>Scores des membres pour cette version</h3>


      
      {loadscores ? (
        <p>Calcul en cours...</p>
      ) : memscore.length === 0 ? (
        <p>Aucun score disponible (peut-être aucun item lié ou aucun membre n'a répondu).</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Membre</th>
              <th>Email</th>
              <th>Score moyen (1-5)</th>
            </tr>
          </thead>
          <tbody>
            {memscore.map(m => (
              <tr key={m.memberId}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.averageScore !== null ? m.averageScore.toFixed(2) : 'Aucune réponse'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}














      <button onClick={() => setshowscoremod(false)}>Fermer</button>









    </div>
  </div>
)}













{showassocierpratiquemethode && (



  <div className="modalover" onClick={() => setshowasspratiquemethode(false)}>


    <div className="modalcontent large" onClick={e => e.stopPropagation()}>



      <h2>Associer pratique a methode </h2>








      <div className="triple-column">













        <div>


          <h3>Versions pratiques</h3>
          {pratiqueversion.map(v => (
            <div
              key={v.id}
              className={`versioncarte2 ${
                selectpratiqueversion?.id === v.id ? 'selected-version' : ''
              }`}
              onClick={() => setselectedpracticeversion(v)}


            >
              <strong>{v.practicename}</strong><br />
              <small>{v.versionname} – {v.universe}</small>
            </div>
          ))}
        </div>













        <div>
          <h3>Méthodes</h3>
          {methods.map(m => (
            <div
              key={m.id}
              className={`versioncarte2 ${
                selectedmethod?.id === m.id ? 'selected-version' : ''
              }`}
              onClick={() => loadmethodeversion(m)}
            >
              {m.name}
            </div>
          ))}
        </div>

       








        <div>
          <h3>Versions méthode</h3>
          {methodversion.map(v => (
            <div
              key={v.id}
              className={`versioncarte2 ${
                selectedversiondemethode.find(mv => mv.id === v.id)
                  ? 'selected-version'
                  : ''
              }`}
              onClick={() => gerermultipleselection(v)}
            >

              <strong>{v.versionname}</strong><br />
              <small>{v.universe}</small>
            </div>
          ))}
        </div>

      </div>

      <button className="boutton_associer" onClick={associerpratiquemethode}>
        Associer
      </button>
    </div>
  </div>
)}











    </div>




  );

};












export default Practices;
