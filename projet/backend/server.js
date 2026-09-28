/**
 * @fileoverview serveur express pour l'api de gestion de pratiques, activites, rôles ...
 * 
 * 
 * @module server
 * 
 * 
 * @requires dotenv
 * 
 * 
 * 
 * @requires express
 * 
 * 
 * 
 * @requires cors
 * 
 * 
 * 
 * @requires pg
 * 
 * 
 * 
 * 
 * @requires bcrypt
 *
 * 
 * 
 * 
 * 
 * @description
 * Ce fichier implémente un serveur RESTful permettant de gérer :
 * 
 * - les pratiques et leurs versions
 * 
 * - les activités, rôles, workproducts, objectifs, métriques, contextes, ...
 * 
 * - les recommandations, critères de complétion, affinités
 * 
 * - les utilisateurs, équipes, univers
 * 
 * - les profils Big Five (bfProfile)
 * 
 * - les enquêtes d'affinité
 * 
 * - les associations entre pratiques, méthodes ...
 *
 * 
 * 
 * la connexion à la base de données PostgreSQL est établie via un pool de connexions
 * dont les paramètres sont lus dans les variables d'environnement :
 * 
 *   DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT
 *
 * 
 * 
 * 
 * le serveur écoute sur le port défini par la constante port (5000 )
 *
 * 
 * 
 * 
 * les routes sont organisées par catégorie :
 * 
 * - Pratiques : GET /pratiques, /practicetypes, POST /practice, /practiceVersion
 * 
 * - Activités, rôles, workproducts, objectifs, métriques, contextes : POST /activity, /role, /workproduct, /goal, /metric, /context
 * 
 * - Guidelines, pitfalls, benefits : POST /guideline, /pitfall, /benefit
 * 
 * - Recommandations : POST /recommendation, GET /practiceVersion/:id/recommendations
 * 
 * - Critères de complétion : POST /completioncriteria
 * 
 * - Affinités : POST /affinitySurvey, /affinitySurveyVersion, /affinityPractice, /affinitySurveyResults
 * 
 * - Utilisateurs et authentification : POST /register, /login, GET /roles
 * 
 * - Équipes : POST /teams, GET /myteams, GET /team/:id, POST /team/:id/add-member
 * 
 * - Univers : GET /universes, GET /universes/:teamId, POST /universe
 * 
 * - Méthodes : POST /method, GET /methods, POST /methodVersion
 * 
 * - Associations : POST /practiceAssociation, GET /practiceassociation, GET /practiceAssociationTypes
 * 
 * - Profils Big Five : GET /bfProfileStatus, GET /bfProfile, POST /bfProfile, PUT /bfProfile/:id, POST /bfProfile/calculate/:personId
 * 
 * - Positions (mise à jour des coordonnées) : routes dynamiques /practiceVersion/:id/*-position
 * 
 * - Suppressions : DELETE /activity/:id, /role/:id, /workproduct/:id, /goal/:id, /metric/:id, /guideline/:id, /pitfall/:id, /benefit/:id, /context/:id, /completioncriteria/:id, /recommendation/:id, /affinity/:id
 *
 * 
 * 
 * toutes les routes  gèrent les rollbacks
 *
 * 
 * 
 */











require('dotenv').config(); 


const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');


const app = express();
const port = 5000;


app.use(cors());


app.use(express.json());





const pool = new Pool({












user: process.env.DB_USER,

host: process.env.DB_HOST,

database: process.env.DB_NAME,

password: process.env.DB_PASSWORD, 

port: process.env.DB_PORT,


});





app.get('/pratiques', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, p.description, p.objective, pt.name AS type
      FROM Practice p
      JOIN practicetype pt ON p.typeId = pt.id
      ORDER BY p.id DESC
    `);
    res.json(result.rows);
  } catch (err) {

    //console.error(err.message);
   

  }
});
















app.get('/practicetypes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM practicetype'); 
    res.json(result.rows);
  

} catch (err) {
   
    res.status(500).send('erreur');
  }

});































app.post('/practiceVersion', async (req, res) => {
  const { practiceId, universeId, versionName, changeDescription, lastUpdateById } = req.body;



  try {
   
    const result = await pool.query(
      `INSERT INTO practiceVersion
        (practiceId, universeId, versionName, changeDescription, lastUpdateById)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [practiceId, universeId, versionName, changeDescription, lastUpdateById]
    );

    const newVersionId = result.rows[0].id;

  
    

    await pool.query(
      `INSERT INTO PracticeVersionUniverse
        (practiceVersionId, universeId, isActive)
       VALUES ($1, $2, true)`,
      [newVersionId, universeId]
    );



    res.json(result.rows[0]); 
  } catch (err) {
    //console.error(err);
    res.status(500).send('erreur');
  }
});










app.post('/practice', async (req, res) => {

  const { name, description, objective, typeId } = req.body;
  try {

    const result = await pool.query(
      'INSERT INTO Practice (name, description, objective, typeId) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, objective, typeId]
    );
    res.json(result.rows[0]);
    
  } catch (err) {
    //console.error(err.message);
    res.status(500).send('erreur');
  }

});










app.get('/universes', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM Universe ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {

    res.status(500).send('erreur srvr');

  }
});







app.get('/universes/:teamId', async (req, res) => {




   const teamId = parseInt(req.params.teamId); 

  try {
    const result = await pool.query(
      'SELECT id, name FROM Universe WHERE teamId = $1 ORDER BY id ASC',
      [teamId]
    );
    res.json(result.rows);



  } catch (error) {
   




  }
});


















app.post('/activity', async (req, res) => {


  const { name, description, lastUpdateById, practiceVersionId, x, y, sequence } = req.body;
  const client = await pool.connect();


  try {

    await client.query('BEGIN');

   
    const result_activity = await client.query(


      `INSERT INTO Activity (name, description, lastUpdate, lastUpdateById)
       VALUES ($1, $2, NOW(), $3)
       RETURNING id`,



      [name, description, lastUpdateById]
    );



    const id_activite = result_activity.rows[0].id;





    const check = await client.query(


      `SELECT 1 FROM practiceversionactivity
       WHERE practiceversionid = $1 AND sequence = $2`,



      [practiceVersionId, sequence]



    );



    if (check.rows.length > 0) {



      await client.query('ROLLBACK');


      return res.status(400).json({ error: "  " });


    }



    
    const activity_x = Number.isInteger(x) ? x : 0;


    const activity_y = Number.isInteger(y) ? y : 0;



    await client.query(




      `INSERT INTO practiceVersionActivity
       (practiceVersionId, activityId, sequence, x, y)
       VALUES ($1, $2, $3, $4, $5)`,



      [practiceVersionId, id_activite, sequence, activity_x, activity_y]



    );




    await client.query('COMMIT');



    res.json({ activityId: id_activite });



  } catch (error) {










    await client.query('ROLLBACK');
   


  } finally {













    client.release();




  }
});











// La route pour role
app.post('/role', async (req, res) => {
  const { name, description, lastUpdateById, practiceVersionId, typeId,  x,
    y } = req.body;


    const client = await pool.connect();

  try {

      await client.query('BEGIN');


    const result = await client.query(
      `INSERT INTO Role (name, description, lastUpdate, lastUpdateById)
       VALUES ($1, $2, NOW(), $3)
       RETURNING id`,
      [name, description, lastUpdateById]
    );

    const roleId = result.rows[0].id;


    
    const result_seqq = await client.query(
      `SELECT COALESCE(MAX(sequence), 0) + 1 AS next
       FROM practiceversionactivity
       WHERE practiceversionid = $1`,
      [practiceVersionId]
    );

    
    const sequence = result_seqq.rows[0].next;



   
    const role_x = Number.isInteger(x) ? x : 0;
    
    const role_y = Number.isInteger(y) ? y : 0;


    await client.query(
      `INSERT INTO practiceversionrole
       (practiceVersionId, roleid, sequence, x, y)
       VALUES ($1, $2, $3, $4, $5)`,
      [practiceVersionId, roleId, sequence, role_x, role_y]
    );

    
    
    
    await client.query(
      `INSERT INTO roleUse (practiceVersionId, roleId, typeId)
       VALUES ($1, $2, $3)`,
      [practiceVersionId, roleId, typeId || 1] 
    );

    
    await client.query('COMMIT');
    res.json({ roleId: roleId });

  } catch (error) {

   // console.error(error);
  }finally {


    client.release();
  }


});







// route pour workproduct
app.post('/workproduct', async (req, res) => {
  const { name, description, lastUpdateById, practiceVersionId,   x,
    y  } = req.body;


     const client = await pool.connect();

  try {


    await client.query('BEGIN');




    const result = await client.query(
      `INSERT INTO Workproduct (name, description, lastUpdate, lastUpdateById)
       VALUES ($1, $2, NOW(), $3)
       RETURNING id`,
      [name, description, lastUpdateById]
    );




    const workproductId = result.rows[0].id;

   


    
    const result_seqq = await client.query(
      `SELECT COALESCE(MAX(sequence), 0) + 1 AS next
       FROM practiceversionactivity
       WHERE practiceversionid = $1`,
      [practiceVersionId]
    );

    
    const sequence = result_seqq.rows[0].next;
    
      
    
         const work_x = Number.isInteger(x) ? x : 0;
    
    const work_y = Number.isInteger(y) ? y : 0;





    await client.query(
      `INSERT INTO practiceversionwork
       (practiceVersionId, workproductid, sequence, x, y)
       VALUES ($1, $2, $3, $4, $5)`,
      [practiceVersionId, workproductId, sequence, work_x, work_y]
    );
   




    await client.query(
      `INSERT INTO workproductPractice (practiceVersionId, workproductId)
       VALUES ($1, $2)`,
      [practiceVersionId, workproductId]
    );





    await client.query('COMMIT');
    res.json({ workproductId : workproductId  });



  } catch (error) {
   // console.error(error);



  }finally {


    client.release();
  }
});











app.post('/goal', async (req, res) => {
  const { name, description, practiceVersionId, x, y  } = req.body;



  const client = await pool.connect();

  try {

    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO Goal (name, description)
       VALUES ($1, $2)
       RETURNING id`,
      [name, description]
    );




    const goalId = result.rows[0].id;

    const result_seq = await client.query(
      `SELECT COALESCE(MAX(sequence), 0) + 1 AS next
       FROM practiceVersionGoal
       WHERE practiceVersionId = $1`,
      [practiceVersionId]
    );
    const sequence = result_seq.rows[0].next;
    const goal_x = Number.isInteger(x) ? x : 0;
    const goal_y = Number.isInteger(y) ? y : 0;





    await client.query(
      `INSERT INTO practiceversiongoal (practiceVersionId, goalId, sequence, x, y)
       VALUES ($1, $2, $3, $4, $5)`,
      [practiceVersionId, goalId, sequence, goal_x, goal_y]
    );
      await client.query('COMMIT');
   
    res.json({ goalId });
    
  } catch (error) {
    
    

    
  }finally {

    client.release();

  }
});









app.post('/metric', async (req, res) => {
  const { name, description, unit, scale, formula, lastUpdateById, practiceVersionId, x, y  } = req.body;



  const client = await pool.connect();


  try {

    await client.query('BEGIN'); 

    const result = await client.query(
      `INSERT INTO Metric (name, description, unit, scale, formula, lastUpdate, lastUpdateById)
       VALUES ($1, $2, $3, $4, $5, NOW(), $6)
       RETURNING id`,
      [name, description, unit, scale, formula, lastUpdateById]
    );

    const metricId = result.rows[0].id;




   

    const result_seq = await client.query(
      `SELECT COALESCE(MAX(sequence), 0) + 1 AS next
       FROM practiceVersionmetric
       WHERE practiceVersionId = $1`,
      [practiceVersionId]
    );
    const sequence = result_seq.rows[0].next;
    const metric_x = Number.isInteger(x) ? x : 0;
    const metric_y = Number.isInteger(y) ? y : 0;






   
    await client.query(
      `INSERT INTO metricPractice (practiceVersionId, metricId)
       VALUES ($1, $2)`,
      [practiceVersionId, metricId]
    );



     await client.query(
      `INSERT INTO practiceversionmetric (practiceVersionId, metricId, sequence, x, y)
       VALUES ($1, $2, $3, $4, $5)`,
      [practiceVersionId, metricId, sequence, metric_x, metric_y]
    );
      await client.query('COMMIT');
   
    

    res.json({ metricId });
  } catch (error) {
   // console.error(error);
    
  }finally {
    client.release();
  }

});











app.post('/context', async (req, res) => {




  const { description, practiceVersionId, x, y } = req.body;
  const client = await pool.connect();




  try {


    await client.query('BEGIN');

    const result = await client.query(
      'INSERT INTO Context (description) VALUES ($1) RETURNING id',
      [description]
    );



    const contextId = result.rows[0].id;




    const result_seq = await client.query(
      `SELECT COALESCE(MAX(sequence), 0) + 1 AS next
       FROM practiceversioncontext
       WHERE practiceVersionId = $1`,
      [practiceVersionId]
    );




    const sequence = result_seq.rows[0].next;
    const context_x =  Math.round(x) ;
    const context_y = Math.round(y) ;




    await client.query(
      `INSERT INTO practiceversioncontext
       (practiceVersionId, contextId, sequence, x, y)
       VALUES ($1, $2, $3, $4, $5)`,
      [practiceVersionId, contextId, sequence, context_x, context_y]
    );





    await client.query('COMMIT');
    
    
    res.json({ id: contextId });

  } catch (err) {



    await client.query('ROLLBACK');
    




  } finally {



    client.release();
  }
});


















// route poste de guideline
app.post('/guideline', async (req, res) => {
  const { name, description, content, lastUpdateById, practiceVersionId, methodVersionId, typeId, x, y  } = req.body;

  const client = await pool.connect();

  try {



    await client.query('BEGIN'); 


    const result = await client.query(
      `INSERT INTO Guideline (name, description, content, lastUpdate, lastUpdateById, practiceVersionId, methodVersionId, typeId)
       VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7)
       RETURNING id`,
      [name, description, content, lastUpdateById, practiceVersionId, methodVersionId || null, typeId || null]
    );

    const guidelineId = result.rows[0].id;






    const result_seq = await client.query(
      `SELECT COALESCE(MAX(sequence), 0) + 1 AS next
       FROM practiceVersionguide
       WHERE practiceVersionId = $1`,
      [practiceVersionId]
    );
    const sequence = result_seq.rows[0].next;
    const guide_x = Number.isInteger(x) ? x : 0;
    const guide_y = Number.isInteger(y) ? y : 0;






    
     await client.query(
      `INSERT INTO practiceversionguide (practiceVersionId, guidelineid, sequence, x, y)
       VALUES ($1, $2, $3, $4, $5)`,
      [practiceVersionId,    guidelineId  , sequence, guide_x, guide_y]
    );
      await client.query('COMMIT');




    res.json({ guidelineId });
  } catch (error) {
    // console.error(error);
    
  }

  finally {
    client.release();
  }


});

















// route poste de pitfall 
app.post('/pitfall', async (req, res) => {
  const { name, description, content, lastUpdateById, practiceVersionId,    x, y    } = req.body;





  const client = await pool.connect();


  try {



    await client.query('BEGIN'); 

    const result = await client.query(
      `INSERT INTO Pitfall (name, description, content, lastUpdate, lastUpdateById, practiceVersionId)
       VALUES ($1, $2, $3, NOW(), $4, $5)
       RETURNING id`,
      [name, description, content, lastUpdateById, practiceVersionId]
    );

    const pitfallId = result.rows[0].id;





    const result_seq = await client.query(
      `SELECT COALESCE(MAX(sequence), 0) + 1 AS next
       FROM practiceVersionpitfall
       WHERE practiceVersionId = $1`,
      [practiceVersionId]
    );


    const sequence = result_seq.rows[0].next;
    const pitfall_x = Number.isInteger(x) ? x : 0;
    const pitfall_y = Number.isInteger(y) ? y : 0;





    
    
     await client.query(
      `INSERT INTO practiceversionpitfall (practiceVersionId, pitfallid, sequence, x, y)
       VALUES ($1, $2, $3, $4, $5)`,
      [practiceVersionId,    pitfallId  , sequence, pitfall_x, pitfall_y]
    );
      await client.query('COMMIT');






    res.json({ pitfallId });
  } catch (error) {
    // console.error(error);
    
  }
});








// route pour benifit 
app.post('/benefit', async (req, res) => {
  const { name, description, content, lastUpdateById, practiceVersionId ,    x, y  } = req.body;



   const client = await pool.connect();




  try {




    await client.query('BEGIN');



    const result = await client.query(
      `INSERT INTO Benefit (name, description, content, lastUpdate, lastUpdateById, practiceVersionId)
       VALUES ($1, $2, $3, NOW(), $4, $5)
       RETURNING id`,
      [name, description, content, lastUpdateById, practiceVersionId]
    );

    const benefitId = result.rows[0].id;





    
    const result_seq = await client.query(
      `SELECT COALESCE(MAX(sequence), 0) + 1 AS next
       FROM practiceVersionbenefit
       WHERE practiceVersionId = $1`,
      [practiceVersionId]
    );


    const sequence = result_seq.rows[0].next;
    const benefit_x = Number.isInteger(x) ? x : 0;
    const benefit_y = Number.isInteger(y) ? y : 0;



    
     await client.query(
      `INSERT INTO practiceversionbenefit (practiceVersionId, benefitid, sequence, x, y)
       VALUES ($1, $2, $3, $4, $5)`,
      [practiceVersionId,  benefitId    , sequence,  benefit_x, benefit_y]
    );
      await client.query('COMMIT');





    res.json({ benefitId });
  } catch (error) {
    // console.error(error);
    
  }
});












app.get('/practiceVersion/:id/activities', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        a.id,
        a.name,
        a.description,
        pva.x,
        pva.y,
        pva.sequence
      FROM practiceversionactivity pva
      JOIN activity a ON a.id = pva.activityid
      WHERE pva.practiceversionid = $1
      ORDER BY pva.sequence ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).send('erreur activity');
  }
});

app.get('/practiceVersion/:id/goals', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.name,
        g.description,
        pvg.x,
        pvg.y,
        pvg.sequence
      FROM practiceversiongoal pvg
      JOIN Goal g ON g.id = pvg.goalId
      WHERE pvg.practiceVersionId = $1
      ORDER BY pvg.sequence ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    

  }
});





app.get('/practiceVersion/:id/roles', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.name,
        g.description,
        pvg.x,
        pvg.y,
        pvg.sequence
      FROM practiceversionrole pvg
      JOIN role g ON g.id = pvg.roleid
      WHERE pvg.practiceVersionId = $1
      ORDER BY pvg.sequence ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
   

  }
});




















app.get('/practiceVersion/:id/workproduct', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.name,
        g.description,
        pvg.x,
        pvg.y,
        pvg.sequence
      FROM practiceversionwork pvg
      JOIN workproduct g ON g.id = pvg.workproductid
      WHERE pvg.practiceVersionId = $1
      ORDER BY pvg.sequence ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
   
  }
});




app.get('/practiceVersion/:id/metric', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.name,
        g.unit,
        g.scale,
        g.formula,
        g.description,
        pvg.x,
        pvg.y,
        pvg.sequence
      FROM practiceversionmetric pvg
      JOIN metric g ON g.id = pvg.metricid
      WHERE pvg.practiceVersionId = $1
      ORDER BY pvg.sequence ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    
  }
});



















app.get('/practiceVersion/:id/guideline', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.name,
        g.content,
        g.description,
        g.typeid,
        pvg.x,
        pvg.y
      FROM guideline g
      JOIN practiceversionguide pvg ON g.id = pvg.guidelineid
      WHERE pvg.practiceVersionId = $1
      `,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    // Gestion d'erreur
  }
});
















app.get('/practiceVersion/:id/pitfall', async (req, res) => {
  
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.name,
        g.content,
        g.description,
        pvg.x,
        pvg.y,
        pvg.sequence
      FROM practiceversionpitfall pvg
      JOIN pitfall g ON g.id = pvg.pitfallid
      WHERE pvg.practiceVersionId = $1
      ORDER BY pvg.sequence ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    


  }
});


















app.get('/practiceVersion/:id/benefit', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.name,
        g.content,
        g.description,
        pvg.x,
        pvg.y,
        pvg.sequence
      FROM practiceversionbenefit pvg
      JOIN benefit g ON g.id = pvg.benefitid
      WHERE pvg.practiceVersionId = $1
      ORDER BY pvg.sequence ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
   
  }
});



app.get('/practiceVersion/:id/context', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.description,
        pvg.x,
        pvg.y,
        pvg.sequence
      FROM practiceversioncontext pvg
      JOIN context g ON g.id = pvg.contextid
      WHERE pvg.practiceVersionId = $1
      ORDER BY pvg.sequence ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
 


  }
});

















































app.post('/contextindicator', async (req, res) => {

  const { contextId, name, description, attributes, precision, value } = req.body;


  try {

    const result = await pool.query(
      `INSERT INTO contextIndicator 
       (contextId, name, description, attributes, precision, value)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [contextId, name, description, attributes, precision, value]
    );


    res.json(result.rows[0]);


  } catch (err) {
   


  }
});

















app.get('/contextindicator/all', async (req, res) => {
  try {




    const result = await pool.query('SELECT * FROM contextindicator');
    res.json(result.rows);
 
 
 
 
 
  } catch (err) {
  



  }
});





























app.post('/completioncriteria', async (req, res) => {




  const { name, description, practiceVersionId, lastUpdateById, x, y } = req.body;



  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO completioncriteria (name, description, lastupdate, lastupdatebyid, practiceversionid)
       VALUES ($1, $2, NOW(), $3, $4)
       RETURNING id`,
      [name, description, lastUpdateById, practiceVersionId]
    );

    const criteriaId = result.rows[0].id;

    const seqRes = await client.query(
      `SELECT COALESCE(MAX(sequence), 0) + 1 AS next
       FROM practiceversioncompletioncriteria
       WHERE practiceversionid = $1`,
      [practiceVersionId]
    );

    const sequence = seqRes.rows[0].next;

    await client.query(
      `INSERT INTO practiceversioncompletioncriteria
       (practiceversionid, completioncriteriaid, sequence, x, y)
       VALUES ($1, $2, $3, $4, $5)`,
      [practiceVersionId, criteriaId, sequence, x, y]
    );

    await client.query('COMMIT');
    res.json({ completioncriteriaId: criteriaId });

  } catch (err){


//console.error(err);


    await client.query('ROLLBACK');
    




  } finally {
    client.release();
  }
});




















app.get('/practiceVersion/:id/completioncriteria', async (req, res) => {



  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.name,
        g.description,
        pvg.x,
        pvg.y,
        pvg.sequence
      FROM practiceversioncompletioncriteria pvg
      JOIN completioncriteria g ON g.id = pvg.completioncriteriaid
      WHERE pvg.practiceVersionId = $1
      ORDER BY pvg.sequence ASC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
   

  }
});











app.get('/practiceVersion/:id/recommendations', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        r.id,
        r.description,
        r.contextid,
        r.lastupdate,
        r.lastupdatebyid,
        rt.id AS typeId,
        rt.name AS typeName,
        rs.id AS statusId,
        rs.name AS statusName,  
        pvg.x,
        pvg.y,
        pvg.sequence
      FROM practiceversionrecommendation pvg 
      JOIN recommendation r ON r.id = pvg.recommendationid
      LEFT JOIN recommendationtype rt ON r.typeid = rt.id
      LEFT JOIN recommendationstatus rs ON r.statusid = rs.id
      WHERE pvg.practiceVersionId = $1
      ORDER BY pvg.sequence ASC
    `, [id]);

    res.json(result.rows);
  } catch (error) {
   // console.error(error);
   
  }
});






















app.post('/recommendation', async (req, res) => {

  



  const {
    practiceVersionId,
    contextId,
    description,
    typeId,
    statusId,
    lastUpdateById,
    goalIds,  x, y  
  } = req.body;




  if (!practiceVersionId || !description || !typeId || !statusId || !lastUpdateById) {



    return res.status(400).json({ error: 'Champs obligatoiree' });
  }



  const client = await pool.connect();

  try {
    await client.query('BEGIN');

   




    const insertRecQuery = `
      INSERT INTO recommendation
      (practiceVersionId, contextId, description, typeId, statusId, lastUpdateById, lastUpdate)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id
    `;





    const recresult = await client.query(insertRecQuery, [




      practiceVersionId,
      contextId || null,
      description,
      typeId,
      statusId,
      lastUpdateById



    ]);





    const recommendationId = recresult.rows[0].id;





    



    if (Array.isArray(goalIds) && goalIds.length > 0) {




      const insertgoal = `
        INSERT INTO recommendationGoal (recommendationId, goalId)
        VALUES ($1, $2)
      `;



      for (const goalid of goalIds) {


        await client.query(insertgoal, [recommendationId, goalid]);



      }
    }




    const seqres = await client.query(


      `SELECT COALESCE(MAX(sequence), 0) + 1 AS next
       FROM practiceversionrecommendation
       WHERE practiceversionid = $1`,
      [practiceVersionId]


    );




    const sequence = seqres.rows[0].next;




    await client.query(
      `INSERT INTO practiceversionrecommendation
       (practiceversionid, recommendationid, sequence, x, y)
       VALUES ($1, $2, $3, $4, $5)`,
      [practiceVersionId, recommendationId, sequence, x, y]
    );






    await client.query('COMMIT');
    res.json({ recommendationId });




  } catch (error) {




    await client.query('ROLLBACK');
    




  } finally {
    client.release();
  }
});




















app.get('/practiceVersion/:id/recommendation-goals', async (req, res) => {



  const { id } = req.params;


  const result = await pool.query(`
    SELECT rg.recommendationid, rg.goalid
    FROM recommendationgoal rg
    JOIN recommendation r ON r.id = rg.recommendationid
    WHERE r.practiceversionid = $1
  `, [id]);



  res.json(result.rows);
});






























app.post('/recommendation/linkcontext', async (req, res) => {


  const { recommendationId, contextId } = req.body;




  try {



    await pool.query(
      `UPDATE recommendation
       SET contextId = $1
       WHERE id = $2`,
      [contextId, recommendationId]
    );



    res.json({ success: true });



  } catch (err) {




    console.error(err);
   




  }
});













app.post('/recommendation/linkGoal', async (req, res) => {



  const { recommendationId, goalId } = req.body;





  try {
    await pool.query(
      `INSERT INTO recommendationGoal (recommendationId, goalId)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [recommendationId, goalId]
    );




    res.json({ success: true });





  } catch (err) {






    console.error(err);
   



  }
});




















app.get('/practices/:id/versions', async (req, res) => {


  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        pv.id,
        pv.versionname,
        pv.changedescription,
        pv.versiontimestamp,
        u.name AS universe
      FROM practiceversion pv
      JOIN universe u ON u.id = pv.universeid
      WHERE pv.practiceid = $1
      ORDER BY pv.versiontimestamp DESC
    `, [id]);


    res.json(result.rows);
  
  
  
  } catch (error) {
    
  }
});






























app.post('/practiceAssociation', async (req, res) => {


  const { sourcePracticeVersionId, targetPracticeVersionId, typeId } = req.body;


  try {
    const result = await pool.query(
      `INSERT INTO practiceAssociation
       (sourcePracticeVersionId, targetPracticeVersionId, typeId)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [sourcePracticeVersionId, targetPracticeVersionId, typeId]
    );

    res.json(result.rows[0]);
  
  
  } catch (err) {
    
   // console.error(err);
  
  
  
  }
});





















app.get('/practiceassociation', async (req, res) => {



  try {



    const { teamId } = req.query;
    
    if (!teamId) {
      


    }
    


    const parseteamid = parseInt(teamId, 10);



    if (isNaN(parseteamid)) {

    

    }



    const result = await pool.query(`




      SELECT


        pa.id,

        spv.id AS sourcepracticeversionid,

        sp.name AS sourcepracticename,

        spv.versionname AS sourcepracticeversionname,

        su.name AS sourcepracticeuniverse,

        su.teamid AS sourceteamid,

        tpv.id AS targetpracticeversionid,


        tp.name AS targetpracticename,



        tpv.versionname AS targetpracticeversionname,


        tu.name AS targetpracticeuniverse,



        tu.teamid AS targetteamid,


        at.name AS associationtype



      FROM practiceAssociation pa


      JOIN practiceVersion spv ON pa.sourcePracticeVersionId = spv.id

      JOIN practice sp ON spv.practiceId = sp.id

      JOIN universe su ON spv.universeid = su.id

      JOIN practiceVersion tpv ON pa.targetPracticeVersionId = tpv.id


      JOIN practice tp ON tpv.practiceId = tp.id


      JOIN universe tu ON tpv.universeid = tu.id

      JOIN practiceAssociationType at ON pa.typeId = at.id





      WHERE su.teamid = $1 OR tu.teamid = $1


      ORDER BY sp.name, tp.name



    `, [parseteamid]);



    res.json(result.rows);



  } catch (err) {


    



    
  }
});










app.get('/practiceAssociationTypes', async (req, res) => {

  const result = await pool.query('SELECT * FROM practiceAssociationType');

  res.json(result.rows);

});









app.get('/practiceversions', async (req, res) => {


  try {
    const result = await pool.query(`
      SELECT 
        pv.id,
        pv.versionname,
        pv.changedescription,
        pv.versiontimestamp,
        p.name AS practicename,
        u.name AS universe
      FROM practiceversion pv
      JOIN practice p ON p.id = pv.practiceid
      JOIN universe u ON u.id = pv.universeid
      ORDER BY p.name, pv.versiontimestamp DESC
    `);

    res.json(result.rows);




  } catch (err) {


   // console.error(err);
   



  }
});

























app.post('/method', async (req, res) => {


  const { name, objective, description, typeId } = req.body;



  try {



    const result = await pool.query(
      `INSERT INTO Method (name, objective, description, typeId)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, objective, description, typeId]

    );

    res.json(result.rows[0]);


  } catch (err) {
   





  }
});














app.get('/methods', async (req, res) => {



  try {


    const result = await pool.query(`
      SELECT m.*, mt.name AS type
      FROM Method m
      JOIN methodType mt ON m.typeId = mt.id
      ORDER BY m.id DESC
    `);




    res.json(result.rows);



  } catch (err) {







  }
});
































app.get('/practiceVersion/:id/affinities', async (req, res) => {

  const pratiqueverisonid = parseInt(req.params.id);


  try {
    const result = await pool.query(





      `
      SELECT 
        ap.id AS affinityPracticeId,
        asv.id AS versionId,
        asv.version,
        asv.versionNote,
        asv.itemId AS surveyId,
        asurvey.content,
        asurvey.description,
        asurvey.comment
      FROM affinityPractice ap
      JOIN affinitySurveyVersion asv ON ap.itemId = asv.id
      JOIN affinitySurvey asurvey ON asv.itemId = asurvey.id
      WHERE ap.practiceVersionId = $1
      `,
      [pratiqueverisonid]







    );
    res.json(result.rows);




  } catch (err) {




  }
});



















app.post('/methodVersion', async (req, res) => {




  const {
    methodId,
    universeId,
    versionName,
    changeDescription,
    lastUpdateById
  } = req.body;





  try {


    const result = await pool.query(
      `INSERT INTO methodVersion
       (methodId, universeId, versionName, changeDescription, lastUpdate, lastUpdateById)
       VALUES ($1, $2, $3, $4, NOW(), $5)
       RETURNING *`,
      [methodId, universeId, versionName, changeDescription, lastUpdateById]
    );





    res.json(result.rows[0]);
  } 
  
  catch (err) {



  
  
  
  }
});




























app.get('/methods/:id/versions', async (req, res) => {


  const { id } = req.params;

  try {



    const result = await pool.query(
      `SELECT mv.*, u.name AS universe
       FROM methodVersion mv
       JOIN Universe u ON mv.universeId = u.id
       WHERE mv.methodId = $1
       ORDER BY mv.versionTimestamp DESC`,
      [id]
    );


    res.json(result.rows);
  
  
  } catch (err) {
  
  
  }
});













app.get('/methodtypes', async (req, res) => {


  try {


    const result = await pool.query(
      'SELECT id, name, description FROM methodType ORDER BY id ASC'
    
    
    );

    
    res.json(result.rows);
  
  
  
  
  } catch (err) {
  
  
  

  
  
  
  }
});

















































app.post('/practiceMethod', async (req, res) => {



  const { practiceVersionId, methodVersionIds } = req.body;

  const client = await pool.connect();



  try {


    await client.query('BEGIN');

    for (const mvid of methodVersionIds) {
      await client.query(
        `INSERT INTO practicemethod (practiceversionid, methodversionid)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [practiceVersionId, mvid]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'association cree ' });


  } catch {


    
    await client.query('ROLLBACK');
    
  } finally {






    client.release();


  }
});































app.get('/practicemethodeasssocaition', async (req, res) => {




  try {

     let { teamId } = req.query;

     
    teamId = parseInt(teamId, 10)




   const result = await pool.query(`













  SELECT 
    pv.id            AS practiceversionid,



    pv.versionname   AS practiceversionname,



    p.name           AS practicename,



    pu.name          AS practiceuniverse,

    mv.id            AS methodversionid,



    mv.versionname   AS methodversionname,


    m.name           AS methodname,



    mu.name          AS methoduniverse



  FROM practicemethod pm


  JOIN practiceversion pv ON pv.id = pm.practiceversionid

  JOIN practice p ON p.id = pv.practiceid

  JOIN universe pu ON pu.id = pv.universeid


  JOIN methodversion mv ON mv.id = pm.methodversionid




  JOIN method m ON m.id = mv.methodid

  JOIN universe mu ON mu.id = mv.universeid



  WHERE pu.teamid = $1 OR mu.teamid = $1  


  ORDER BY p.name, pv.versiontimestamp DESC











`, [teamId]);  







    res.json(result.rows);




  } catch (err) {




    //console.error(err);
   
  }
});






















//partie des users 













const bcrypt = require("bcrypt");



























app.post("/register", async (req, res) => {




  const { name, email, password, roleId } = req.body; 






  if (!name || !email || !password || !roleId) {
    return res.status(400).json({ error: "remplis tous les champs " });
  }







  try {



    
    const verifieruser = await pool.query("SELECT * FROM Person WHERE email = $1", [email]);




    if (verifieruser.rows.length > 0) {


      return res.status(400).json({ error: "invalide" });



    }








    const verifierrole = await pool.query("SELECT * FROM roleType WHERE id = $1", [roleId]);




    if (verifierrole.rows.length === 0) {




      return res.status(400).json({ error: "invalide" });



    }




    const saltround = 10;


    const hashpassword = await bcrypt.hash(password, saltround);




    const result = await pool.query(

      "INSERT INTO Person (name, email, passwordHash, roleId) VALUES ($1, $2, $3, $4) RETURNING id, name, email",
      [name, email, hashpassword, roleId]


    );




    res.status(201).json({ message: "user crée ", user: result.rows[0] });





  } catch (err) {












  }
});








app.get("/roles", async (req, res) => {




  try {



    const result = await pool.query("SELECT id, name FROM roleType WHERE name != 'Team Member'");

    res.json(result.rows);






  } catch (err) {



  }
});




























































app.post("/login", async (req, res) => {
  const { email, password } = req.body;




  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe oblig" });
  }




  try {




    const result = await pool.query("SELECT * FROM Person WHERE email = $1", [email]);


    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Email ou mot de passe incorrect." });
    }




    const user = result.rows[0];

   

    const validmotdepasse = await bcrypt.compare(password, user.passwordhash);



    if (!validmotdepasse) {

      return res.status(400).json({ error: " incorrect" });


    }

    




    res.json({ message: " connexion réussie ", user: { id: user.id, name: user.name, email: user.email, roleId: user.roleid } });
 
 
 
 
 
  } catch (err) {



   




  }
});


















app.post("/teams", async (req, res) => {
  const { name, description, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ error: "Nom de la team et utilisateur requis" });
  }

  try {
   



    const teamresukt = await pool.query(
      "INSERT INTO Team (name, description) VALUES ($1, $2) RETURNING id, name, description",
      [name, description]




    );





    const team = teamresukt.rows[0];

   




    await pool.query(
      "INSERT INTO teamMember (teamId, personId) VALUES ($1, $2)",
      [team.id, userId]
    );






    res.status(201).json({
      message: "good",
      team
    });




  } catch (err) {







  }
});





























app.get("/myteams", async (req, res) => {





   const userid = parseInt(req.query.userId, 10);




  if (isNaN(userid)) {


    
  }





  try {


    const result = await pool.query(



      `SELECT t.id, t.name, t.description
       FROM team t
       JOIN teamMember tm ON t.id = tm.teamId
       WHERE tm.personId = $1`,



      [userid]
    );






    res.json(result.rows); 


  } catch (err) {





  }
});















app.get("/team/:id", async (req, res) => {





  const teamid = parseInt(req.params.id);




  try {



    
    const memberres = await pool.query(


      `SELECT p.id, p.name, p.email
       FROM person p
       JOIN teamMember tm ON p.id = tm.personId
       WHERE tm.teamId = $1`,


      [teamid]
    );





    const universres = await pool.query(


      `SELECT id, name, description
       FROM Universe
       WHERE teamId = $1`,



      [teamid]

    );









    const universid = universres.rows.map(u => u.id);





    
    let practiceres = { rows: [] };




    if (universid.length > 0) {



      practiceres = await pool.query(


        `SELECT pv.id AS practiceVersionId, p.id AS practiceId, p.name AS practiceName, pv.versionName, pv.changeDescription
         FROM practiceVersion pv
         JOIN Practice p ON pv.practiceId = p.id
         JOIN PracticeVersionUniverse pvu ON pv.id = pvu.practiceVersionId
         WHERE pvu.universeId = ANY($1) AND pvu.isActive = TRUE`,



        [universid]
      );
    }

    res.json({
      members: memberres.rows,
      practices: practiceres.rows
    });

  } catch (err) {












  }
});










app.get("/teams/:teamId/pratiques", async (req, res) => {











  const { teamId } = req.params;






  try {





    const result = await pool.query(




      `
      SELECT DISTINCT
        p.id,
        p.name,


        p.objective,
        p.description,

        pt.name AS type
      FROM Team t


      JOIN Universe u ON u.teamId = t.id

      JOIN PracticeVersion pv ON pv.universeId = u.id

      JOIN Practice p ON p.id = pv.practiceId


      LEFT JOIN practiceType pt ON pt.id = p.typeId

      JOIN PracticeVersionUniverse pvu 
        ON pvu.practiceVersionId = pv.id


       AND pvu.universeId = u.id


      WHERE t.id = $1


        AND pvu.isActive = true
      `,



      [teamId]
    );




    res.json(result.rows);
  } catch (err) {






  }
});







app.get('/teams/:teamId/practiceversions', async (req, res) => {





  const { teamId } = req.params;



  try {
    const result = await pool.query(




      `
      SELECT pv.id, p.name AS practicename, pv.versionname, u.name AS universe, pv.changedescription
      FROM practiceversion pv


      JOIN practice p ON p.id = pv.practiceid


      JOIN universe u ON u.id = pv.universeid

      WHERE u.teamid = $1
      ORDER BY p.name, pv.versionname

      `,





      [teamId]
    );


    res.json(result.rows);
  } catch (error) {






  }
});




































































//Ajout memebre pour la team 



app.post("/team/:id/add-member", async (req, res) => {



  const teamid = req.params.id;
  const { email } = req.body;





  try {



    
    const user = await pool.query(



      "SELECT id, name, email FROM Person WHERE email = $1",



      [email]
    );






    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User introuvable" });
    }






    const idperson = user.rows[0].id;








    const exist = await pool.query(




      "SELECT * FROM teamMember WHERE teamId = $1 AND personId = $2",



      [teamid, idperson]
    );






    if (exist.rows.length > 0) {
      return res.status(400).json({ message: "User déjà dans la team" });
    }





    await pool.query(



      "INSERT INTO teamMember (teamId, personId) VALUES ($1, $2)",



      [teamid, idperson]
    );




    res.json({
      message: "user ajouté",
      newMember: user.rows[0]
    });





  } catch (err) {
  









  }
});










































app.post('/universe', async (req, res) => {
  const { teamId, name, description } = req.body;

  


  if (!teamId || !name) {
    return res.status(400).json({
      error: 'teamId et name sont obligatoires'
    });
  }



  try {
    const result = await pool.query(
      `INSERT INTO Universe (teamId, name, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [teamId, name, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
   



  }
});










































app.get('/practiceVersion/:id', async (req, res) => {



  const { id } = req.params;



  try {



    const result = await pool.query(









      `
      SELECT
        pv.id,
        pv.versionname,
        p.id   AS practiceid,
        p.name AS practicename,
        u.id   AS universeid,
        u.name AS universename,
        u.teamid AS teamid   -- 👈 ajout du teamId
      FROM practiceversion pv
      JOIN practice p ON p.id = pv.practiceid
      JOIN PracticeVersionUniverse pvu
        ON pvu.practiceVersionId = pv.id
        AND pvu.isActive = true
      JOIN universe u
        ON u.id = pvu.universeId
      WHERE pv.id = $1
      `,









      [id]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'non troyuvee' });
    }



    res.json(result.rows[0]);






  } catch (error) {
   





  }
});























app.get('/practiceVersion/:id/methodVersions', async (req, res) => {
  const pratiqueversionid = parseInt(req.params.id);
  
  try {
    const result = await pool.query(








      `
      SELECT 
        mv.id,
        mv.methodId,
        m.name AS "methodName",
        mv.universeId,
        u.name AS "universe",
        mv.versionName,
        mv.changeDescription,
        -- Pour l'instant on met des valeurs par défaut pour x et y,
        -- mais vous pourrez les stocker plus tard dans la table si besoin.
        300 AS x,
        200 AS y
      FROM practiceMethod pm
      JOIN methodVersion mv ON pm.methodVersionId = mv.id
      JOIN method m ON mv.methodId = m.id
      JOIN universe u ON mv.universeId = u.id
      WHERE pm.practiceVersionId = $1
      `,










      [pratiqueversionid]
    );
    
    res.json(result.rows);
  } catch (err) {
 

  }
});



















app.get('/practiceVersion/:id/associations', async (req, res) => {
  const { id } = req.params;



  try {
    const result = await pool.query(









      `
      SELECT 
        pa.id AS associationId,
        pa.typeid AS associationTypeId,
        pv.id AS associatedPracticeVersionId,
        pv.practiceid AS practiceId,
        pv.versionname,
        pv.versiontimestamp,
        pv.changedescription,
        pv.lastupdate,
        pv.lastupdatebyid
      FROM practiceassociation pa
      JOIN practiceversion pv
        ON pv.id = CASE 
                     WHEN pa.sourcepracticeversionid = $1 THEN pa.targetpracticeversionid
                     WHEN pa.targetpracticeversionid = $1 THEN pa.sourcepracticeversionid
                   END
      WHERE pa.sourcepracticeversionid = $1 OR pa.targetpracticeversionid = $1
      ORDER BY pa.id ASC
      `,












      [id]
    );

    res.json(result.rows);

  } catch (error) {
   






  }
});





















app.get('/teams/:teamId/members', async (req, res) => {
  const teamId = parseInt(req.params.teamId);
  try {
    const result = await pool.query(






      `SELECT p.id, p.name, p.email
       FROM person p
       JOIN teamMember tm ON p.id = tm.personId
       WHERE tm.teamId = $1`,










      [teamId]
    );
    res.json(result.rows);


  } catch (err) {
   





  }
});



























app.get('/bfProfileStatus', async (req, res) => {







  try {




    const result = await pool.query(
      'SELECT id, name, description FROM bfProfileStatus ORDER BY id'
    );



    res.json(result.rows);



  } catch (err) {

    

  }
});

















app.get('/bfProfile', async (req, res) => {
  const { personId } = req.query;
  



  if (!personId) {
    return res.status(400).json({ error: 'Le paramètre personId est requis' });
  }





  try {

    const result = await pool.query(



      'SELECT * FROM bfProfile WHERE personId = $1',






      [personId]
    );







    res.json(result.rows[0] || null);









  } catch (err) {
    









  }
});






















app.post('/bfProfile', async (req, res) => {




  const { personId, statusId, o, c, e, a, n } = req.body;








  if (!personId || !statusId) {



    
  }


  try {


    
    const existing = await pool.query(




      'SELECT id FROM bfProfile WHERE personId = $1',




      [personId]
    );







    if (existing.rows.length > 0) {
      



    }





    const result = await pool.query(




      `INSERT INTO bfProfile (personId, statusId, o, c, e, a, n)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,





      [personId, statusId, o, c, e, a, n]
    );













    res.json(result.rows[0]);
  } catch (err) {





  }
});
































app.put('/bfProfile/:id', async (req, res) => {









  const { id } = req.params;


  const { statusId, o, c, e, a, n } = req.body;




  try {
  
    const fields = [];
    const values = [];
    let paramIndex = 1;



    if (statusId !== undefined) {
      fields.push(`statusId = $${paramIndex++}`);
      values.push(statusId);
    }


    if (o !== undefined) {
      fields.push(`o = $${paramIndex++}`);
      values.push(o);
    }



    if (c !== undefined) {
      fields.push(`c = $${paramIndex++}`);
      values.push(c);
    }



    if (e !== undefined) {
      fields.push(`e = $${paramIndex++}`);
      values.push(e);
    }



    if (a !== undefined) {
      fields.push(`a = $${paramIndex++}`);
      values.push(a);
    }



    if (n !== undefined) {
      fields.push(`n = $${paramIndex++}`);
      values.push(n);
    }






    if (fields.length === 0) {


      
    }





    values.push(id);


    const query = `UPDATE bfProfile SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;




    const result = await pool.query(query, values);






    if (result.rows.length === 0) {
    




    }




    res.json(result.rows[0]);











  } catch (err) {








  }
});






app.listen(port, () => {



   console.log(`server demare au  http://localhost:${port}`);



});

























































app.post('/affinitySurvey', async (req, res) => {




  const { content, description, comment } = req.body;




  try {



    const result = await pool.query(
      `INSERT INTO affinitySurvey (content, description, comment)
       VALUES ($1, $2, $3) RETURNING id`,
      [content, description, comment]
    );



    res.json({ id: result.rows[0].id });




  } catch (err) {





  }
});


















app.post('/affinitySurveyVersion', async (req, res) => {






  const { itemId, version, versionNote } = req.body;





  
  try {






    const result = await pool.query(







      `INSERT INTO affinitySurveyVersion (itemId, version, versionNote)
       VALUES ($1, $2, $3) RETURNING id`,








      [itemId, version, versionNote]
    );










    res.json({ id: result.rows[0].id });








  } catch (err) {







    
  }
});














app.post('/affinityPractice', async (req, res) => {





  const { itemId, practiceVersionId, x, y } = req.body;





  try {





    const result = await pool.query(







      `INSERT INTO affinityPractice (itemId, practiceVersionId, x, y) VALUES ($1, $2, $3, $4) RETURNING id`,










      [itemId, practiceVersionId, x || 0, y || 0]
    );




    res.json({ id: result.rows[0].id });





  } catch (err) {








  }
});

















































app.get('/practiceVersion/:id/affinityResults', async (req, res) => {







  const pratiqueversionid = parseInt(req.params.id);










  try {



    const result = await pool.query(









      `
      SELECT 
        ar.id,
        ar.personId,
        ar.itemId,
        ar.result,
        ar.x,
        ar.y,
        p.name AS personName,
        p.email AS personEmail,
        asv.id AS affinityVersionId
      FROM affinitySurveyResults ar
      JOIN affinitySurveyVersion asv ON ar.itemId = asv.id
      JOIN affinityPractice ap ON asv.id = ap.itemId
      JOIN person p ON ar.personId = p.id
      WHERE ap.practiceVersionId = $1
      `,















      [pratiqueversionid]
    );
    res.json(result.rows);
  } catch (err) {






















  }
});
















app.post('/personPracticeAffinity', async (req, res) => {















  const { personId, practiceVersionId, affinity } = req.body;











  if (!personId || !practiceVersionId || affinity === undefined) {









  }












  try {





    const check = await pool.query(







      'SELECT id FROM personPracticeAffinity WHERE personId = $1 AND practiceVersionId = $2',





      [personId, practiceVersionId]
    );





    let result;











    if (check.rows.length > 0) {
     
      result = await pool.query(



        'UPDATE personPracticeAffinity SET affinity = $1 WHERE id = $2 RETURNING id',







        [affinity, check.rows[0].id]








      );

    } else {





      result = await pool.query(






        'INSERT INTO personPracticeAffinity (personId, practiceVersionId, affinity) VALUES ($1, $2, $3) RETURNING id',





        [personId, practiceVersionId, affinity]






      );
    }


    res.json({ id: result.rows[0].id });


















  } catch (err) {











  }
});



















app.get('/practiceVersion/:id/personAffinities', async (req, res) => {









  const pratiqueversionid = parseInt(req.params.id);









  try {









    const result = await pool.query(








      `SELECT personId, affinity FROM personPracticeAffinity WHERE practiceVersionId = $1`,













      [pratiqueversionid]
    );






    res.json(result.rows);










  } catch (err) {












  }
});



























































app.get('/guidelineTypes', async (req, res) => {







  try {








    const result = await pool.query('SELECT id, name, description FROM guidelinetype ORDER BY name');






    res.json(result.rows);











  } catch (err) {





  }
});











app.post('/guidelineTypes', async (req, res) => {










  const { name, description } = req.body;










  if (!name) {







  }










  try {







    const result = await pool.query(







      'INSERT INTO guidelinetype (name, description) VALUES ($1, $2) RETURNING id',






      [name, description]
    );







    res.json({ id: result.rows[0].id });








  } catch (err) {









    if (err.code === '23505') {


    }






    res.status(500).send('err');


  }
});














app.put('/guideline/:id/type', async (req, res) => {






  const { id } = req.params;
  const { typeId } = req.body;











  if (!typeId) {













  }









  try {








    const result = await pool.query(









      'UPDATE guideline SET typeId = $1 WHERE id = $2 RETURNING id',












      [typeId, id]









    );










    if (result.rows.length === 0) {











    }










    res.json({ success: true });













  } catch (err) {







  }
});


































































app.get('/practiceVersion/:id/member-positions', async (req, res) => {




  const { id } = req.params;



  try {


    const result = await pool.query(



      'SELECT personId, x, y FROM practiceVersionMember WHERE practiceVersionId = $1',





      [id]
    );



    res.json(result.rows);




  } catch (err) {







    
  }
});













app.post('/practiceVersion/:id/member-position', async (req, res) => {







  const { id } = req.params;
  const { personId, x, y } = req.body;











  try {

    await pool.query(











      `INSERT INTO practiceVersionMember (practiceVersionId, personId, x, y)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (practiceVersionId, personId)
       DO UPDATE SET x = EXCLUDED.x, y = EXCLUDED.y`,

















      [id, personId, x, y]
    );












    res.json({ success: true });
  } catch (err) {

  



  }
});
















app.get('/practiceVersion/:id/affinity-positions', async (req, res) => {





  const { id } = req.params;






  try {










    const result = await pool.query(





      'SELECT itemId AS affinityversionid, x, y FROM affinityPractice WHERE practiceVersionId = $1',







      [id]
    );



    res.json(result.rows);






  } catch (err) {









  }
});

















app.post('/practiceVersion/:id/affinity-position', async (req, res) => {



  const { id } = req.params; 
  const { affinityVersionId, x, y } = req.body;





  try {



    await pool.query(







      `UPDATE affinityPractice SET x = $1, y = $2 WHERE practiceVersionId = $3 AND itemId = $4`,







      [x, y, id, affinityVersionId]
    );


    res.json({ success: true });





  } catch (err) {






  }
});












app.post('/practiceVersion/:id/recommendation-position', async (req, res) => {








  const { id } = req.params; 
  const { recommendationId, x, y } = req.body;







  try {




    await pool.query(





      `UPDATE practiceversionrecommendation SET x = $1, y = $2 
       WHERE practiceversionid = $3 AND recommendationid = $4`,










      [x, y, id, recommendationId]


    );


    res.json({ success: true });


  } catch (err) {







  }
});


















app.post('/practiceVersion/:id/context-position', async (req, res) => {










  const { id } = req.params; 
  const { contextId, x, y } = req.body;











  try {





    await pool.query(






      `UPDATE practiceversioncontext SET x = $1, y = $2 
       WHERE practiceversionid = $3 AND contextid = $4`,







      [x, y, id, contextId]





    );
    res.json({ success: true });

  } catch (err) {







  }
});












app.post('/practiceVersion/:id/role-position', async (req, res) => {










  const { id } = req.params; 

  const { roleId, x, y } = req.body;









  try {




    await pool.query(








      `UPDATE practiceversionrole SET x = $1, y = $2 
       WHERE practiceversionid = $3 AND roleid = $4`,













      [x, y, id, roleId]


    );



    res.json({ success: true });



  } catch (err) {



    






  }
});













app.post('/practiceVersion/:id/workproduct-position', async (req, res) => {










  const { id } = req.params; 
  const { workproductId, x, y } = req.body;






  try {



    await pool.query(














      `UPDATE practiceversionwork SET x = $1, y = $2 
       WHERE practiceversionid = $3 AND workproductid = $4`,












      [x, y, id, workproductId]







    );




    res.json({ success: true });




  } catch (err) {












  }
});
















app.post('/practiceVersion/:id/goal-position', async (req, res) => {





  const { id } = req.params; 
  const { goalId, x, y } = req.body;






  try {
    await pool.query(







      `UPDATE practiceversiongoal SET x = $1, y = $2 
       WHERE practiceversionid = $3 AND goalid = $4`,









      [x, y, id, goalId]










    );







    res.json({ success: true });





  } catch (err) {










  }
});









app.post('/practiceVersion/:id/metric-position', async (req, res) => {






  const { id } = req.params; 
  const { metricId, x, y } = req.body;








  try {




    await pool.query(








      `UPDATE practiceversionmetric SET x = $1, y = $2 
       WHERE practiceversionid = $3 AND metricid = $4`,










      [x, y, id, metricId]

    );




    res.json({ success: true });




  } catch (err) {







  }
});











app.post('/practiceVersion/:id/guideline-position', async (req, res) => {









  const { id } = req.params; 
  const { guidelineId, x, y } = req.body;




  try {




    await pool.query(







      `UPDATE practiceversionguide SET x = $1, y = $2 
       WHERE practiceversionid = $3 AND guidelineid = $4`,










      [x, y, id, guidelineId]
    );




    res.json({ success: true });






  } catch (err) {








  }
});








app.post('/practiceVersion/:id/pitfall-position', async (req, res) => {



  const { id } = req.params; 
  const { pitfallId, x, y } = req.body;



  try {


    await pool.query(
      `UPDATE practiceversionpitfall SET x = $1, y = $2 
       WHERE practiceversionid = $3 AND pitfallid = $4`,
      [x, y, id, pitfallId]
    );




    res.json({ success: true });


  } catch (err) {



  }
});

















app.post('/practiceVersion/:id/activity-position', async (req, res) => {








  const { id } = req.params; 


  const { activityId, x, y } = req.body;




  try {





    await pool.query(










      `UPDATE practiceversionactivity SET x = $1, y = $2 
       WHERE practiceversionid = $3 AND activityid = $4`,












      [x, y, id, activityId]








    );



    res.json({ success: true });





  } catch (err) {





    
  }
});












































app.post('/practiceVersion/:id/benefit-position', async (req, res) => {






  const { id } = req.params;

  const { benefitId, x, y } = req.body;







  try {






    await pool.query(





      `UPDATE practiceversionbenefit SET x = $1, y = $2 
       WHERE practiceversionid = $3 AND benefitid = $4`,








      [x, y, id, benefitId]


    );


    res.json({ success: true });





  } catch (err) {














  }
});






































app.post('/practiceVersion/:id/completioncriteria-position', async (req, res) => {







  const { id } = req.params; 
  const { completioncriteriaId, x, y } = req.body;









  try {
    await pool.query(



      
      `UPDATE practiceversioncompletioncriteria SET x = $1, y = $2 
       WHERE practiceversionid = $3 AND completioncriteriaid = $4`,


      [x, y, id, completioncriteriaId]




    );



    res.json({ success: true });

  } catch (err) {




    
  }
});






































//Les routes deletes 









app.delete('/activity/:id', async (req, res) => {



  const { id } = req.params;

  const client = await pool.connect();

  try {



    await client.query('BEGIN');


    await client.query('DELETE FROM practiceversionactivity WHERE activityId = $1', [id]);



    const result = await client.query('DELETE FROM activity WHERE id = $1 RETURNING id', [id]);



    await client.query('COMMIT');



    if (result.rowCount === 0) return res.status(404).json({ error: 'Not' });




    res.json({ success: true, id: result.rows[0].id });



  } catch (err) {



    await client.query('ROLLBACK');
  
  
  } finally {








    client.release();



  }
});













app.delete('/role/:id', async (req, res) => {



  const { id } = req.params;


  const client = await pool.connect();



  try {


    await client.query('BEGIN');


    await client.query('DELETE FROM practiceversionrole WHERE roleId = $1', [id]);



    await client.query('DELETE FROM roleUse WHERE roleId = $1', [id]);



    const result = await client.query('DELETE FROM role WHERE id = $1 RETURNING id', [id]);



    await client.query('COMMIT');



    if (result.rowCount === 0) return res.status(404).json({ error: 'Not' });


    res.json({ success: true, id: result.rows[0].id });


  } catch (err) {


    await client.query('ROLLBACK');





 
  } finally {











    client.release();





  }
});














app.delete('/workproduct/:id', async (req, res) => {





  const { id } = req.params;

  const client = await pool.connect();




  try {


    await client.query('BEGIN');


    await client.query('DELETE FROM practiceversionwork WHERE workproductId = $1', [id]);


    await client.query('DELETE FROM workproductPractice WHERE workproductId = $1', [id]);


    const result = await client.query('DELETE FROM workproduct WHERE id = $1 RETURNING id', [id]);



    await client.query('COMMIT');



    if (result.rowCount === 0) return res.status(404).json({ error: 'not' });



    res.json({ success: true, id: result.rows[0].id });






  } catch (err) {



    await client.query('ROLLBACK');



   



  } finally {






    client.release();





  }
});






















app.delete('/goal/:id', async (req, res) => {










  const { id } = req.params;




  const client = await pool.connect();







  try {








    await client.query('BEGIN');



    await client.query('DELETE FROM practiceversiongoal WHERE goalId = $1', [id]);


    await client.query('DELETE FROM recommendationGoal WHERE goalId = $1', [id]);



    const result = await client.query('DELETE FROM goal WHERE id = $1 RETURNING id', [id]);



    await client.query('COMMIT');




    if (result.rowCount === 0) return res.status(404).json({ error: 'Not' });




    res.json({ success: true, id: result.rows[0].id });





  } catch (err) {




    await client.query('ROLLBACK');
 








  } finally {













    client.release();














  }
});























app.delete('/metric/:id', async (req, res) => {










  const { id } = req.params;



  const client = await pool.connect();




  try {




    await client.query('BEGIN');



    await client.query('DELETE FROM practiceversionmetric WHERE metricId = $1', [id]);



    await client.query('DELETE FROM metricPractice WHERE metricId = $1', [id]);



    const result = await client.query('DELETE FROM metric WHERE id = $1 RETURNING id', [id]);




    await client.query('COMMIT');





    if (result.rowCount === 0) return res.status(404).json({ error: 'not d' });



    res.json({ success: true, id: result.rows[0].id });




  } catch (err) {



    await client.query('ROLLBACK');



  







  } finally {








    client.release();








  }
});








app.delete('/guideline/:id', async (req, res) => {








  const { id } = req.params;



  const client = await pool.connect();



  try {




    await client.query('BEGIN');

    await client.query('DELETE FROM practiceversionguide WHERE guidelineId = $1', [id]);



    const result = await client.query('DELETE FROM guideline WHERE id = $1 RETURNING id', [id]);



    await client.query('COMMIT');



    if (result.rowCount === 0) return res.status(404).json({ error: 'not ' });



    res.json({ success: true, id: result.rows[0].id });



     
  } catch (err) {




    await client.query('ROLLBACK');

   


  } finally {









    client.release();





  }
});















app.delete('/pitfall/:id', async (req, res) => {









  const { id } = req.params;


  const client = await pool.connect();




  try {



    await client.query('BEGIN');



    await client.query('DELETE FROM practiceversionpitfall WHERE pitfallId = $1', [id]);



    const result = await client.query('DELETE FROM pitfall WHERE id = $1 RETURNING id', [id]);



    await client.query('COMMIT');



    if (result.rowCount === 0) return res.status(404).json({ error: 'not' });




    res.json({ success: true, id: result.rows[0].id });




  } catch (err) {




    await client.query('ROLLBACK');


    
  } finally {






    client.release();















  }



});




















app.delete('/benefit/:id', async (req, res) => {











  const { id } = req.params;





  const client = await pool.connect();







  try {





    await client.query('BEGIN');




    await client.query('DELETE FROM practiceversionbenefit WHERE benefitId = $1', [id]);





    const result = await client.query('DELETE FROM benefit WHERE id = $1 RETURNING id', [id]);






    await client.query('COMMIT');







    if (result.rowCount === 0) return res.status(404).json({ error: 'Benefit not found' });








    res.json({ success: true, id: result.rows[0].id });






  } catch (err) {









    await client.query('ROLLBACK');






    
  } finally {









    client.release();












  }
});





















app.delete('/context/:id', async (req, res) => {









  const { id } = req.params;






  const client = await pool.connect();












  try {








    await client.query('BEGIN');





    await client.query('DELETE FROM contextIndicator WHERE contextId = $1', [id]);



    await client.query('DELETE FROM practiceversioncontext WHERE contextId = $1', [id]);





    const result = await client.query('DELETE FROM context WHERE id = $1 RETURNING id', [id]);






    await client.query('COMMIT');








    if (result.rowCount === 0) return res.status(404).json({ error: 'not' });








    res.json({ success: true, id: result.rows[0].id });








  } catch (err) {









    await client.query('ROLLBACK');






  } finally {










    client.release();












  }
});




















app.delete('/completioncriteria/:id', async (req, res) => {











  const { id } = req.params;







  const client = await pool.connect();






  try {







    await client.query('BEGIN');



    await client.query('DELETE FROM practiceversioncompletioncriteria WHERE completioncriteriaId = $1', [id]);







    const result = await client.query('DELETE FROM completioncriteria WHERE id = $1 RETURNING id', [id]);






    await client.query('COMMIT');







    if (result.rowCount === 0) return res.status(404).json({ error: 'not' });



    res.json({ success: true, id: result.rows[0].id });






  } catch (err) {






    await client.query('ROLLBACK');




    


  } finally {







    client.release();










  }
});
















app.delete('/recommendation/:id', async (req, res) => {







  const { id } = req.params;



  const client = await pool.connect();






  try {





    await client.query('BEGIN');


    await client.query('DELETE FROM recommendationGoal WHERE recommendationId = $1', [id]);


    await client.query('DELETE FROM practiceversionrecommendation WHERE recommendationId = $1', [id]);



    const result = await client.query('DELETE FROM recommendation WHERE id = $1 RETURNING id', [id]);



    await client.query('COMMIT');


    if (result.rowCount === 0) return res.status(404).json({ error: 'not' });


    res.json({ success: true, id: result.rows[0].id });



  } catch (err) {



    await client.query('ROLLBACK');


    
  } finally {



    client.release();



  }
});


















app.delete('/affinity/:id', async (req, res) => {




  const { id } = req.params; 


  const client = await pool.connect();



  try {




    await client.query('BEGIN');



    await client.query('DELETE FROM affinitySurveyResults WHERE itemId = $1', [id]);


    await client.query('DELETE FROM affinityPractice WHERE itemId = $1', [id]);


    
    const version = await client.query('SELECT itemId FROM affinitySurveyVersion WHERE id = $1', [id]);




    if (version.rows.length === 0) {



      await client.query('ROLLBACK');


      return res.status(404).json({ error: 'not' });


    }



    const surveyId = version.rows[0].itemId;


    
    await client.query('DELETE FROM affinitySurveyVersion WHERE id = $1', [id]);

    
    const otherVersions = await client.query('SELECT id FROM affinitySurveyVersion WHERE itemId = $1', [surveyId]);
   
   
    if (otherVersions.rows.length === 0) {



      await client.query('DELETE FROM affinitySurvey WHERE id = $1', [surveyId]);



    }



    await client.query('COMMIT');



    res.json({ success: true, id: parseInt(id) });




  } catch (err) {







    await client.query('ROLLBACK');


    







  } finally {




    client.release();









  }
});











































































//affinity


app.get('/affinitySurvey/active', async (req, res) => {



  try {



    const result = await pool.query(`







      SELECT s.id as surveyId, s.content, s.description, s.comment, v.id as versionId, v.version
      FROM affinitySurvey s
      JOIN LATERAL (
        SELECT id, version
        FROM affinitySurveyVersion
        WHERE itemId = s.id
        ORDER BY version DESC
        LIMIT 1
      ) v ON true
      ORDER BY s.id







    `);






    res.json(result.rows);






  } catch (err) {







  }
});

















app.get('/affinitySurveyResults', async (req, res) => {








  const { personId } = req.query;






  if (!personId) return res.status(400).json({ error: 'personid requir' });







  try {



    const result = await pool.query(



      'SELECT itemId, result FROM affinitySurveyResults WHERE personId = $1',




      [personId]


    );




    res.json(result.rows);






  } catch (err) {












  }
});




















app.post('/affinitySurveyResults', async (req, res) => {









  const { personId, itemId, result, x, y } = req.body;









  if (!personId || !itemId || result === undefined) {




    return res.status(400).json({ error: 'Champs requis' });






  }











  try {





    const query = `







      INSERT INTO affinitySurveyResults (personId, itemId, result, x, y)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (personId, itemId) DO UPDATE
      SET result = EXCLUDED.result, x = EXCLUDED.x, y = EXCLUDED.y
      RETURNING id, x, y






    `;






    const values = [personId, itemId, result, x || 0, y || 0];





    const dbResult = await pool.query(query, values);







    res.json({ id: dbResult.rows[0].id, x: dbResult.rows[0].x, y: dbResult.rows[0].y });








  } catch (err) {








  }
});
























app.post('/bfProfile/calculate/:personId', async (req, res) => {






  const personId = parseInt(req.params.personId);




  if (isNaN(personId)) {






    return res.status(400).json({ error: 'id invalide' });



  }



  const client = await pool.connect();






  try {







    await client.query('BEGIN');

   
    
    const result = await client.query(`



      SELECT asr.result, asr.itemId, ast.trait
      FROM affinitySurveyResults asr
      JOIN affinitySurveyVersion asv ON asr.itemId = asv.id
      JOIN affinitySurvey ast ON asv.itemId = ast.id
      WHERE asr.personId = $1 AND ast.trait IS NOT NULL





    `,
    
    
    
    
    
    
    
    [personId]);




    if (result.rows.length === 0) {



      await client.query('ROLLBACK');



      return res.status(400).json({ error: 'aucune réponse ' });



    }





    
    const scores = { O: [], C: [], E: [], A: [], N: [] };


    result.rows.forEach(row => {


      const trait = row.trait;


      if (scores[trait]) scores[trait].push(row.result);



    });




    const avg = {};


    for (let trait of ['O','C','E','A','N']) {



      if (scores[trait].length > 0) {



        const mean = scores[trait].reduce((a,b) => a + b, 0) / scores[trait].length;


        avg[trait] = (mean - 1) / 4;

      } else {


        avg[trait] = null; 


      }
    }


    
    const existing = await client.query(



      'SELECT id FROM bfProfile WHERE personId = $1',



      [personId]



    );




    let query;


    let values;


    if (existing.rows.length > 0) {


      query = `



        UPDATE bfProfile
        SET o = $1, c = $2, e = $3, a = $4, n = $5, statusId = 3  -- 3 = Complete (à adapter)
        WHERE personId = $6
        RETURNING id



      `;




      values = [avg.O, avg.C, avg.E, avg.A, avg.N, personId];




    } else {



      
      query = `



        INSERT INTO bfProfile (personId, statusId, o, c, e, a, n)
        VALUES ($1, 3, $2, $3, $4, $5, $6)
        RETURNING id



      `;




      values = [personId, avg.O, avg.C, avg.E, avg.A, avg.N];




    }



    const updateresult = await client.query(query, values);



    await client.query('COMMIT');

    res.json({ success: true, profileId: updateresult.rows[0].id });



  } catch (err) {



    await client.query('ROLLBACK');



   


  } finally {




    client.release();




  }
});













app.get('/practiceVersion/:id/affinityItems', async (req, res) => {




  const versionId = parseInt(req.params.id);



  try {



    const result = await pool.query(`




      SELECT ap.itemId, asv.version, asurvey.content, asurvey.description
      FROM affinityPractice ap
      JOIN affinitySurveyVersion asv ON ap.itemId = asv.id
      JOIN affinitySurvey asurvey ON asv.itemId = asurvey.id
      WHERE ap.practiceVersionId = $1




    `, [versionId]);




    res.json(result.rows);




  } catch (err) {



  
  }
});




app.get('/practiceVersion/:id/memberScores', async (req, res) => {


  const versionId = parseInt(req.params.id);


  const { teamId } = req.query;


  if (!teamId) return res.status(400).json({ error: 'teamid err' });

       

  try {
  

    const items = await pool.query(`

    

      SELECT itemId FROM affinityPractice WHERE practiceVersionId = $1

    

    `, [versionId]);

  

    if (items.rows.length === 0) {

     

      return res.json([]); 

    

    }




    const itemsid = items.rows.map(r => r.itemid);



    const members = await pool.query(`





      SELECT p.id, p.name, p.email
      FROM teamMember tm
      JOIN person p ON tm.personId = p.id
      WHERE tm.teamId = $1



    `, [teamId]);




    const scores = [];




    for (const member of members.rows) {



      const res = await pool.query(`

      

      
        SELECT AVG(result) as avg_score
        FROM affinitySurveyResults
        WHERE personId = $1 AND itemId = ANY($2::int[])

      


      `, [member.id, itemsid]);

    

      const avg = res.rows[0].avg_score;

      

      scores.push({
        memberId: member.id,
        name: member.name,
        email: member.email,
        averageScore: avg ? parseFloat(avg) : null
      });

    

    }


    res.json(scores);



  } catch (err) {








  }
});






























app.get('/roleusetypes', async (req, res) => {



  try {



    const result = await pool.query(


      'SELECT id, name, description FROM roleUseType ORDER BY name'



    );


    res.json(result.rows);



  } catch (err) {



    
  }
});








app.get('/methodversions', async (req, res) => {


  try {


    const result = await pool.query(`


      SELECT
        mv.id,
        mv.methodId,
        m.name AS methodName,
        mv.versionName,
        mv.changeDescription,
        u.name AS universeName
      FROM methodVersion mv
      JOIN method m ON mv.methodId = m.id
      JOIN universe u ON mv.universeId = u.id
      ORDER BY m.name, mv.versionName



    `);



    res.json(result.rows);



  } catch (err) {



    
  }
});
































app.get('/goals', async (req, res) => {



  try {



    const result = await pool.query('SELECT id, name, description FROM Goal ORDER BY name');



    res.json(result.rows);



  } catch (err) {


    
  }
});































app.post('/practiceVersion/:id/link-goal', async (req, res) => {




  const practiceVersionId = parseInt(req.params.id);



  const { goalId, x, y } = req.body;




  if (!goalId || x === undefined || y === undefined) {






    return res.status(400).json({ error: 'requis' });






  }



  const client = await pool.connect();



  try {








    await client.query('BEGIN');

    


    const existing = await client.query(



      `SELECT 1 FROM practiceversiongoal 
       WHERE practiceVersionId = $1 AND goalId = $2`,



      [practiceVersionId, goalId]



    );








    if (existing.rows.length > 0) {


      
      await client.query(




        `UPDATE practiceversiongoal 
         SET x = $1, y = $2 
         WHERE practiceVersionId = $3 AND goalId = $4`,




        [x, y, practiceVersionId, goalId]



      );



    } else {







      
      const seqres = await client.query(



        `SELECT COALESCE(MAX(sequence), 0) + 1 AS next 
         FROM practiceversiongoal 
         WHERE practiceVersionId = $1`,



        [practiceVersionId]


      );



      const sequence = seqres.rows[0].next;



      await client.query(



        `INSERT INTO practiceversiongoal (practiceVersionId, goalId, sequence, x, y)
         VALUES ($1, $2, $3, $4, $5)`,




        [practiceVersionId, goalId, sequence, x, y]




      );
    }




    await client.query('COMMIT');



    res.json({ success: true, goalId });




  } catch (err) {




    await client.query('ROLLBACK');



    
  } finally {







    client.release();








  }

});





module.exports = app;