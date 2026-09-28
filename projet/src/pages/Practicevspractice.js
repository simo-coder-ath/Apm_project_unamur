/**
 * @fileoverview composant react pour la visualisation des associations entre versions de pratiques
 * 
 * 
 * 
 *
 * ce composant récupère et affiche toutes les associations entre versions de pratiques
 * au sein d'une team
 * 
 * les associations sont regroupées par version source et présentées
 * sous forme de blocs directionnels (source ==>  cibles) indiquant le type d'association
 * 
 * 
 * 
 * 
 * id de la team est récupéré depuis les query params de l'url
 * 
 * 
 * 
 * 
 *
 * @module Practicevspractice
 *
 * @requires react
 * @requires react-router-dom
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */






import React, { useEffect, useState } from 'react';
import '../styles/practicemethodassoc.css';



import { useLocation } from 'react-router-dom';













const Practicevspractice = () => {







  const [data, setData] = useState({});





  const location = useLocation();
  const trouverparam = new URLSearchParams(location.search);
  const teamid = trouverparam.get('teamId')
  



  useEffect(() => {


    fetch(`http://localhost:5000/practiceassociation?teamId=${teamid}`)
      .then(res => res.json())
      .then(rows => {


        const grouped = {};



        rows.forEach(r => {


          if (!grouped[r.sourcepracticeversionid]) {

            grouped[r.sourcepracticeversionid] = {
              source: {
                id: r.sourcepracticeversionid,
                name: r.sourcepracticename,
                version: r.sourcepracticeversionname,
                universe: r.sourcepracticeuniverse
              },
              targets: []
            };
          }






          grouped[r.sourcepracticeversionid].targets.push({
            id: r.targetpracticeversionid,
            name: r.targetpracticename,
            version: r.targetpracticeversionname,
            universe: r.targetpracticeuniverse,
            type: r.associationtype
          });
        });






        setData(grouped);


        
      });
  }, []);















  return (
    <div className="render_contain">
      <h1>Associations Pratiques Pratiques</h1>

      {Object.values(data).map(block => (





        <div key={block.source.id} className="association_group">





          <div className="carte pratique_carte">
            <h3>{block.source.name}</h3>
            <strong>Version : {block.source.version}</strong>
            <p>{block.source.universe}</p>
          </div>







          <div className="les_fleches">
            {block.targets.map((_, i) => (
              <div key={i} className="fleche">➜</div>
            ))}
          </div>






          <div className="practice_group">
            {block.targets.map(t => (
              <div key={t.id} className="carte pratique_carte">
                <h4>{t.name}</h4>
                <strong>{t.version}</strong>
                <p>{t.universe}</p>
                <em>{t.type}</em>
              </div>




            ))}




            
          </div>

        </div>
      ))}
    </div>
  );
};

export default Practicevspractice;
