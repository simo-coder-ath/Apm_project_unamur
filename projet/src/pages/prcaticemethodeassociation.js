/**
 * @fileoverview composant react pour la visualisation des associations entre pratiques et méthodes
 * 
 * 
 * 
 * 
 *
 * ce composant récupère et affiche toutes les associations entre versions de pratiques
 * et versions de méthodes au sein d'une team
 * 
 * 
 * 
 * les associations sont regroupées par version de pratique et présentées sous forme de blocs 
 * directionnels (pratique ==> méthodes associées) indiquant le nom, la version et l'univers de chaque méthode liée
 *
 * 
 * 
 * id de la team est récupéré depuis les query params de l'url
 *
 * 
 * 
 * 
 * 
 * @module Practicemethode
 *
 * 
 * 
 * 
 * @requires react
 * @requires react-router-dom
 * 
 * 
 * 
 * 
 * 
 */







import React, { useEffect, useState } from 'react';
import '../styles/practicemethodassoc.css';
import { useLocation } from 'react-router-dom';

const Practicemethode = () => {






  const [data, setdata] = useState({});


  const location = useLocation();


  const trouverparam = new URLSearchParams(location.search);

  const teamid = trouverparam.get('teamId')
  








  useEffect(() => {


    fetch(`http://localhost:5000/practicemethodeasssocaition?teamId=${teamid}`)
      .then(res => res.json())
      .then(rows => {
        const groupeselonpracticeid = {};

        rows.forEach(r => {


          if (!groupeselonpracticeid[r.practiceversionid]) {
            groupeselonpracticeid[r.practiceversionid] = {
              practice: {
                id: r.practiceversionid,
                name: r.practicename,
                version: r.practiceversionname,
                universe: r.practiceuniverse
              },
              methods: []
            };
          }



          groupeselonpracticeid[r.practiceversionid].methods.push({
            id: r.methodversionid,
            name: r.methodname,
            version: r.methodversionname,
            universe: r.methoduniverse


          });
        });

        setdata(groupeselonpracticeid);
      });
  }, []);











































  return (




    <div className="render_contain">
      <h1>Associations Pratiques Méthodes</h1>

      {Object.values(data).map(block => (
        <div key={block.practice.id} className="association_group">

       
          <div className="carte pratique_carte">
            <h3>{block.practice.name}</h3>
            <strong>Version : {block.practice.version}</strong>
            <p>{block.practice.universe}</p>
          </div>


       
          <div className="les_fleches">
            {block.methods.map((_, i) => (
              <div key={i} className="fleche">➜</div>
            ))}
          </div>

         

          <div className="method_group">
            {block.methods.map(m => (
              <div key={m.id} className="carte method_carte">
                <h4>{m.name}</h4>
                <strong>{m.version}</strong>
                <p>{m.universe}</p>
              </div>
            ))}
          </div>
     


        </div>
      ))}
    </div>
  );












};

export default Practicemethode;
