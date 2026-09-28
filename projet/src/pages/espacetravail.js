/**
 * @fileoverview composant react représentant l'espace de travail interactif d'une version de pratique
 * 
 * 
 * 
 *
 * ce composant constitue le cœur de l'application il affiche une zone de travail canvas
 * sur laquelle le user peut glisser déposer repositionner et supprimer des éléments
 * représentant les composants d'une pratique : activités, rôles, goals,
 * métriques, guidelines, pitfalls, benefits, contextes, critères de complétion,
 * recommandations, versions de méthode, pratiques associées, membres et affinités
 * 
 * 
 * 
 *
 * fonctionnalités principales :
 * 
 * - Chargement de tous les composants de la version de pratique depuis l'api au montage
 * 
 * - Glisser déposer des pièces avec sauvegarde automatique des positions en base
 * 
 * - Création de nouveaux éléments via un formulaire modal contextuel selon le type de pièce
 * 
 * - Suppression d'un élément par double clic avec confirmation
 * 
 * - Affichage de liens SVG entre la carte de pratique et les pièces liées
 * 
 * - Tooltips détaillés au survol de chaque pièce
 * 
 * - Menus contextuels (clic droit) pour actions avancées : ajout d'indicateurs de contexte
 *   liens recommendation == > contexte/goal gestion du profil Big Five des membres,
 *   définition du type de guideline, saisie d'affinité
 * 
 * 
 * - Verrouillage de session via localstorage pour empêcher l'édition simultanée
 * 
 * - Export de la zone de travail en image png via html2canvas 
 * 
 *
 * @module EspaceTravail
 *
 * @requires react
 * @requires react-router-dom
 * @requires html2canvas
 *
 * @param {Object} props - Aucune prop directe  le composant lit practiceVersionId depuis les params d'url 
 *
 */





















import React, { useState, useRef, useEffect } from 'react';
import '../styles/espacetravail.css';
import { useParams } from 'react-router-dom';

import html2canvas from 'html2canvas';














const EspaceTravail = () => {



const pieceref = useRef({});




const lastdepospiecref = useRef(null);




const lastdepoaffiniref = useRef(null);

const lastdeporecomref = useRef(null);

const lastdepocontextref = useRef(null);

const lastdepometricref = useRef(null);


const lastdepogoalref = useRef(null);


const [methodVersions, setMethodVersions] = useState([]);



const lastdepobenefitref = useRef(null);



const lastdepoactivityref = useRef(null);



const lastdepopitfallref = useRef(null);



const lastdeporoleref = useRef(null);


const lastdepoguidelineref = useRef(null);

const lastdepoworkproductref = useRef(null);








const lastdepocompletionref = useRef(null);




const [pieces, setpieces] = useState([]);
const piecesRef = useRef(pieces);           


const [affinitycontextmenu, setaffinitycontext] = useState({ visible: false, x: 0, y: 0, piece: null });




const [affinityresultmod, setaffresultmod] = useState({ open: false, pieceid: null, versionid: null });


const [affinityresul, setaffinityres] = useState('');




const [guidelinecontextmen, setguidelinecontmen] = useState({ visible: false, x: 0, y: 0, piece: null });




const [guidelinetypemod, setguidelinetypemod] = useState({ open: false, guideline: null });


const [guidelinetype, setguidelinetypes] = useState([]);



const [guidelinetypeform, setguidelinetypeform] = useState({ selectedtypeid: '', newname: '', newdesription: '' });





const [linkcontextdialog, setlinkcontextdialog] = useState({ open: false, contextId: null });




const [memaffmodal, setmemaffmodal] = useState({ open: false, member: null });



const [memaffvalue, setmemaffvalue] = useState('');



const impacttypes = {

  1: 'Helpful (+)',

  2: 'Harmful (-)',


  3: 'Neutral (0)',


  4: 'Helpful if customized (C)'


};














const statustypes = {


  1: 'Proposed',


  2: 'Accepted',


  3: 'Rejected'



};






const [existingGoals, setExistingGoals] = useState([]);
const [selectedExistingGoalId, setSelectedExistingGoalId] = useState('');
const [goalChoice, setGoalChoice] = useState('create'); 




  const [pieceselecte, setpieceselecte] = useState(null);



  const [souris, position_souris] = useState({ x: 0, y: 0 });



  const [modalouvert, setmodalouvert] = useState(false);



  const [formvalue, setformvalue] = useState({});


  const zonetravail = useRef(null);



  const [recomlink, setlinkforrecom] = useState([]);
  

  


const [dargpiece, setdragpieceid] = useState(null);




const [dragoffs, setdragoff] = useState({ x: 0, y: 0 });




const [dragtrue, setdragtrue] = useState(false);











  const [practiceversion, setpracticeversion] = useState(null);




const practicecard = useRef(null);




const [practicliens, setpracticeliens] = useState([]);













  const [showpieces, setshowpieces] = useState(false);





 const [linkgoaldialog, setlinkgoaldialog] = useState({ open: false, goalId: null });


  const [selectrecommendationid, setselectedrecommendationid] = useState('');






 
const [tooltip, settool] = useState({
  visible: false,
  piece: null,
  x: 0,
  y: 0
});





























const [membrecontextmenu, setmemcontextmenu] = useState({ visible: false, x: 0, y: 0, member: null });


const [bfprofilemoda, setbfprofilemod] = useState({ open: false, memberid: null, profileexist: null });





const [bfprofileform, setbfprofileform] = useState({ o: '', c: '', e: '', a: '', n: '', statusId: '' });



const [statmod, setstatmod] = useState({ open: false, membid: null, existbfprofile: null, currentstatuid: null, newstatuid: '' });





const [bfprofstatu, setbefprofstatu] = useState([]);











useEffect(() => {


/**
 * 
 * 
 * 
 * recupere le statut du profil bf depuis lapi
 *
 * @async
 * @function fetchstatu
 * 
 * 
 * envoie une requete get vers bfprofilestatus
 * 
 * 
 * si la reponse est ok met a jour le state befprofstatu avec les donnees recues
 *  capture les erreurs si elles surviennent
 */

  const fetchstatu = async () => {



    try {


      const res = await fetch('http://localhost:5000/bfProfileStatus');
      if (res.ok) {
        const data = await res.json();
        setbefprofstatu(data);
      }



    } catch (err) {





    }
  };



  fetchstatu();
}, []);




useEffect(() => {


  /**
 * recupere les versions des methodes depuis l'api
 *
 * @async
 * 
 * @function fetchmethodversions
 * envoie une requete get vers methodversions
 * 
 * si la reponse est ok met a jour le state methodversions avec les donnees recues
 * 
 * capture les erreurs si elles surviennent
 */

  const fetchMethodVersions = async () => {
    try {
      const res = await fetch('http://localhost:5000/methodversions');
      if (res.ok) {
        const data = await res.json();
        setMethodVersions(data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  fetchMethodVersions();
}, []);





/**
 * gere le survol de la souris sur une piece
 * 
 * 
 *
 * @function gerersourisentrer
 * 
 * recupere la position de lelement survole
 * 
 * met a jour le state tool pour afficher linfo bulle avec la piece et les coordonnees
 * 
 * 
 * @param piece la piece survole
 * 
 * @param e evenement de la souris
 */

const gerersourisentrer = (piece, e) => {
  
 


  const rect = e.currentTarget.getBoundingClientRect();




  settool({
    visible: true,
    piece,
    x: rect.right + 5,   
    y: rect.top
  });

};





/**
 * 
 * 
 * gere la sortie de la souris d'une piece
 *
 * @function gerersourisquit
 * 
 * met a jour le state tool pour masquer linfo bulle et reinitialiser les coordonnees et la piece
 * 
 * 
 */

const gerersourisquit = () => {


  settool({ visible: false, piece: null, x: 0, y: 0 });



};







const user = JSON.parse(localStorage.getItem("user"));





const [contextindic, setcontextindic] = useState({});



const [roleUseTypes, setRoleUseTypes] = useState([]);



const [contextformm, setcontextmenu] = useState({
  visible: false,
  x: 0,
  y: 0,
  contextId: null
});



const [indicateurmodal, setindicateurmodal] = useState({
  ouvert: false,
  contextId: null
});


const [indicatorForm, setindicateur] = useState({
  name: '',
  description: '',
  attributes: '',
  precision: '',
  value: ''
});





const [affinityresultliens, setaffresultliens] = useState([]);











  
  const { practiceVersionId: practiceversionid } = useParams();




  
  const practiceversionidnum = parseInt(practiceversionid, 10);


/**
 * 
 * 
 * 
 * gere le clic droit sur une piece pour afficher la guideline
 *
 * @function gererguidelinedroitclic
 * 
 * empeche le comportement par defaut et la propagation de levenement
 * 
 * met a jour le state guidelinecontmen pour afficher le menu avec les coordonnees et la piece
 * 
 * 
 * @param e evenement de la souris
 * 
 * 
 * @param piece piece cible du clic droit
 */
const gererguidelinedroitclic = (e, piece) => {



  e.preventDefault();
  e.stopPropagation();



  setguidelinecontmen({
    visible: true,
    x: e.clientX,
    y: e.clientY,
    piece
  });




};







useEffect(() => {


  const fetchguidelinetypes = async () => {



    try {



      const res = await fetch('http://localhost:5000/guidelineTypes');
      if (res.ok) {
        const data = await res.json();
        setguidelinetypes(data);
      }
    } catch (err) {



      
    }
  };




  fetchguidelinetypes();
}, []);






useEffect(() => {
  const fetchRoleUseTypes = async () => {
    try {
      const res = await fetch('http://localhost:5000/roleusetypes');
      if (res.ok) {
        const data = await res.json();
        setRoleUseTypes(data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  fetchRoleUseTypes();
}, []);







  useEffect(() => {

  const gerecliquedehors = () => {


    setcontextmenu({ visible: false, x: 0, y: 0, contextId: null });

    setmemcontextmenu({ visible: false, x: 0, y: 0, member: null });

    setaffinitycontext({ visible: false, x: 0, y: 0, piece: null });  


    setguidelinecontmen({ visible: false, x: 0, y: 0, piece: null });





  };
  document.addEventListener('click', gerecliquedehors);

  return () => document.removeEventListener('click', gerecliquedehors);

}, []);










  useEffect(() => {
  if (!practiceversionidnum) return;












  const fetchcomposents = async () => {



    try {




const resaff = await fetch(
  `http://localhost:5000/practiceVersion/${practiceversionidnum}/affinities`
);




const dataaff = await resaff.json();


const loadaff = dataaff.map(aff => ({

  id: `affinity-${aff.versionid}`,        
  originalId: aff.versionid,                
  type: 'affinity',
  couleur: '#FFA07A',                      
  content: aff.content,
  description: aff.description,
  comment: aff.comment,
  version: aff.version,
  versionnote: aff.versionNote,
 



  x: 200 + Math.random() * 100,

  y: 100 + Math.random() * 100


}));







      
  const respratique = await fetch(
  `http://localhost:5000/practiceVersion/${practiceversionidnum}`
);





const datapratique = await respratique.json();




setpracticeversion(datapratique);










let memberpiece = [];




if (datapratique.teamid) {





  const resmemeb = await fetch(`http://localhost:5000/teams/${datapratique.teamid}/members`);




  if (resmemeb.ok) {




    const members = await resmemeb.json();

   
    let positionmap = {};



    try {



      const posres = await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/member-positions`);







      if (posres.ok) {



        const positions = await posres.json();



        positions.forEach(p => { positionmap[p.personid] = p; });




      }





    } catch (err) {








    }
   











    const profileprom = members.map(m =>
      fetch(`http://localhost:5000/bfProfile?personId=${m.id}`).then(res =>
        res.ok ? res.json() : null
      )
    );




    const profresult = await Promise.all(profileprom);



    const profmap = {};





    members.forEach((m, index) => {
      profmap[m.id] = profresult[index] || null;
    });





    memberpiece = members.map((member, index) => ({
      id: `member-${member.id}`,
      originalId: member.id,
      type: 'member',
      couleur: '#9B59B6',
      name: member.name,
      email: member.email,
      bfProfile: profmap[member.id],
     
      x: positionmap[member.id] ? positionmap[member.id].x : 100,
      y: positionmap[member.id] ? positionmap[member.id].y : 50 + index * 70
    }));



  }




}








      const resactivity = await fetch(
        `http://localhost:5000/practiceVersion/${practiceversionidnum}/activities`
      );

      const data_activity = await resactivity.json();

      const loadactivity = data_activity.map(a => ({
        id: a.id,                 
        type: 'activity',
        couleur: '#FF6B6B',
        name: a.name,
        description: a.description,
        x: a.x,
        y: a.y,
        sequence: a.sequence 
      }));
    




      const resgole = await fetch(
        `http://localhost:5000/practiceVersion/${practiceversionidnum}/goals`
      );
      const datagoal = await resgole.json();




      const loadgoal = datagoal.map(g => ({

        id: g.id,
        type: 'goal',
        couleur: '#96CEB4',
        name: g.name,
        description: g.description,
        x: g.x,
        y: g.y

      }));







      const resrole = await fetch(
        `http://localhost:5000/practiceVersion/${practiceversionidnum}/roles`
      );
      const datarole = await resrole.json();

      const loadrole = datarole.map(r => ({
        id: r.id,
        type: 'role',
        couleur: '#4D96FF',
        name: r.name,
        description: r.description,
        typeId: r.typeid,
        x: r.x,
        y: r.y
      }));






       const reswork = await fetch(
        `http://localhost:5000/practiceVersion/${practiceversionidnum}/workproduct`
      );
      const datawork = await reswork.json();

      const loadwork = datawork.map(r => ({
        id: r.id,
        type: 'workproduct',
        couleur: '#4D96FF',
        name: r.name,
        description: r.description,
        x: r.x,
        y: r.y
      }));








        const resmetric = await fetch(
        `http://localhost:5000/practiceVersion/${practiceversionidnum}/metric`
      );
      const datametric = await resmetric.json();

      const loadmetric = datametric.map(r => ({
        id: r.id,
        type: 'metric',
        couleur: '#4D96FF',
        name: r.name,
        description: r.description,
        x: r.x,
        y: r.y
      }));















       const resguide = await fetch(
        `http://localhost:5000/practiceVersion/${practiceversionidnum}/guideline`
      );
      const dataguide = await resguide.json();

      const loadguide = dataguide.map(r => ({
        id: r.id,
        type: 'guideline',
        couleur: '#4D96FF',
        name: r.name,
        description: r.description,
         typeId: r.typeid, 
        x: r.x,
        y: r.y
      }));






        const respit = await fetch(
        `http://localhost:5000/practiceVersion/${practiceversionidnum}/pitfall`
      );
      const datapit = await respit.json();

      const loadpit = datapit.map(r => ({
        id: r.id,
        type: 'pitfall',
        couleur: '#4D96FF',
        name: r.name,
        description: r.description,
        x: r.x,
        y: r.y
      }));

      












      
        const resbenefit = await fetch(
        `http://localhost:5000/practiceVersion/${practiceversionidnum}/benefit`
      );
      const databenefit = await resbenefit.json();

      const loadbenefit = databenefit.map(r => ({
        id: r.id,
        type: 'benefit',
        couleur: '#4D96FF',
        name: r.name,
        description: r.description,
        x: r.x,
        y: r.y
      }));






  
        const rescontext = await fetch(
        `http://localhost:5000/practiceVersion/${practiceversionidnum}/context`
      );
      const datacontext = await rescontext.json();

      const loadcontext = datacontext.map(r => ({
        id: r.id,
        type: 'context',
        couleur: '#4D96FF',
        name: r.name,
        description: r.description,
        x: r.x,
        y: r.y
      }));


















      

      const resindicator = await fetch('http://localhost:5000/contextindicator/all'); 



      const dataindicator = await resindicator.json();

      const indicatorbycontext = {};
                    dataindicator.forEach(ind => {
                               if (!indicatorbycontext[ind.contextid]) {
                                                indicatorbycontext[ind.contextid] = [];
                                      }
                                indicatorbycontext[ind.contextid].push(ind);
                                  });
  
  
    
             setcontextindic(indicatorbycontext);



    




   const rescompletion = await fetch(
        `http://localhost:5000/practiceVersion/${practiceversionidnum}/completioncriteria`
      );
      const datacompletion = await rescompletion.json();

      const loadcompletion = datacompletion.map(r => ({
        id: r.id,
        type: 'completion',
        couleur: '#4D96FF',
        name: r.name,
        description: r.description,
        x: r.x,
        y: r.y
      }));





















    const resrecommendation = await fetch(
        `http://localhost:5000/practiceVersion/${practiceversionidnum}/recommendations`
      );
      const datarecommendation = await resrecommendation.json();

      const loadrecommendation = datarecommendation.map(r => ({
        id: r.id,
        type: 'recommendation',
        couleur: '#4D96FF',
        name: r.name,
        description: r.description,
         typeId: r.typeid,    
  statusId: r.statusid, 
        x: r.x,
        y: r.y
      }));


     

const resmethodversions = await fetch(
  `http://localhost:5000/practiceVersion/${practiceversionidnum}/methodVersions`
);




const datamethodeversions = await resmethodversions.json();




const loadmethversions = datamethodeversions.map(mv => ({



  id: mv.id,
  type: 'methodversion',
  couleur: '#FFD700', 
  methodName: mv.methodName,     
  name: mv.versionName,         
  universe: mv.universe,        
  description: mv.changeDescription,
 





  x: mv.x || 300,
  y: mv.y || 200
}));



const respracticeassociation = await fetch(
  `http://localhost:5000/practiceVersion/${practiceversionidnum}/associations`
);








const datapracassoc = await respracticeassociation.json();




const loadpracasoc = datapracassoc.map(pa => ({



  id: pa.associatedPracticeVersionId,
  type: 'practiceversion-assoc',
  couleur: '#00CED1', 
  name: pa.versionname,
  description: pa.changedescription,
  universe: pa.universeName || '',
  x: pa.x || 300, 
  y: pa.y || 200



}));










const resmemaff = await fetch(
  `http://localhost:5000/practiceVersion/${practiceversionidnum}/personAffinities`
);




const memberaff = await resmemaff.json();




const affmap = {};


memberaff.forEach(a => { affmap[a.personid] = a.affinity; });





memberpiece = memberpiece.map(piece => ({
  ...piece,
  affinity: affmap[piece.originalId] || null



}));


let affinityPositionsMap = {};


try {


  const posres = await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/affinity-positions`);


  if (posres.ok) {


    const positions = await posres.json();

    positions.forEach(p => { affinityPositionsMap[p.affinityversionid] = p; });


  }
} catch (err) {



}





const loadaffwithpos = loadaff.map(aff => ({


  ...aff,
  x: affinityPositionsMap[aff.originalid] ? affinityPositionsMap[aff.originalid].x : aff.x,
  y: affinityPositionsMap[aff.originalid] ? affinityPositionsMap[aff.originalid].y : aff.y



}));






      setpieces([...loadactivity, ...loadgoal, ...loadrole,...loadwork, ...loadmetric, ...loadguide, ...loadpit, ...loadbenefit,
        ...loadcontext, ...loadcompletion, ...loadrecommendation,
  ...loadmethversions , ...loadpracasoc,
  ...memberpiece  ,
  ...loadaffwithpos,
 

      ]);
      







      const initpracticeliens = [
  ...loadactivity, ...loadgoal, ...loadrole, ...loadwork,
  ...loadmetric, ...loadguide, ...loadpit, ...loadcompletion,
  ...loadrecommendation, ...loadbenefit,
  ...loadmethversions , ...loadpracasoc,
  ...memberpiece,
 
]


  .filter(p =>  p.type !== 'context'&& p.type !== 'goal')
  .map(p => ({ from: 'practice-card', to: p.id }));

setpracticeliens(initpracticeliens);





      
      
const resgoal = await fetch(
  `http://localhost:5000/practiceVersion/${practiceversionidnum}/recommendation-goals`
);



const dataresgoal = await resgoal.json();





const linksgoal = dataresgoal.map(l => ({

  from: l.recommendationid,
  to: l.goalid,
  type: 'goal'


}));






const linkcontext = datarecommendation
  .filter(r => r.contextid)
  .map(r => ({
    from: r.id,
    to: r.contextid,
    type: 'context'
  }));



setlinkforrecom([...linksgoal, ...linkcontext]);



    


 


    } catch (err) {
      


    }
  };



  

  fetchcomposents();
}, [practiceversionidnum]);



  

  const pieces_pour_essay = [
    { id: 'activity', type: 'activity', couleur: '#FF6B6B', nom: 'Activity' },
    { id: 'role', type: 'role', couleur: '#4ECDC4', nom: 'Role' },
    { id: 'workproduct', type: 'workproduct', couleur: '#45B7D1', nom: 'Workproduct' },
    { id: 'goal', type: 'goal', couleur: '#96CEB4', nom: 'Goal' },
    { id: 'metric', type: 'metric', couleur: '#FFEAA7', nom: 'Metric' },


    { id: 'guideline', type: 'guideline', couleur: '#FFB347', nom: 'Guideline' },
  { id: 'pitfall', type: 'pitfall', couleur: '#FF6961', nom: 'Pitfall' },
  { id: 'benefit', type: 'benefit', couleur: '#77DD77', nom: 'Benefit' },


  { id: 'context', type: 'context', couleur: '#B19CD9', nom: 'Context' },

  { id: 'completioncriteria', type: 'completioncriteria', couleur: '#A29BFE', nom: 'Completion Criteria' },

  { id: 'recommendation', type: 'recommendation', couleur: '#F8C471', nom: 'Recommendation' },






  

    
  ];

  const prendre = (piece) => {
    setpieceselecte({ ...piece, x: 0, y: 0 });
  };


















  const gerermemclicdroit = (e, piece) => {



  e.preventDefault();
  e.stopPropagation();
  setmemcontextmenu({
    visible: true,
    x: e.clientX,
    y: e.clientY,
    member: piece



  });
};





  const deposer = (e) => {
    if (dragtrue) {
    setdragtrue(false);
    return;
  }

    if (!pieceselecte || !zonetravail.current) return;

    const rect = zonetravail.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let initialform = { name: '', description: '' };





    if (pieceselecte.type === 'context') {
  initialform = { 
    description: '',
    newIndicatorName: '',
    newIndicatorDescription: '',
    newIndicatorAttributes: '',
    newIndicatorPrecision: '',
    newIndicatorValue: ''
  };
}




  if (pieceselecte.type === 'goal') {
   
    if (existingGoals.length === 0) {


      fetch('http://localhost:5000/goals')


        .then(res => res.json())


        .then(data => setExistingGoals(data))


        .catch(err => console.error(err));




    }
   
  }




    if (pieceselecte.type === 'activity') {
  initialform = { name: '', description: '', sequence: '' };
}


    if (pieceselecte.type === 'metric') {
      initialform = { name: '', description: '', unit: '', scale: '', formula: '' };
    }


    if (pieceselecte.type === 'role') {
  initialform = { name: '', description: '', typeId: '' };
}


if (pieceselecte.type === 'guideline') {
  initialform = { name: '', description: '', content: '', methodVersionId: '', typeId: '' };
}


    if (pieceselecte.type === 'recommendation') {


  initialform = {
    description: '',
    typeId: '',
    statusId: '',
    contextId: '',
    lastUpdateById: 1,
    goals: [],
    newContextDescription:'' ,
     newGoalName: '',      
    newGoalDescription: '' 

    


  };
}else if (pieceselecte.type === 'affinity') { 


    initialform = {
      name: '',            
      description: '',
      comment: '',
      version: 1,
      versionNote: ''


    };
  }






    setformvalue(initialform);
    
    setmodalouvert(true);


   
    setpieceselecte(p => ({ ...p, tempX: x - 25, tempY: y - 25 }));
  };








const gererlecliqdroit = (e, piece) => {


  e.preventDefault();
  



  if (piece.type === 'context') {

    setcontextmenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      contextId: piece.id
    });


  }


};







const gerercliquedroitrecommendation = (e, piece) => {



  e.preventDefault();
  
  
  
  if (piece.type === 'recommendation') {
    setcontextmenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      recommendationId: piece.id,
       type: 'recommendation' 
    });
  }




};












const openindicateur = () => {



  setindicateurmodal({




    ouvert: true,
    contextId: contextformm.contextId
  });




  setcontextmenu({ visible: false, x: 0, y: 0, contextId: null });



};








const gerersoumissionindicateur = async () => {



  if (!indicatorForm.name || !indicatorForm.value) {



    alert("nom , valeur obligatoire ::)");



    return;
  }







  try {




    const response = await fetch('http://localhost:5000/contextindicator', {



      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contextId: indicateurmodal.contextId,
        name: indicatorForm.name,
        description: indicatorForm.description,
        attributes: indicatorForm.attributes,
        precision: indicatorForm.precision,
        value: indicatorForm.value
      })



    });





    if (!response.ok) throw new Error(`erreur : ${response.status}`);

    const newindic = await response.json(); 



    setcontextindic(prev => {


      const contextId = indicateurmodal.contextId;
      const currentIndicators = prev[contextId] || [];
      return {
        ...prev,
        [contextId]: [...currentIndicators, newindic]


      };




    });


    


    setindicateur({ name: '', description: '', attributes: '', precision: '', value: '' });




    setindicateurmodal({ ouvert: false, contextId: null });



  } catch (error) {



  }
};



















const annulerajoutindic = () => {



  setindicateurmodal({ ouvert: false, contextId: null });


  setindicateur({ name: '', description: '', attributes: '', precision: '', value: '' });



};














const validerform = async () => {



 

  let endpoint = "";
  let body = {};
  
  


 if (pieceselecte.type === 'affinity') {



    try {
     



      const payload = {


        content: formvalue.name,          
        description: formvalue.description || null,

        comment: formvalue.comment || null
      };






      const ressurve = await fetch('http://localhost:5000/affinitySurvey', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });








      if (!ressurve.ok) throw new Error('err');


      const datasurv = await ressurve.json();


      const survid = datasurv.id;

      




      const versionpayloa = {


        itemId: survid,
        version: formvalue.version,
        versionNote: formvalue.versionNote || null



      };





      const resversion = await fetch('http://localhost:5000/affinitySurveyVersion', {



        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(versionpayloa)




      });





      if (!resversion.ok) throw new Error('err');

      const datavers = await resversion.json();

      const versiid = datavers.id;






      const pratiquepayloa = {


        itemId: versiid,
        practiceVersionId: practiceversionidnum,
  x: Math.round(pieceselecte.tempX),
  y: Math.round(pieceselecte.tempY)


      };




      const respratiquue = await fetch('http://localhost:5000/affinityPractice', {


        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pratiquepayloa)


      });



      if (!respratiquue.ok) throw new Error('err');






const nouvelle = {
  ...pieceselecte,
  id: `affinity-${versiid}`,       
  originalId: versiid,               
  x: pieceselecte.tempX,
  y: pieceselecte.tempY,
  content: formvalue.name,
  description: formvalue.description,
  comment: formvalue.comment,
  version: formvalue.version,
  versionNote: formvalue.versionNote
};









setpieces([...pieces, nouvelle]);
      setpracticeliens(prev => [...prev, { from: 'practice-card', to: nouvelle.id }]);

      setpieceselecte(null);
      setmodalouvert(false);
      return; 




    } catch (err) {






console.error('Erreur création affinitySurvey :', err);
    


      return;
    }
  }








  switch (pieceselecte.type) {
    
    case 'activity':
  if (!formvalue.sequence) {
    alert("La séquence est obligatoire");
    return;
  }
  endpoint = "http://localhost:5000/activity";
  body = {
    name: formvalue.name,
    description: formvalue.description,
    lastUpdateById: 1,
    practiceVersionId: practiceversionidnum,
    sequence: parseInt(formvalue.sequence, 10),
    x: pieceselecte.tempX,
    y: pieceselecte.tempY
  };
  break;



    case 'role':

      endpoint = "http://localhost:5000/role";
      
      body = {
        name: formvalue.name,
        description: formvalue.description,
        lastUpdateById: 1,
        practiceVersionId: practiceversionidnum,
         typeId: formvalue.typeId,
         sequence: pieces.length + 1,
        x: pieceselecte.tempX,
        y: pieceselecte.tempY
      };

      break;



    case 'workproduct':
      
    endpoint = "http://localhost:5000/workproduct";
      body = {
        name: formvalue.name,
        description: formvalue.description,
        lastUpdateById: 1,
        practiceVersionId: practiceversionidnum,
        sequence: pieces.length + 1,
        x: pieceselecte.tempX,
        y: pieceselecte.tempY
      };
      break;








    


    
      case 'goal': {
  if (goalChoice === 'create') {
    // --- Création d’un nouveau goal ---
    if (!formvalue.name) {
      alert("Le nom est obligatoire");
      return;
    }
    const endpoint = "http://localhost:5000/goal";
    const body = {
      name: formvalue.name,
      description: formvalue.description,
      practiceVersionId: practiceversionidnum,
      sequence: pieces.length + 1,
      x: Math.round(pieceselecte.tempX),
      y: Math.round(pieceselecte.tempY)
    };
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
      const data = await response.json();
      const goalId = data.goalId || data.id;

      const nouvellegoal = {
        ...pieceselecte,
        id: goalId,
        x: pieceselecte.tempX,
        y: pieceselecte.tempY,
        name: formvalue.name,
        description: formvalue.description,
      };

      setpieces(prev => [...prev, nouvellegoal]);
      setpieceselecte(null);
      setmodalouvert(false);
      setGoalChoice('create');
      setSelectedExistingGoalId('');

      // Proposer de lier à une recommandation si existante
      const existingrecom = pieces.filter(p => p.type === 'recommendation');
      if (existingrecom.length > 0) {
        setlinkgoaldialog({ open: true, goalId });
        setselectedrecommendationid('');
      }
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  } 
  else if (goalChoice === 'existing') {
    // --- Sélection d’un goal existant ---
    if (!selectedExistingGoalId) {
      alert("Veuillez sélectionner un goal");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/practiceVersion/${practiceversionidnum}/link-goal`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goalId: parseInt(selectedExistingGoalId, 10),
            x: Math.round(pieceselecte.tempX),
            y: Math.round(pieceselecte.tempY)
          })
        }
      );
      if (!response.ok) throw new Error('Erreur lors du lien du goal');

      const selectedGoal = existingGoals.find(g => g.id == selectedExistingGoalId);
      const nouvellegoal = {
        ...pieceselecte,
        id: parseInt(selectedExistingGoalId, 10),
        x: pieceselecte.tempX,
        y: pieceselecte.tempY,
        name: selectedGoal.name,
        description: selectedGoal.description,
      };

      setpieces(prev => [...prev, nouvellegoal]);
      setpieceselecte(null);
      setmodalouvert(false);
      setGoalChoice('create');
      setSelectedExistingGoalId('');

      // Proposer de lier à une recommandation
      const existingrecom = pieces.filter(p => p.type === 'recommendation');
      if (existingrecom.length > 0) {
        setlinkgoaldialog({ open: true, goalId: selectedGoal.id });
        setselectedrecommendationid('');
      }
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  }
  break; // ne sera jamais atteint à cause des return, mais laisse pour la cohérence
}








        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });




          if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

          const data = await response.json();



          const goalId = data.goalId || data.id;




          const nouvellegoal = {
            ...pieceselecte,
            id: goalId,
            x: pieceselecte.tempX,
            y: pieceselecte.tempY,
            name: formvalue.name,
            description: formvalue.description,
          };



          setpieces(prev => [...prev, nouvellegoal]);

          setpieceselecte(null);



          setmodalouvert(false);

       
          
          const existingrecom = pieces.filter(p => p.type === 'recommendation');



          if (existingrecom.length > 0) {



            setlinkgoaldialog({ open: true, goalId });


            setselectedrecommendationid('');



          }




          return; 



        } catch (err) {



         
          return;
        }
        break;
















    case 'metric':
      endpoint = "http://localhost:5000/metric";
      body = {
        name: formvalue.name,
        description: formvalue.description,
        unit: formvalue.unit,
        scale: formvalue.scale,
        formula: formvalue.formula,
        lastUpdateById: 1,
        practiceVersionId: practiceversionidnum,
         sequence: pieces.length + 1,
        x: pieceselecte.tempX,
        y: pieceselecte.tempY
      };
      break;














      case 'guideline':



  endpoint = "http://localhost:5000/guideline";



  body = {

    name: formvalue.name,
    description: formvalue.description,
    content: formvalue.content,
    lastUpdateById: 1,
    practiceVersionId: practiceversionidnum,
    methodVersionId: formvalue.methodVersionId || null,
    typeId: formvalue.typeId || null,
    sequence: pieces.length + 1,
    x: pieceselecte.tempX,
    y: pieceselecte.tempY
  };



  try {



    const response = await fetch(endpoint, {



      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)


    });



    if (!response.ok) throw new Error(`erreur : ${response.status}`);



    
    const data = await response.json();


    const guidelineId = data.guidelineId || data.id;


    
    
    const nouvelleGuideline = {



      ...pieceselecte,
      id: guidelineId,
      x: pieceselecte.tempX,
      y: pieceselecte.tempY,
      ...formvalue,
    };




    setpieces(prev => [...prev, nouvelleGuideline]);




    setpracticeliens(prev => [...prev, { from: 'practice-card', to: guidelineId }]);



    
    if (formvalue.methodVersionId) {
      const mvId = parseInt(formvalue.methodVersionId, 10);

    
      await fetch('http://localhost:5000/practiceMethod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practiceVersionId: practiceversionidnum,
          methodVersionIds: [mvId]
        })


      });




      
      const existinmv = pieces.find(p => p.id === mvId && p.type === 'methodversion');



      if (!existinmv) {



        
        const mvdata = methodVersions.find(mv => mv.id === mvId);



        if (mvdata) {




          const nouvelleMv = {


            
            id: mvdata.id,
            type: 'methodversion',
            couleur: '#FFD700',
            methodName: mvdata.methodname || mvdata.methodName || 'Méthode inconnue',
            name: mvdata.versionname || mvdata.versionName || '',
            universe: mvdata.universename || mvdata.universeName || mvdata.universe || '',
            description: mvdata.changedescription || mvdata.changeDescription || '',
            x: pieceselecte.tempX + 150, 
            y: pieceselecte.tempY,




          };



          setpieces(prev => [...prev, nouvelleMv]);




        } else {



          
        }
      }



      
      setlinkforrecom(prev => [...prev, { from: guidelineId, to: mvId, type: 'guideline-method' }]);
    }

    setpieceselecte(null);



    setmodalouvert(false);




    return
    
  } catch (err) {






















    return;
  }
  break;










      








    case 'pitfall':
      endpoint = "http://localhost:5000/pitfall";
      body = {
        name: formvalue.name,
        description: formvalue.description,
        content: formvalue.content,
        lastUpdateById: 1,
        practiceVersionId: practiceversionidnum,
         sequence: pieces.length + 1,
        x: pieceselecte.tempX,
        y: pieceselecte.tempY
      };
      break;







    case 'benefit':
      endpoint = "http://localhost:5000/benefit";
      body = {
        name: formvalue.name,
        description: formvalue.description,
        content: formvalue.content,
        lastUpdateById: 1,
        practiceVersionId: practiceversionidnum,

        sequence: pieces.length + 1,
        x: pieceselecte.tempX,
        y: pieceselecte.tempY


      };
      break;







     case 'context':


  endpoint = "http://localhost:5000/context";


  body = {


    description: formvalue.description,
    practiceVersionId: practiceversionidnum,
    x: Math.round(pieceselecte.tempX),
    y: Math.round(pieceselecte.tempY)




  };



  try {



    const response = await fetch(endpoint, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });



    
    if (!response.ok) throw new Error(`err : ${response.status}`);


    const data = await response.json();


    const contextId = data.id;



    const nouvelleContext = {

      ...pieceselecte,
      id: contextId,
      x: pieceselecte.tempX,
      y: pieceselecte.tempY,
      description: formvalue.description,

    };


    setpieces(prev => [...prev, nouvelleContext]);



    setpieceselecte(null);



    setmodalouvert(false);


    
    const existingrecom = pieces.filter(p => p.type === 'recommendation');


    if (existingrecom.length > 0) {


      setlinkcontextdialog({ open: true, contextId });



    }
    return; 





  } catch (err) {















    return;
  }
  break;









  case 'completioncriteria':
  endpoint = "http://localhost:5000/completioncriteria";
  body = {
    name: formvalue.name,
    description: formvalue.description,
    lastUpdateById: 1,
    practiceVersionId: practiceversionidnum,
    x: pieceselecte.tempX,
    y: pieceselecte.tempY
  };
  break;











case 'recommendation': {
 








  let finalcontextid = formvalue.contextId ? parseInt(formvalue.contextId, 10) : null;




  if (formvalue.newContextDescription && formvalue.newContextDescription.trim()) {




    try {



      const contextpayload = {


        description: formvalue.newContextDescription,
        practiceVersionId: practiceversionidnum,
        x: Math.round(pieceselecte.tempX + 50),
        y: Math.round(pieceselecte.tempY + 50)



      };



      const contextres = await fetch('http://localhost:5000/context', {


        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contextpayload)



      });



      if (!contextres.ok) throw new Error('erreurr');


      const contextdata = await contextres.json();



      finalcontextid = contextdata.id;






      const newcontextpiece = {
        id: contextdata.id,
        type: 'context',
        couleur: '#4D96FF',
        description: contextpayload.description,
        x: contextpayload.x,
        y: contextpayload.y
      };









      setpieces(prev => [...prev, newcontextpiece]);




    } catch (err) {















      return;
    }
  }







  let finalgoalsid = [...(formvalue.goals || [])];





  if (formvalue.newGoalName && formvalue.newGoalName.trim()) {




    try {




      const goalpayload = {




        name: formvalue.newGoalName,


        description: formvalue.newGoalDescription || '',



        practiceVersionId: practiceversionidnum,



        sequence: pieces.length + 1,


        x: Math.round(pieceselecte.tempX + 100),



        y: Math.round(pieceselecte.tempY + 50)



      };














      const goalres = await fetch('http://localhost:5000/goal', {



        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalpayload)



      });




      if (!goalres.ok) throw new Error('Err');






      const goaldata = await goalres.json();



      const newgoalid = goaldata.id;



      finalgoalsid.push(newgoalid);

      






      const newgoalpiece = {

        id: newgoalid,
        type: 'goal',
        couleur: '#96CEB4',
        name: goalpayload.name,
        description: goalpayload.description,
        x: goalpayload.x,
        y: goalpayload.y


      };



      setpieces(prev => [...prev, newgoalpiece]);



    } catch (err) {












      return;
    }
  }








  endpoint = "http://localhost:5000/recommendation";



  body = {
    description: formvalue.description,
    practiceVersionId: practiceversionidnum,
    contextId: finalcontextid,
    typeId: parseInt(formvalue.typeId, 10),
    statusId: parseInt(formvalue.statusId, 10),
    lastUpdateById: 1,
    x: Math.round(pieceselecte.tempX),
    y: Math.round(pieceselecte.tempY),
    goalIds: formvalue.goals || []
  };













  try {



    const response = await fetch(endpoint, {




      method: "POST",


      headers: { "Content-Type": "application/json" },


      body: JSON.stringify(body)



    });




    if (!response.ok) throw new Error(`erreurhttp : ${response.status}`);


    const data = await response.json();



    const recommendationId = data.recommendationId || data.id;




    const newrecpiece = {



      ...pieceselecte,
      id: recommendationId,
      x: pieceselecte.tempX,
      y: pieceselecte.tempY,
      description: formvalue.description,
      typeId: formvalue.typeId,
      statusId: formvalue.statusId,
      contextId: finalcontextid



    };



    setpieces(prev => [...prev, newrecpiece]);

    
    setpracticeliens(prev => [...prev, { from: 'practice-card', to: recommendationId }]);










    if (finalcontextid && formvalue.newContextDescription && formvalue.newContextDescription.trim()) {



      setlinkforrecom(prev => [...prev, { from: recommendationId, to: finalcontextid, type: 'context' }]);






    }
















    finalgoalsid.forEach(gid => {



      setlinkforrecom(prev => [...prev, { from: recommendationId, to: gid, type: 'goal' }]);



    });



    setpieceselecte(null);
    setmodalouvert(false);
    return;
    












  } catch (err) {







    
    return;
  }
}
  break;















    default:
      break;
  }




  if (!endpoint) return; 


  try {

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });



    if (!response.ok) {
      throw new Error(`erreurhttp : ${response.status}`);
    }





    const data = await response.json();


   const nouvelle = {
  ...pieceselecte,
  id: data.id || data.activityId|| data.recommendationId || data.roleId ||data.pitfallId || data.goalId || data.guidelineId ||data.completioncriteriaId || Date.now(),
  x: pieceselecte.tempX,
  y: pieceselecte.tempY,
  ...formvalue,


};




    setpieces([...pieces, nouvelle]);
    if ( pieceselecte.type !== 'context') {
  setpracticeliens(prev => [...prev, { from: 'practice-card', to: nouvelle.id }]);
}

    setpieceselecte(null);
    setmodalouvert(false);


  } catch (err) {
    console.error(err);
  }
};






useEffect(() => {



  const geresourisup = () => {




    if (lastdepospiecref.current) {



      const piece = piecesRef.current.find(p => p.id === lastdepospiecref.current);




      if (piece) {



        if (piece.type === 'member') {
          savemempos(piece);
        } 
        
        
        
        else if (piece.type === 'affinity') {
          saveaffposition(piece);
        }
        
        
        
        
        else if (piece.type === 'recommendation') {
          saverecompos(piece);
        }









 else if (piece.type === 'context') {
  savecontextpos(piece);
}


 else if (piece.type === 'role') {
  saverolepos(piece);
}



else if (piece.type === 'workproduct') {
  saveworkproductpos(piece);
}



else if (piece.type === 'goal') {
  savegoalpos(piece);
}



else if (piece.type === 'metric') {
  savemetricpos(piece);
}


else if (piece.type === 'guideline') {
  saveguidelinepos(piece);
}

else if (piece.type === 'pitfall') {
  savepitfallpos(piece);
}
else if (piece.type === 'activity') {
  saveactivitypos(piece);
}





else if (piece.type === 'benefit') {
  savebenefitpos(piece);
}


else if (piece.type === 'completion') {
  savecompletionpos(piece);
}



      }




    }






    setdragpieceid(null);



    setdragtrue(false);



    lastdepospiecref.current = null;



    lastdepoaffiniref.current = null;


 lastdeporecomref.current = null;

lastdepocontextref.current = null;




lastdeporoleref.current = null;




lastdepoworkproductref.current = null;
lastdepogoalref.current = null;

lastdepoguidelineref.current = null;





lastdepopitfallref.current = null;


 lastdepoactivityref.current = null; 





 lastdepobenefitref.current = null;











 lastdepocompletionref.current = null;




  };

  window.addEventListener('mouseup', geresourisup);
  return () => window.removeEventListener('mouseup', geresourisup);





}, []);

































const savecompletionpos = async (piece) => {





  
  try {
    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/completioncriteria-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completioncriteriaId: piece.id,
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });




  } catch (err) {











    
  }
};


















const savebenefitpos = async (piece) => {




  
  try {




    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/benefit-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        benefitId: piece.id,
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });




  } catch (err) {















  }
};














const saveactivitypos = async (piece) => {
 

 




  try {



    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/activity-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activityId: piece.id,  
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });



  } catch (err) {








  }
};



const savemetricpos = async (piece) => {







  try {







    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/metric-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metricId: piece.id,
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });










  } catch (err) {









  }
};






















const savepitfallpos = async (piece) => {




  try {





    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/pitfall-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pitfallId: piece.id,
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });



  } catch (err) {







  }
};









const saveguidelinepos = async (piece) => {



  try {





    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/guideline-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guidelineId: piece.id, 
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });






  } catch (err) {







  }
};








const savecontextpos = async (piece) => {







  try {






    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/context-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contextId: piece.id, 
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });








  } catch (err) {








  }
};



const saveworkproductpos = async (piece) => {






  try {






    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/workproduct-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workproductId: piece.id,
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });





  } catch (err) {









  }
};







const savemempos = async (piece) => {





  try {



    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/member-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personId: piece.originalId,
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });




  } 
  
  
  
  
  
  
  
  
  
  
  catch (err) {





  }
};




const savegoalpos = async (piece) => {





  try {







    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/goal-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        goalId: piece.id, 
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });





  } catch (err) {





    
  }
};


const saverolepos = async (piece) => {







  try {
    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/role-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roleId: piece.id, // ID numérique du rôle
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });









  } catch (err) {









  }
};






const saveaffposition = async (piece) => {







  try {










    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/affinity-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        affinityVersionId: piece.originalid, 
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });








  } catch (err) {









  }
};






const annulerform = () => {

    setpieceselecte(null);
  
    setmodalouvert(false);
    setGoalChoice('create');
  setSelectedExistingGoalId('');


  
  };

 
















  const saverecompos = async (piece) => {






  try {










    await fetch(`http://localhost:5000/practiceVersion/${practiceversionidnum}/recommendation-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recommendationId: piece.id, 
        x: Math.round(piece.x),
        y: Math.round(piece.y)
      })
    });








  } catch (err) {







  }
};







  const bougersouris = (e) => {


  if (!zonetravail.current) return;



  const rect = zonetravail.current.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;



  position_souris({ x: mouseX, y: mouseY });




  if (dargpiece) {

    setpieces(prev =>
      prev.map(p =>
        p.id === dargpiece
          ? { ...p, x: mouseX - dragoffs.x, y: mouseY - dragoffs.y }
          : p
      )


    );
  }
};












const supprimer = async (piece) => {





  const typesautorise = [
    'activity', 'role', 'workproduct', 'goal', 'metric',
    'guideline', 'pitfall', 'benefit', 'context',
    'completioncriteria', 'recommendation', 'affinity'
  ];






  if (!typesautorise.includes(piece.type)) return;







  if (!window.confirm(`Voulez‑vous vraiment supprimer cette ${piece.type} ?`)) return;









  let endpoint = '';


  let id = piece.id;











  if (piece.type === 'affinity') {



    const match = piece.id.match(/^affinity-(\d+)$/);



    if (!match) {



      
      console.error('ID invalide');


      return;



    }



    id = match[1];
  }












  switch (piece.type) {










    case 'activity':         endpoint = `http://localhost:5000/activity/${id}`; break;
    case 'role':             endpoint = `http://localhost:5000/role/${id}`; break;
    case 'workproduct':      endpoint = `http://localhost:5000/workproduct/${id}`; break;


    case 'goal':             endpoint = `http://localhost:5000/goal/${id}`; break;


    case 'metric':           endpoint = `http://localhost:5000/metric/${id}`; break;
    case 'guideline':        endpoint = `http://localhost:5000/guideline/${id}`; break;


    case 'pitfall':          endpoint = `http://localhost:5000/pitfall/${id}`; break;

    case 'benefit':          endpoint = `http://localhost:5000/benefit/${id}`; break;


    case 'context':          endpoint = `http://localhost:5000/context/${id}`; break;

    case 'completioncriteria': endpoint = `http://localhost:5000/completioncriteria/${id}`; break;



    case 'recommendation':   endpoint = `http://localhost:5000/recommendation/${id}`; break;


    case 'affinity':         endpoint = `http://localhost:5000/affinity/${id}`; break;
    default: return;

  }









  try {
    const response = await fetch(endpoint, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erreur lors de la suppression');

   













    setpieces(prev => prev.filter(p => {


      if (p.id === piece.id) return false;


      
      if (piece.type === 'affinity' && p.type === 'affinityResult' && p.affinityVersionId === piece.originalid) return false;
      return true;



    }));







    setpracticeliens(prev => prev.filter(link => link.to !== piece.id));



    setlinkforrecom(prev => prev.filter(link => link.from !== piece.id && link.to !== piece.id));



    setaffresultliens(prev => prev.filter(link => link.from !== piece.id && link.to !== piece.id));








  } catch (err) {










    
  }
};











const gerersouisdown = (e, piece) => {




  e.preventDefault();



  e.stopPropagation();



  if (!zonetravail.current) return;


  const rect = e.currentTarget.getBoundingClientRect();



  const parentrect = zonetravail.current.getBoundingClientRect();




  const offx = e.clientX - parentrect.left - piece.x;




  const offy = e.clientY - parentrect.top - piece.y;



  setdragoff({ x: offx, y: offy });



  setdragpieceid(piece.id);



  setdragtrue(true);


  settool({ visible: false, piece: null, x: 0, y: 0 });


  lastdepospiecref.current = piece.id;


if (piece.type === 'affinity') {



  lastdepoaffiniref.current = piece.id;

} else if (piece.type === 'recommendation') {
  lastdeporecomref.current = piece.id;

} else if (piece.type === 'context') {
  lastdepocontextref.current = piece.id;
}



else if (piece.type === 'role') {
  lastdeporoleref.current = piece.id;
}




 else if (piece.type === 'workproduct') {
  lastdepoworkproductref.current = piece.id;
}



else if (piece.type === 'goal') {
  lastdepogoalref.current = piece.id;
}



else if (piece.type === 'metric') {
  lastdepometricref.current = piece.id;
}





else if (piece.type === 'guideline') {
  lastdepoguidelineref.current = piece.id;
}




else if (piece.type === 'pitfall') {
  lastdepopitfallref.current = piece.id;
}

else if (piece.type === 'activity') {
  lastdepoactivityref.current = piece.id;
}

else if (piece.type === 'benefit') {
  lastdepobenefitref.current = piece.id;
}


else if (piece.type === 'completion') {
  lastdepocompletionref.current = piece.id;
}





else {
  lastdepoaffiniref.current = null;
   lastdeporecomref.current = null;
  lastdepocontextref.current = null;
   lastdeporoleref.current = null;






    lastdepoworkproductref.current = null;

 lastdepogoalref.current = null;
 lastdepometricref.current = null;



lastdepoguidelineref.current = null;







  lastdepopitfallref.current = null; 

 lastdepoactivityref.current = null;







lastdepobenefitref.current = null; 

 
  lastdepocompletionref.current = null;




}








};












const closeLinkContextDialog = () => {
  setlinkcontextdialog({ open: false, contextId: null });
};
























const renderPiece = (piece) => {

  
  const style = {
    left: piece.x,
    top: piece.y,
    backgroundColor: piece.couleur,
  };



  const commonprops = {
    ref: el => pieceref.current[piece.id] = el,
    onMouseEnter: (e) => gerersourisentrer(piece, e),
    onMouseLeave: gerersourisquit,
    onMouseDown: (e) => gerersouisdown(e, piece),
  };




  switch (piece.type) {


    case 'activity':


      return (

        <div {...commonprops} 
        className="piece carre" 
        style={{ ...style, position: 'relative' }}>

          <div style={{ fontSize: '10px', lineHeight: 1.2, textAlign: 'center', padding: '4px' }}>


            <strong>Activity</strong>


            <div>{piece.name || piece.description}</div>

          </div>


          <span 
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            fontSize: '0.7em',
            background: 'rgba(0,0,0,0.2)',
            padding: '2px 4px',
            borderRadius: '4px'

          }}>

            {piece.sequence}

          </span>

        </div>

      );

















    case 'role':


      return (
        <div
          {...commonprops}
          className="piece role-piece"
          style={style}
        >

          <span className="role-icon" role="img" aria-label="role">👤</span>

          <span className="role-label">Role: {piece.name}</span>


        </div>
      );







    case 'workproduct':


      return (

        <div {...commonprops} className="piece rectangle" style={style}>

          <div style={{ fontSize: '10px', lineHeight: 1.2, textAlign: 'center', padding: '4px' }}>

            <strong>Work</strong>

            <div>{piece.name}</div>


          </div>

        </div>
      );



    case 'goal':


      return (


        <div

          {...commonprops}

          className="piece cercle"

          style={style}

          onClick={() => {

            if (linkmode && linkmode.targetType === 'goal') {

              fetch("http://localhost:5000/recommendation/linkGoal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  recommendationId: linkmode.recommendationId,
                  goalId: piece.id
                })
              });

              setlinkforrecom(prev => [...prev, { from: linkmode.recommendationId, to: piece.id }]);

              setlinkmode(null);

            }



          }}


        >

          <div style={{ fontSize: '10px', lineHeight: 1.2, textAlign: 'center', padding: '4px' }}>


            <strong>Goal</strong>


            <div>{piece.name}</div>


          </div>

        </div>


      );















    case 'metric':


      return (


        <div {...commonprops} className="piece etoile" style={style}>


          <div style={{ fontSize: '10px', lineHeight: 1.2, textAlign: 'center', padding: '4px' }}>


            <strong>Metric</strong>


            <div>{piece.name}</div>



          </div>


        </div>



      );




    case 'guideline':

      return (

        <div

          {...commonprops}

          className="piece rectangle"

          style={style}

          onContextMenu={(e) => gererguidelinedroitclic(e, piece)}

        >




          <div style={{ fontSize: '10px', lineHeight: 1.2, textAlign: 'center', padding: '4px' }}>


            <strong>Guideline</strong>


            <div>{piece.name}</div>


          </div>

        </div>



      );






    case 'pitfall':

      return (

        <div {...commonprops} className="piece losange" style={style}>

          <div style={{ fontSize: '10px', lineHeight: 1.2, textAlign: 'center', padding: '4px' }}>

            <strong>Pitfall</strong>


            <div>{piece.name}</div>


          </div>


        </div>


      );





    case 'benefit':


      return (



        <div {...commonprops} className="piece cercle" style={style}>


          <div style={{ fontSize: '10px', lineHeight: 1.2, textAlign: 'center', padding: '4px' }}>


            <strong>Benefit</strong>


            <div>{piece.name}</div>


          </div>

        </div>


      );











    case 'recommendation':


      return (


        <div

          {...commonprops}

          className="piece hexa"

          style={style}


          onContextMenu={(e) => gerercliquedroitrecommendation(e, piece)}

        >




          <div style={{ fontSize: '10px', lineHeight: 1.2, textAlign: 'center', padding: '4px' }}>


            <strong>💡 Recommendation</strong>


            <div>{piece.name || piece.description}</div>



          </div>


        </div>


      );











    case 'context': {



      const hasindic = contextindic[piece.id]?.length > 0;



      return (



        <div


          {...commonprops}


          className="piece hexa"


          style={style}



          onContextMenu={(e) => gererlecliqdroit(e, piece)}


          onClick={() => {



            if (linkmode && linkmode.targetType === 'context') {


              setlinkforrecom(prev => {



                const withoutOld = prev.filter(link => !(link.from === linkmode.recommendationId && link.type === 'context'));
                
                
                
                return [...withoutOld, { from: linkmode.recommendationId, to: piece.id, type: 'context' }];



              });



              fetch("http://localhost:5000/recommendation/linkContext", {


                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  recommendationId: linkmode.recommendationId,
                  contextId: piece.id
                })

              }
            
            
            ).catch(err => console.error("Errr  ", err));


              setlinkmode(null);
            }
          }}
        >
          <div style={{ fontSize: '10px', lineHeight: 1.2, textAlign: 'center', padding: '4px' }}>
            <strong>Context</strong>
            {piece.description && <div style={{ fontSize: '9px' }}>{piece.description}</div>}
          </div>
          {hasindic && <span className="context-indicator-badge">ℹ️</span>}
        </div>
      );
    }

    case 'completioncriteria':


      return (


        <div {...commonprops} className="piece hexagon" style={style}>
          <div style={{ fontSize: '10px', lineHeight: 1.2, textAlign: 'center', padding: '4px' }}>
            <strong>Completion</strong>
            <div>{piece.name}</div>
          </div>
        </div>


      );






    case 'affinity':


      return (



        <div {...commonprops} className="piece carre" style={style}>



          <div style={{ fontSize: '10px', lineHeight: 1.2, textAlign: 'center', padding: '4px' }}>


            <strong>Affinity</strong>


            <div>{piece.content}</div>



          </div>
        </div>
      );











    case 'member':



      return (



        <div



          {...commonprops}
          className="piece member-card"
          style={style}
          onContextMenu={(e) => gerermemclicdroit(e, piece)}


        >







          <strong>{piece.name}</strong><br />


          <small>{piece.email}</small>


          {piece.affinity && (
            <div className="member-affinity-badge">{piece.affinity}</div>
          )
          
          
          }


        </div>



      );












    case 'practiceversion-assoc':


      return (




        <div {...commonprops} className="piece practiceversion-card" style={style}>


          <strong>{piece.name}</strong><br />


          <small>{piece.universe}</small><br />




          <em>{piece.description}</em>



        </div>



      );












    case 'methodversion':


      return (



        <div {...commonprops} className="piece methodversion-card" style={style}>


          <strong>{piece.methodName}</strong><br />


          <span>{piece.name}</span><br />



          <small>{piece.universe}</small>

        </div>



      );













    case 'affinityResult':



      return (



        <div {...commonprops} className="piece carre" style={style}>
          {piece.result} - {piece.personName}
        </div>



      );







    default:



      return <div {...commonprops} className="piece carre" style={style}>{piece.type}</div>;



  }
};














    


const [linkmode, setlinkmode] = useState(null);




const startlinkmode = (targetType) => {





  setlinkmode({
    recommendationId: contextformm.recommendationId,
    targetType 
  });

  setcontextmenu({ visible: false, x: 0, y: 0, contextId: null });




};












const getcenter = (piece) => {




  
  if (piece.id === 'practice-card') {




    if (!practicecard.current) return { x: 0, y: 0 };



    const rect = practicecard.current.getBoundingClientRect();



    const parentrect = zonetravail.current.getBoundingClientRect();




    return {


      x: rect.left - parentrect.left + rect.width / 2,
      y: rect.top - parentrect.top + rect.height / 2



    };
  }
















  const el = pieceref.current[piece.id];



  if (!el) return { x: piece.x, y: piece.y };



  const rect = el.getBoundingClientRect();


  const parentrect = zonetravail.current.getBoundingClientRect();




  return {



    x: rect.left - parentrect.left + rect.width / 2,


    y: rect.top - parentrect.top + rect.height / 2




  };
};


















const gerelinkgoal = async () => {




    if (!selectrecommendationid) {



      alert("sélectionner une recommandation.");



      return;



    }








    try {



      const response = await fetch("http://localhost:5000/recommendation/linkGoal", {



        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendationId: parseInt(selectrecommendationid, 10),
          goalId: linkgoaldialog.goalId
        })
      });



      if (!response.ok) throw new Error('Errrr lien');








      setlinkforrecom(prev => [...prev, {








        from: selectrecommendationid,
        to: linkgoaldialog.goalId,
        type: 'goal'







      }]);






      setlinkgoaldialog({ open: false, goalId: null });



      setselectedrecommendationid('');




    } catch (err) {















    }
  };







  


  const fermerdialoggoal = () => {



    setlinkgoaldialog({ open: false, goalId: null });



    setselectedrecommendationid('');



  };




  







const gereaffclicdroit = (e, piece) => {


  e.preventDefault();
  e.stopPropagation();




  if (user?.roleId === 1) {

    alert("Expert");

    return;


  }






  setaffinitycontext({

    visible: true,
    x: e.clientX,
    y: e.clientY,
    piece



  });
};








































































const openbfprofil = async (member) => {





  setmemcontextmenu({ visible: false, x: 0, y: 0, member: null });









  try {









    const res = await fetch(`http://localhost:5000/bfProfile?personId=${member.originalId}`);








    if (res.ok) {



      const data = await res.json();



      const profile = Array.isArray(data) ? data[0] : data;






      if (profile) {




        setbfprofileform({
          o: profile.o || '',
          c: profile.c || '',
          e: profile.e || '',
          a: profile.a || '',
          n: profile.n || '',
          statusId: profile.statusId || ''
        });




        setbfprofilemod({ open: true, memberid: member.originalId, profileexist: profile });




      } else {




        setbfprofileform({ o: '', c: '', e: '', a: '', n: '', statusId: '' });



        setbfprofilemod({ open: true, memberid: member.originalId, profileexist: null });





      }
    }
  } catch (err) {






    setbfprofileform({ o: '', c: '', e: '', a: '', n: '', statusId: '' });


    setbfprofilemod({ open: true, memberid: member.originalId, profileexist: null });




  }
};

















const openstatumod = async (member) => {









  setmemcontextmenu({ visible: false, x: 0, y: 0, member: null });









  try {





    const res = await fetch(`http://localhost:5000/bfProfile?personId=${member.originalId}`);






    if (res.ok) {




      const data = await res.json();
      const profile = Array.isArray(data) ? data[0] : data;



      if (profile) {





        setstatmod({
          open: true,
          membid: member.originalId,
          existbfprofile: profile.id,
          currentstatuid: profile.statusId,
          newstatuid: profile.statusId
        });










      } else {







        setstatmod({
          open: true,
          membid: member.originalId,
          existbfprofile: null,
          currentstatuid: null,
          newstatuid: ''
        });










      }
    }
  } catch (err) {







    setstatmod({
      open: true,
      membid: member.id,
      existbfprofile: null,
      currentstatuid: null,
      newstatuid: ''
    });









  }
};







































































const savebfprofile = async () => {



  const payload = {




    personid: bfprofilemoda.memberid,
    o: bfprofileform.o ? parseFloat(bfprofileform.o) : null,
    c: bfprofileform.c ? parseFloat(bfprofileform.c) : null,
    e: bfprofileform.e ? parseFloat(bfprofileform.e) : null,
    a: bfprofileform.a ? parseFloat(bfprofileform.a) : null,
    n: bfprofileform.n ? parseFloat(bfprofileform.n) : null,
    statuid: parseInt(bfprofileform.statusId, 10)





  };






  if (!payload.statuid) {



    
    return;


  }










  try {




    let url = 'http://localhost:5000/bfProfile';

    let method = 'POST';



    if (bfprofilemoda.profileexist) {
      url = `http://localhost:5000/bfProfile/${bfprofilemoda.profileexist.id}`;
      method = 'PUT';
    }



    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });




    if (res.ok) {
      setbfprofilemod({ open: false, memberid: null, profileexist: null });
     
    } else {


      




    }
  } catch (err) {




    


  }
};





















const savestatu = async () => {


  if (!statmod.newstatuid) {
  
    return;
  }






  try {






    if (statmod.existbfprofile) {



      
      const res = await fetch(`http://localhost:5000/bfProfile/${statmod.existbfprofile}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusId: parseInt(statmod.newstatuid, 10) })
      });





      if (res.ok) {





        setstatmod({ open: false, membid: null, existbfprofile: null, currentstatuid: null, newstatuid: '' });




      } else {



      }
    } else {



      
      const creatpayload = {



        personId: statmod.membid,
        statusId: parseInt(statmod.newstatuid, 10),
        o: null, c: null, e: null, a: null, n: null


      };





      const res = await fetch('http://localhost:5000/bfProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creatpayload)
      });






      if (res.ok) {





        setstatmod({ open: false, membid: null, existbfprofile: null, currentstatuid: null, newstatuid: '' });
      
      
      
      
      
      
      
      
      } else {
       













      }
    }
  } catch (err) {
















  }
};















const [estouvert, setestouvert] = useState(false);




useEffect(() => {


  const stok_cle = `practice-lock-${practiceversionidnum}`;


  const interval = 2000; 



  const expire = 5000;        


  




  let sessionid = sessionStorage.getItem('tab-session-id');






  if (!sessionid) {




    sessionid = Date.now() + '-' + Math.random();



    sessionStorage.setItem('tab-session-id', sessionid);




  }





  const trylock = () => {



    const existraw = localStorage.getItem(stok_cle);




    const now = Date.now();



    if (existraw) {



      try {




        const existing = JSON.parse(existraw);



        if (now - existing.timestamp < expire) {


          
          if (existing.sessionId !== sessionid) {



            
            setestouvert(true);



            alert("PRATIQUE UTILISE PAR UN AUTRE USER !!! ");


            return false;



          }




          
        } else {
















        }





      } catch (e) {



















      }
    }







    
    localStorage.setItem(stok_cle, JSON.stringify({


      sessionId: sessionid,


      timestamp: now,


      tabId: Date.now() + '-' + Math.random() 


    }));



    return true;







  };




  if (!trylock()) return;


  







  const heartbeat = setInterval(() => {



    localStorage.setItem(stok_cle, JSON.stringify({


      sessionId: sessionid,

      timestamp: Date.now(),


      tabId: Date.now() + '-' + Math.random()


    }));



  }, interval);





  const gererstoragechangement = (e) => {


    if (e.key === stok_cle) {



      const otherData = e.newValue ? JSON.parse(e.newValue) : null;


      if (otherData && otherData.sessionId !== sessionid) {


        setestouvert(true);



        alert("AUTRE USER VIENT DE UTILISER CETTE PRATIQUE VERSION ");


      }


    }


    
  };



  window.addEventListener('storage', gererstoragechangement);




  const gererbefore = () => {


    localStorage.removeItem(stok_cle);


  };



  window.addEventListener('beforeunload', gererbefore);





return () => {



    clearInterval(heartbeat);



    window.removeEventListener('storage', gererstoragechangement);



    window.removeEventListener('beforeunload', gererbefore);



    
  };




}, [practiceversionidnum]);







































const saveaffresult = async () => {








  if (!affinityresul.trim() || isNaN(parseInt(affinityresul, 10))) {
    
    return;
  }














  if (!user?.id) {
    
    return;
  }


















  const affpiece = pieces.find(p => p.id === affinityresultmod.pieceid);




  if (!affpiece) {
   
    return;
  }




  const newx = affpiece.x + 80;

  const newy = affpiece.y;











  try {


    const payload = {
      personId: user.id,
      itemId: affinityresultmod.versionid,
      result: parseInt(affinityresul, 10),
      x: Math.round(newx),
      y: Math.round(newy)
    };









    const res = await fetch('http://localhost:5000/affinitySurveyResults', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });







    if (res.ok) {



      const data = await res.json();
     




      const nouvellereponse = {



        id: `affinityResult-${data.id}`,
        originalId: data.id,
        type: 'affinityResult',
        couleur: '#FFD700',
        result: payload.result,
        personName: user.name,
        personEmail: user.email,
        affinityVersionId: affinityresultmod.versionid,






        x: data.x,
        y: data.y


      };







      setpieces(prev => [...prev, nouvellereponse]);

      


      setaffresultliens(prev => [
        ...prev,
        { from: nouvellereponse.id, to: affinityresultmod.pieceid, type: 'affinityResult' }
      ]);





      setaffresultmod({ open: false, pieceid: null, versionid: null });





      setaffinityres('');


    } else {


      




    }
  } catch (err) {






    


  }
};














const openaffresultmodal = (piece) => {



  
  setaffinitycontext({ visible: false, x: 0, y: 0, piece: null });
  
  
  
  setaffresultmod({ open: true, pieceid: piece.id, versionid: piece.originalId });

  setaffinityres('');



};



































const openmemaffmodal = (member) => {


  
  setmemcontextmenu({ visible: false, x: 0, y: 0, member: null });
  
  
  setmemaffmodal({ open: true, member });
  
  
  setmemaffvalue('');




};












































const openguidetypemod = (piece) => {




  
  
  setguidelinecontmen({ visible: false, x: 0, y: 0, piece: null });
  
  
  
  setguidelinetypemod({ open: true, guideline: piece });
  
  
  
  
  setguidelinetypeform({ selectedtypeid: piece.typeId || '', newname: '', newdesription: '' });





};
















































































const saveguidelinetype = async () => {






  const { selectedtypeid: selectedTypeId, newname: newname, newdesription: newDescription } = guidelinetypeform;
  
  
  
  let typeId = selectedTypeId;


  


  if (newname.trim()) {





    try {
      const res = await fetch('http://localhost:5000/guidelineTypes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newname, description: newDescription })
      });








      if (res.ok) {



        const data = await res.json();
        typeId = data.id;
        setguidelinetypes(prev => [...prev, { id: data.id, name: newname, description: newDescription }]);
      
      
      
      
      
      
      
      
      
      
      
      
      
      } else {
      












      }
    } catch (err) {













    }
  }


























  if (!typeId) {
    



    return;
  }






  try {




    const res = await fetch(`http://localhost:5000/guideline/${guidelinetypemod.guideline.id}/type`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ typeId: parseInt(typeId) })
    });














    if (res.ok) {
   




      setpieces(prevPieces => prevPieces.map(p =>
        p.id === guidelinetypemod.guideline.id ? { ...p, typeId: parseInt(typeId) } : p





      ));






      setguidelinetypemod({ open: false, guideline: null });













    } else {
















      
    }
  } catch (err) {

















  }
};






































































































const savememaffin = async () => {








  if (!memaffvalue.trim() || isNaN(parseInt(memaffvalue, 10))) {


    
    return;
  }














  if (!memaffmodal.member) return;




  try {




    const payload = {
      personId: memaffmodal.member.originalId,
      practiceVersionId: practiceversionidnum,
      affinity: parseInt(memaffvalue, 10)
    };









    const res = await fetch('http://localhost:5000/personPracticeAffinity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });













    if (res.ok) {
     







      setmemaffmodal({ open: false, member: null });
      setmemaffvalue('');
      















    } else {














    }
  } catch (err) {




















  }
};







































































useEffect(() => {




  piecesRef.current = pieces;




}, [pieces]);



















const exportimage = async () => {


  if (!zonetravail.current) return;


  try {



    const canvas = await html2canvas(zonetravail.current, {



      backgroundColor: '#ffffff', 

      allowTaint: false,


      useCORS: true, 


    });

    const link = document.createElement('a');


    link.download = 'workspace.png';


    link.href = canvas.toDataURL('image/png');


    link.click();


  } catch (error) {



    
  }
};





























return (




  <div className="espacetravail">

   




   <div className="barreoutils">

 



 {user?.roleId !== 4 && (



  <button 
    className="toggle-pieces-btn"
    onClick={() => setshowpieces(prev => !prev)}
  >
    {showpieces ? "✖" : "+"}
  </button>



)}
 <button className="export-btn" onClick={exportimage}>
    📷 Exporter
  </button>




 
  {showpieces && (
    <div className="pieces">
      {pieces_pour_essay.map(piece => (
        <div
          key={piece.id}
          className="pieceoutil"
          onClick={() => prendre(piece)}
          style={{ backgroundColor: piece.couleur }}
          title={piece.nom}
        >
          <div className={`icone ${piece.type}`} />
          <span>{piece.nom}</span>
        </div>
      ))}
    </div>
  )}

</div>






    <div




      ref={zonetravail}
      className="zonetravail"
      onMouseMove={bougersouris}
      onClick={deposer}


>

{practiceversion && (


  <div



    ref={practicecard}
    className="practice-card"
    onClick={(e) => e.stopPropagation()}
  >



    <h4>{practiceversion.versionname}</h4>
    <p><strong>Practice :</strong> {practiceversion.practicename}</p>
    <p><strong>Universe :</strong> {practiceversion.universename}</p>



  </div>
)}
















    


    <svg className="links-layer">



  {[...recomlink, ...practicliens].map((link, i) => {



    if (link.from === 'practice-card' && !practiceversion) return null;




    const frompiece = link.from === 'practice-card'

      ? { id: 'practice-card' }
      : pieces.find(p => p.id === link.from);
    const topiece = pieces.find(p => p.id === link.to);


    if (!frompiece || !topiece) return null;



      const isMember = (p) => p && p.type === 'member';
  if (isMember(frompiece) || isMember(topiece)) return null;





    const c1 = getcenter(frompiece);
    const c2 = getcenter(topiece);



    return (
      <line
        key={i}
        x1={c1.x}
        y1={c1.y}
        x2={c2.x}
        y2={c2.y}
        stroke="blue"      
        strokwid="2"
        markened="url(#arrow)"
      />
    );
  })}





  {affinityresultliens.map((link, i) => {



  const frompiece = pieces.find(p => p.id === link.from);
  const topiece = pieces.find(p => p.id === link.to);

  if (!frompiece || !topiece) return null;

  const c1 = getcenter(frompiece);

  const c2 = getcenter(topiece);

  return (
    <line
      key={`result-${i}`}
      x1={c1.x}
      y1={c1.y}
      x2={c2.x}
      y2={c2.y}
      stroke="orange"
      strokwid="2"
      markened="url(#arrow)"
    />
  );
})}







  <defs>


    <marker id="arrow" markwi="10" markhei="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="black" />
    </marker>



  </defs>
</svg>






























      <div className="zheader">







       


        




      </div>







      {pieces
      .filter(piece => piece.type !== 'member')
      .map(piece => (




        <div 
          key={`${piece.type}-${piece.id}`} 
          className="countain"
          onDoubleClick={(e) => {
      e.stopPropagation();
      supprimer(piece);
    }}
        >
          {renderPiece(piece)}
        </div>





      ))}






     {pieceselecte && !modalouvert && (

  <div
    className={`piece ${pieceselecte.type}`}
    style={{
      left: souris.x - 25,
      top: souris.y - 25,
      backgroundColor: pieceselecte.couleur,
      position: 'absolute',
      pointerEvents: 'none',
      opacity: 0.8
    }}
  >
    {pieceselecte.nom || pieceselecte.name || pieceselecte.description}
  </div>


)}







     
    </div>









    {modalouvert && (
      <div className="modal">
        <div className="modal-content">
          <h3>Ajouter {pieceselecte.nom}</h3>
         





         {pieceselecte.type !== 'goal' && (
  <input
    type="text"
    placeholder="Name*"
    value={formvalue.name}
    onChange={e => setformvalue({ ...formvalue, name: e.target.value })}
  />
)}








        




{pieceselecte?.type === 'recommendation' && (
  <>
   

    <select
      value={formvalue.typeId || ''}
      onChange={e =>
        setformvalue({ ...formvalue, typeId: e.target.value })
      }
    >
      <option value="">Impact</option>
      <option value="1">Helpful (+)</option>
      <option value="2">Harmful (-)</option>
      <option value="3">Neutral (0)</option>
      <option value="4">Helpful if customized (C)</option>
    </select>

    <select
      value={formvalue.statusId || ''}
      onChange={e =>
        setformvalue({ ...formvalue, statusId: e.target.value })
      }
    >
      <option value="">Status</option>
      <option value="1">Proposed</option>
      <option value="2">Accepted</option>
      <option value="3">Rejected</option>
    </select>


    <h4>Ou créer un nouveau contexte</h4>
    <input
      type="text"
      placeholder="Description du nouveau contexte"
      value={formvalue.newContextDescription || ''}
      onChange={e => setformvalue({...formvalue, newContextDescription: e.target.value})}
    />


    <h4>Ou créer un nouveau goal</h4>
<input
  type="text"
  placeholder="Nom du nouveau goal"
  value={formvalue.newGoalName || ''}
  onChange={e => setformvalue({...formvalue, newGoalName: e.target.value})}
/>
<input
  type="text"
  placeholder="Description du nouveau goal"
  value={formvalue.newGoalDescription || ''}
  onChange={e => setformvalue({...formvalue, newGoalDescription: e.target.value})}
/>




  </>
)}


{pieceselecte.type === 'role' && (
  <select
    value={formvalue.typeId || ''}
    onChange={e => setformvalue({ ...formvalue, typeId: e.target.value })}
  >
    <option value="">Sélectionner un type de rôle</option>
    {roleUseTypes.map(type => (
      <option key={type.id} value={type.id}>{type.name}</option>
    ))}
  </select>
)}






















{pieceselecte.type === 'goal' && (





  <>


    <label className="goal-option">



      <input
        type="radio"
        value="create"
        checked={goalChoice === 'create'}
        onChange={() => setGoalChoice('create')}
      />



      Créer un nouveau goal
    </label>








    <label className="goal-option">



      <input
        type="radio"
        value="existing"
        checked={goalChoice === 'existing'}
        onChange={() => setGoalChoice('existing')}
      />



      Sélectionner un goal existant
    </label>








    {goalChoice === 'create' && (


      <>
        <input
          type="text"
          placeholder="Nom*"
          value={formvalue.name}
          onChange={e => setformvalue({ ...formvalue, name: e.target.value })}
        />




        <input
          type="text"
          placeholder="Description"
          value={formvalue.description}
          onChange={e => setformvalue({ ...formvalue, description: e.target.value })}
        />




      </>
    )}








    {goalChoice === 'existing' && (



      <select
        value={selectedExistingGoalId}
        onChange={e => setSelectedExistingGoalId(e.target.value)}
      >



        <option value="">Sélectionnez un goal</option>



        {existingGoals.map(g => (


          <option key={g.id} value={g.id}>{g.name}</option>



        ))}
      </select>






    )}
  </>
)}












{pieceselecte.type === 'guideline' && (
  <>
    <select
      value={formvalue.methodVersionId || ''}
      onChange={e => setformvalue({ ...formvalue, methodVersionId: e.target.value })}
    >
      <option value="">Sélectionner une version de méthode (optionnel)</option>
      {methodVersions.map(mv => (
        <option key={mv.id} value={mv.id}>
          {mv.methodname} - {mv.versionname} ({mv.universename})
        </option>
      ))}
    </select>

    <select
      value={formvalue.typeId || ''}
      onChange={e => setformvalue({ ...formvalue, typeId: e.target.value })}
    >
      <option value="">Sélectionner un type de guideline (optionnel)</option>
      {guidelinetype.map(gt => (
        <option key={gt.id} value={gt.id}>{gt.name}</option>
      ))}
    </select>
  </>
)}






 {pieceselecte.type === 'affinity' && (
        <>
          <input
            type="text"
            placeholder="Comment"
            value={formvalue.comment || ''}
            onChange={e => setformvalue({...formvalue, comment: e.target.value})}
          />
          <input
            type="number"
            placeholder="Version*"
            value={formvalue.version}
            onChange={e => setformvalue({...formvalue, version: parseInt(e.target.value, 10)})}
          />
          <input
            type="text"
            placeholder="Version Note"
            value={formvalue.versionNote || ''}
            onChange={e => setformvalue({...formvalue, versionNote: e.target.value})}
          />
        </>
      )}



       
          {pieceselecte.type === 'metric' && (
            <>
              <input
                type="text"
                placeholder="Unit"
                value={formvalue.unit}
                onChange={e => setformvalue({ ...formvalue, unit: e.target.value })}
              />


              <input
                type="text"
                placeholder="Scale"
                value={formvalue.scale}
                onChange={e => setformvalue({ ...formvalue, scale: e.target.value })}
              />



              <input
                type="text"
                placeholder="Formula"
                value={formvalue.formula}
                onChange={e => setformvalue({ ...formvalue, formula: e.target.value })}
              />
            </>
          )}












     {pieceselecte.type !== 'context' && pieceselecte.type !== 'goal' &&  (


  <input
    type="text"
    placeholder="Description"
    value={formvalue.description}
    onChange={e => setformvalue({ ...formvalue, description: e.target.value })}
  />





)}



{pieceselecte.type === 'context' && (
  <>
    <h4>Ou créer un indicateur de contexte (optionnel)</h4>
    <input
      type="text"
      placeholder="Nom de l'indicateur*"
      value={formvalue.newIndicatorName || ''}
      onChange={e => setformvalue({...formvalue, newIndicatorName: e.target.value})}
    />
    <input
      type="text"
      placeholder="Description"
      value={formvalue.newIndicatorDescription || ''}
      onChange={e => setformvalue({...formvalue, newIndicatorDescription: e.target.value})}
    />
    <input
      type="text"
      placeholder="Attributs"
      value={formvalue.newIndicatorAttributes || ''}
      onChange={e => setformvalue({...formvalue, newIndicatorAttributes: e.target.value})}
    />
    <input
      type="text"
      placeholder="Précision"
      value={formvalue.newIndicatorPrecision || ''}
      onChange={e => setformvalue({...formvalue, newIndicatorPrecision: e.target.value})}
    />
    <input
      type="text"
      placeholder="Valeur*"
      value={formvalue.newIndicatorValue || ''}
      onChange={e => setformvalue({...formvalue, newIndicatorValue: e.target.value})}
    />
  </>
)}


{pieceselecte.type === 'activity' && (
  <input
    type="number"
    placeholder="Séquence*"
    value={formvalue.sequence}
    onChange={e => setformvalue({...formvalue, sequence: e.target.value})}
  />
)}




       
          {['guideline', 'pitfall', 'benefit'].includes(pieceselecte.type) && (
            <input
              type="text"
              placeholder="Cont"
              value={formvalue.content || ''}
              onChange={e => setformvalue({ ...formvalue, content: e.target.value })}
            />
          )}












          <div className="modal-buttons">
            <button onClick={validerform}>Valider</button>
            <button onClick={annulerform}>Annuler</button>
          </div>
        </div>
      </div>
    )}









  














    {contextformm.visible && (






      <div 
        className="context-menu"
        style={{
          position: 'fixed',
          left: contextformm.x,
          top: contextformm.y,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}
        onClick={(e) => e.stopPropagation()}



      >











        <div 
          className="context-menu-item"
          onClick={openindicateur}
          style={{
            padding: '8px 12px',
            cursor: 'pointer',
            color: '#333'
          }}
        >
          Ajouter un indicateur de contexte
        </div>








      </div>
    )}













{contextformm.visible && contextformm.type === 'recommendation' && (




  <div 
    className="context-menu"
    style={{
      position: 'fixed',
      left: contextformm.x,
      top: contextformm.y,
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '8px',
      zIndex: 1000
    }}
     onClick={(e) => e.stopPropagation()} 
  >
    <button onClick={() => startlinkmode('context')}>





  Créer lien avec contexte
</button>
<button onClick={() => startlinkmode('goal')}>
  Créer lien avec goal
</button>




  </div>
)}






   





    {indicateurmodal.ouvert && (
      <div className="modal">
        <div className="modal-content">






          <h3>Ajouter un indicateur de contexte</h3>

          <input
            type="text"
            placeholder="Nom*"
            value={indicatorForm.name}
            onChange={e => setindicateur({...indicatorForm, name: e.target.value})}
          />










          <input
            type="text"
            placeholder="Description"
            value={indicatorForm.description}
            onChange={e => setindicateur({...indicatorForm, description: e.target.value})}
          />











          <input
            type="text"
            placeholder="Attribut"
            value={indicatorForm.attributes}
            onChange={e => setindicateur({...indicatorForm, attributes: e.target.value})}
          />







          <input
            type="text"
            placeholder="Precision"
            value={indicatorForm.precision}
            onChange={e => setindicateur({...indicatorForm, precision: e.target.value})}
          />








          <input
            type="text"
            placeholder="Valeur*"
            value={indicatorForm.value}
            onChange={e => setindicateur({...indicatorForm, value: e.target.value})}
          />










          <div className="modal-buttons">
            <button onClick={gerersoumissionindicateur}>Valider</button>
            <button onClick={annulerajoutindic}>Annuler</button>
          </div>
        </div>
      </div>
    )}



























































































{affinitycontextmenu.visible && (




  <div
    className="context-menu"
    style={{
      position: 'fixed',
      left: affinitycontextmenu.x,
      top: affinitycontextmenu.y,
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '8px',
      zIndex: 1000
    }}




    onClick={(e) => e.stopPropagation()}
  >


    <div



      className="context-menu-item"
      onClick={() => openaffresultmodal(affinitycontextmenu.piece)}
      style={{ padding: '8px 12px', cursor: 'pointer' }}
    >
      Ajouter une réponse
    </div>




  </div>





)}















{affinityresultmod.open && (










  <div className="modal" onClick={() => setaffresultmod({ open: false, pieceid: null, versionid: null })}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>









      <h3>Ajouter une réponse à l'affinité</h3>





      <label>
        Résultat :
        <input
          type="number"
          value={affinityresul}
          onChange={e => setaffinityres(e.target.value)}
          placeholder="Entrez un nombre"
          style={{ width: '100%', marginTop: '5px' }}
        />
      </label>






      <div className="modal-buttons">
        <button onClick={saveaffresult}>Valider</button>
        <button onClick={() => setaffresultmod({ open: false, pieceid: null, versionid: null })}>Annuler</button>
      </div>








    </div>
  </div>
)}














{tooltip.visible && tooltip.piece && (









  <div 
    className="piece-tooltip"
    style={{
      position: 'fixed',
      left: tooltip.x,
      top: tooltip.y,
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      maxWidth: '300px',
      minWidth: '200px'
    }}
  >











    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>





      {tooltip.piece.type}: {tooltip.piece.name || tooltip.piece.description}






    </div>













    <div>


      {tooltip.piece.description && tooltip.piece.type !== 'context' && (
        <p><strong>Description:</strong> {tooltip.piece.description}</p>
      )}







      {tooltip.piece.type === 'metric' && (
        <>
          {tooltip.piece.unit && <p><strong>Unit:</strong> {tooltip.piece.unit}</p>}
          {tooltip.piece.scale && <p><strong>Scale:</strong> {tooltip.piece.scale}</p>}
          {tooltip.piece.formula && <p><strong>Formula:</strong> {tooltip.piece.formula}</p>}
        </>
      )}




      {['guideline', 'pitfall', 'benefit'].includes(tooltip.piece.type) && tooltip.piece.content && (
        

        <p><strong>Content:</strong> {tooltip.piece.content}</p>
      

      )}




{tooltip.piece.type === 'role' && (
  <>
    {tooltip.piece.typeId && (
      <p>
        <strong>Type de rôle :</strong>{' '}
        {roleUseTypes.find(t => t.id === tooltip.piece.typeId)?.name || tooltip.piece.typeId}
      </p>
    )}
  </>
)}







    {tooltip.piece.type === 'recommendation' && (
  <>
    {tooltip.piece.typeId && (
      <p><strong>Impact :</strong> {impacttypes[tooltip.piece.typeId] || tooltip.piece.typeId}</p>
    )}
    {tooltip.piece.statusId && (
      <p><strong>Statut :</strong> {statustypes[tooltip.piece.statusId] || tooltip.piece.statusId}</p>
    )}
    {tooltip.piece.contextId && <p><strong>Contexte ID :</strong> {tooltip.piece.contextId}</p>}
  </>
)}




   



{tooltip.piece.type === 'guideline' && (
  <>
   
   
    {tooltip.piece.content && <p><strong>Contenu:</strong> {tooltip.piece.content}</p>}
    {tooltip.piece.typeId && (
      <p><strong>Type:</strong> {guidelinetype.find(t => t.id === tooltip.piece.typeId)?.name || tooltip.piece.typeId}</p>
    )}
  </>
)}






   {tooltip.piece.type === 'member' && (

  <>
    <p><strong>Email :</strong> {tooltip.piece.email}</p>



    {tooltip.piece.bfProfile ? (



      <>
        <p>
          <strong>Statut :</strong>{' '}
          {bfprofstatu.find(s => s.id === tooltip.piece.bfProfile.statusId)?.name ||
            tooltip.piece.bfProfile.statusId}
        </p>




        <p><strong>O (Ouverture) :</strong> {tooltip.piece.bfProfile.o ?? 'N/A'}</p>
        <p><strong>C (Conscience) :</strong> {tooltip.piece.bfProfile.c ?? 'N/A'}</p>
        <p><strong>E (Extraversion) :</strong> {tooltip.piece.bfProfile.e ?? 'N/A'}</p>
        <p><strong>A (Agréabilité) :</strong> {tooltip.piece.bfProfile.a ?? 'N/A'}</p>
        <p><strong>N (Névrosisme) :</strong> {tooltip.piece.bfProfile.n ?? 'N/A'}</p>
      </>



    ) : (




      <p><em>Aucun profil Big Five</em></p>





    )}
  </>
)}


      {tooltip.piece.type === 'practiceversion-assoc' && (
        <>
          <p><strong>Universe:</strong> {tooltip.piece.universe}</p>
          <p><strong>Description:</strong> {tooltip.piece.description}</p>
        </>
      )}




      {tooltip.piece.type === 'methodversion' && (
        <>
          <p><strong>Method:</strong> {tooltip.piece.methodName}</p>
          <p><strong>Version:</strong> {tooltip.piece.name}</p>
          <p><strong>Universe:</strong> {tooltip.piece.universe}</p>
        </>
      )}





{tooltip.piece.type === 'context' && (
  <>
    {tooltip.piece.description && <p><strong>Description :</strong> {tooltip.piece.description}</p>}
  </>
)}





      {tooltip.piece.type === 'context' && contextindic[tooltip.piece.id] && contextindic[tooltip.piece.id].length > 0 && (
        <div>
          <strong>Indicators:</strong>



          {contextindic[tooltip.piece.id].map(ind => (
            <div key={ind.id} style={{ marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '5px' }}>
              <div><strong>Name:</strong> {ind.name}</div>
              <div><strong>Value:</strong> {ind.value}</div>
              {ind.description && <div><em>{ind.description}</em></div>}
              {ind.attributes && <div><strong>Attributes:</strong> {ind.attributes}</div>}
              {ind.precision && <div><strong>Precision:</strong> {ind.precision}</div>}
            </div>
          ))}









        </div>
      )}
    </div>
  </div>
)}












{membrecontextmenu.visible && (


  <div
    className="context-menu"





    style={{
      position: 'fixed',
      left: membrecontextmenu.x,
      top: membrecontextmenu.y,
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '8px',
      zIndex: 1000
    }}




    onClick={(e) => e.stopPropagation()}




  >
    <div
      className="context-menu-item"
      onClick={() => openbfprofil(membrecontextmenu.member)}
      style={{ padding: '8px 12px', cursor: 'pointer' }}
    >
      Modifier profil Big Five
    </div>









    <div
      className="context-menu-item"
      onClick={() => openstatumod(membrecontextmenu.member)}
      style={{ padding: '8px 12px', cursor: 'pointer' }}
    >
      Changer statut
    </div>





       <div
      className="context-menu-item"
      onClick={() => openmemaffmodal(membrecontextmenu.member)}
    >
      Définir affinité
    </div>


  </div>
)}






















{bfprofilemoda.open && (




  <div className="modal" onClick={() => setbfprofilemod({ open: false, memberid: null, profileexist: null })}>
    
    
    
    
    
    <div className="modal-content" onClick={e => e.stopPropagation()}>
    
    
    
    
      <h3>Modifier profil Big Five</h3>
    
    
    
    
    
      <label>
        Ouverture (O) :
        <input type="number" step="0.01" min="0" max="1" value={bfprofileform.o} onChange={e => setbfprofileform({...bfprofileform, o: e.target.value})} />
      </label>
    
    
    
    
    
    
      <label>
        Conscience (C) :
        <input type="number" step="0.01" min="0" max="1" value={bfprofileform.c} onChange={e => setbfprofileform({...bfprofileform, c: e.target.value})} />
    </label>
  
  
  
  
  
  
  
      <label>
        Extraversion (E) :
        <input type="number" step="0.01" min="0" max="1" value={bfprofileform.e} onChange={e => setbfprofileform({...bfprofileform, e: e.target.value})} />
      </label>
  
  
  
  
  
  
  
  
  
  
  
  
      <label>
        Agréabilité (A) :
        <input type="number" step="0.01" min="0" max="1" value={bfprofileform.a} onChange={e => setbfprofileform({...bfprofileform, a: e.target.value})} />
      </label>
  
  
  
  
  
  
  
  
      <label>
        Névrosisme (N) :
        <input type="number" step="0.01" min="0" max="1" value={bfprofileform.n} onChange={e => setbfprofileform({...bfprofileform, n: e.target.value})} />
      </label>
  
  
  
  
  
  
  
  
  
  
  
  
  
  
      <label>
        Statut :
        <select value={bfprofileform.statusId} onChange={e => setbfprofileform({...bfprofileform, statusId: e.target.value})}>
          <option value="">Sélectionner</option>
          {bfprofstatu.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </label>
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
      <div className="modal-buttons">
        <button onClick={savebfprofile}>Enregistrer</button>
        <button onClick={() => setbfprofilemod({ open: false, memberid: null, profileexist: null })}>Annuler</button>
    </div>













    </div>
  </div>
)}
















{linkcontextdialog.open && (
  <div className="modal" onClick={closeLinkContextDialog}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <h3>Contexte créé</h3>
      <p>
        Ce contexte n’est actuellement associé à aucune recommandation.
        N'oubliez pas de faire un clic droit sur une recommandation et choisir
        "Créer lien avec contexte" pour le lier.
      </p>
      <div className="modal-buttons">
        <button onClick={closeLinkContextDialog}>OK</button>
      </div>
    </div>
  </div>
)}







{statmod.open && (




<div className="modal" onClick={() => setstatmod({ open: false, membid: null, existbfprofile: null, currentstatuid: null, newstatuid: '' })}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>




      <h3>Changer statut du profil</h3>









      <label>
        Nouveau statut :
        <select value={statmod.newstatuid} onChange={e => setstatmod({...statmod, newstatuid: e.target.value})}>
          <option value="">Sélectionner</option>
          {bfprofstatu.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </label>












      <div className="modal-buttons">
        <button onClick={savestatu}>Enregistrer</button>
        <button onClick={() => setstatmod({ open: false, membid: null, existbfprofile: null, currentstatuid: null, newstatuid: '' })}>Annuler</button>

      </div>














    </div>
  </div>
)}





















{memaffmodal.open && (
  <div className="modal" onClick={() => setmemaffmodal({ open: false, member: null })}>




    <div className="modal-content" onClick={e => e.stopPropagation()}>




      <h3>Définir l'affinité pour {memaffmodal.member?.name}</h3>







      <label>
        Affinité (entier) :
        <input
          type="number"
          value={memaffvalue}
          onChange={e => setmemaffvalue(e.target.value)}
          placeholder="Entrez un nombre"
          style={{ width: '100%', marginTop: '5px' }}
        />
      </label>

















      <div className="modal-buttons">
        <button onClick={savememaffin}>Enregistrer</button>
        <button onClick={() => setmemaffmodal({ open: false, member: null })}>Annuler</button>
      </div>











    </div>
  </div>
)}






















{guidelinecontextmen.visible && (






<div
    className="context-menu"
    style={{
      position: 'fixed',
      left: guidelinecontextmen.x,
      top: guidelinecontextmen.y,
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '8px',
      zIndex: 1000
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <div
      className="context-menu-item"
      onClick={() => openguidetypemod(guidelinecontextmen.piece)}
      style={{ padding: '8px 12px', cursor: 'pointer' }}
    >
      Définir le type
    </div>
  </div>
)}





{linkgoaldialog.open && (
        <div className="modal" onClick={fermerdialoggoal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Lier le goal à une recommandation</h3>
            <p>
              Ce goal n’est actuellement associé à aucune recommandation.
              N'oubliez pas de choisir une recommendation et lier avec ce goal.
            </p>
           
            
             
            <div className="modal-buttons">
             
              <button onClick={fermerdialoggoal}>OK</button>
            </div>
          </div>
        </div>
      )}
















{guidelinetypemod.open && (
  <div className="modal" onClick={() => setguidelinetypemod({ open: false, guideline: null })}>




    <div className="modal-content" onClick={e => e.stopPropagation()}>





      <h3>Définir le type de guideline</h3>









      <label>
        Type existant :
        <select
          value={guidelinetypeform.selectedtypeid}
          onChange={e => setguidelinetypeform({...guidelinetypeform, selectedtypeid: e.target.value})}
          style={{ width: '100%', marginTop: '5px' }}
        >
          <option value="">Sélectionner un type</option>
          {guidelinetype.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </label>

















      <p>ou</p>









      <h4>Créer un nouveau type</h4>




















      <label>
        Nom* :
        <input
          type="text"
          value={guidelinetypeform.newname}
          onChange={e => setguidelinetypeform({...guidelinetypeform, newname: e.target.value})}
          style={{ width: '100%', marginTop: '5px' }}
        />
      </label>















      <label>
        Description :
        <textarea
          value={guidelinetypeform.newdesription}
          onChange={e => setguidelinetypeform({...guidelinetypeform, newdesription: e.target.value})}
          style={{ width: '100%', marginTop: '5px' }}
        />
      </label>


















      <div className="modal-buttons">
        <button onClick={saveguidelinetype}>Enregistrer</button>
        <button onClick={() => setguidelinetypemod({ open: false, guideline: null })}>Annuler</button>
      </div>











    </div>
  </div>
)}







  </div>
);

};



























export default EspaceTravail;
