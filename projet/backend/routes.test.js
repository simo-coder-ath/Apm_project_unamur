/**
 * @fileoverview tests d'intégration pour l'api Express avec Jest Supertest et mock de PostgreSQL
 * 
 * 
 * 
 * @module tests/server.test
 * 
 * 
 * 
 * @requires supertest
 * 
 * 
 * 
 * @requires pg
 * 
 * 
 * 
 * 
 * @requires ../server
 *
 * @description
 * ce fichier contient les tests unitaires et d'intégration pour toutes les routes d'api
 * 
 * 
 * il utilise Jest comme framework de test et Supertest pour simuler des requêtes http
 * et mock de la bibliothèque pg pour éviter les accès réels à la base de données
 *
 * 
 * 
 * 
 * 
 * structure des test : 
 * 
 * 
 * - Le module pg est mocké globalement pour remplacer pool et client par des mocks Jest
 * 
 * 
 * - chaque suite de tests describe correspond à une route ou un groupe de routes
 * 
 * 
 * - les scénarios it vérifient les comportements attendus (succès - erreurs-  transactions)
 * 
 * 
 * - les assertions utilisent expect de Jest et vérifient les statuts http et les corps de réponse
 *   et les appels aux méthodes mockées query, connect, release
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * mocks utilisé : 
 * 
 * 
 * - mockpool : instance mockée du pool de connexions
 * 
 * 
 * - mockclient : client mocké utilisé pour les transactions
 * 
 * 
 * 
 * - les méthodes mockResolvedValue et mockRejectedValue simulent les résultats des requêtes SQL.
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * routes testées : 
 * 
 * - GET /pratiques, /practicetypes, /universes, /universes/:teamId
 * 
 * - POST /practice, /practiceVersion, /activity, /role, /workproduct, /goal, /metric,
 *   /context, /guideline, /pitfall, /benefit, /contextindicator, /completioncriteria,
 *   /recommendation, /practiceAssociation, /method, /methodVersion, /register, /login,
 *   /teams, /universe, /bfProfile, /affinitySurvey, /affinitySurveyVersion, /affinityPractice,
 *   /affinitySurveyResults, /personPracticeAffinity, /guidelineTypes
 * 
 * - GET /practiceVersion/:id/ activities, goals, roles, workproduct, metric, guideline,
 *   pitfall, benefit, context, recommendations, completioncriteria, affinities...
 * 
 * - routes de mise à jour de position /practiceVersion/:id/position
 * 
 * - routes de suppression /activity/:id, /role/:id, ...
 *
 * 
 * 
 * 
 * 
 * chaque test vérifie les statuts http et le format des réponses ainsi que le comportement
 * des transactions ( rollback en cas d'erreur
 *
 * 
 * 
 * 
 * 
 * 
 */












const request = require('supertest');



const { Pool } = require('pg');



const app = require('./server'); 










jest.mock('pg', () => {

  const mpool = {

    query: jest.fn(),
    connect: jest.fn(),

  };


  return { Pool: jest.fn(() => mpool) };


});


const mockpool = new Pool();



describe('test routes api ', () => {


  beforeEach(() => {

    jest.clearAllMocks(); 


  });




  describe('GET /pratiques', () => {
    it('retourn list pratique', async () => {

      const fakerows = [

        { id: 1, name: 'Pratique 1', description: 'Desc1', objective: 'Obj1', type: 'Type1' },

        { id: 2, name: 'Pratique 2', description: 'Desc2', objective: 'Obj2', type: 'Type2' },

      ];




      mockpool.query.mockResolvedValue({ rows: fakerows });



      
      const res = await request(app).get('/pratiques');

      expect(res.statusCode).toBe(200);
      
      
      expect(res.body).toEqual(fakerows);
      
      
      expect(mockpool.query).toHaveBeenCalledTimes(1);
      
      
      
      expect(mockpool.query.mock.calls[0][0]).toContain('SELECT p.id, p.name');





    });





    it('normalment erreur BD ', async () => {





      mockpool.query.mockRejectedValue(new Error('BD erreurr'));




      const res = await request(app).get('/pratiques');





      expect(mockpool.query).toHaveBeenCalled();




    });
  });








  describe('GET /practicetypes', () => {





    it('retournes types pratiques ', async () => {



      const fakerow = [{ id: 1, name: 'Type1' }, { id: 2, name: 'Type2' }];


      mockpool.query.mockResolvedValue({ rows: fakerow });




      const res = await request(app).get('/practicetypes');



      expect(res.statusCode).toBe(200);


      expect(res.body).toEqual(fakerow);



    });








    it('erreur', async () => {



      mockpool.query.mockRejectedValue(new Error('DB erreuuur'));



      const res = await request(app).get('/practicetypes');

      
      expect(res.statusCode).toBe(500);
      
      
      expect(res.text).toBe('erreur');
   
   
   
    });
  




});





  describe('POST /practiceVersion', () => {




    it('creer version pratique', async () => {



      
      
        const fakeInsertResult = {
      
      
            rows: [{
          id: 123,
          practiceId: 1,
          universeId: 2,
          versionName: 'v1',
          changeDescription: 'desc',
          lastUpdateById: 42
      
      
      
        }]
      
    
    
    };



    
      mockpool.query.mockResolvedValueOnce(fakeInsertResult);
    
    
    
    

      mockpool.query.mockResolvedValueOnce({ rows: [] });



      
      const newpracticeversion = {
      

        
        practiceId: 1,
        
        universeId: 2,
        
        versionName: 'v1',
        
        
        changeDescription: 'desc',
        
        
        
        
        lastUpdateById: 42
     
    
    
    };



      const res = await request(app)
    
    
      .post('/practiceVersion')
    
    
    
        .send(newpracticeversion);

      expect(res.statusCode).toBe(200);


      
      expect(res.body).toEqual(fakeInsertResult.rows[0]);
      
      
      
      expect(mockpool.query).toHaveBeenCalledTimes(2);
    
    
    
    
    });





    it('erreuur ', async () => {



      mockpool.query.mockRejectedValue(new Error('Ierreur'));




      const res = await request(app)


        .post('/practiceVersion')



        .send({ practiceId: 1, universeId: 2, versionName: 'v1' });




      expect(res.statusCode).toBe(500);



      expect(res.text).toBe('erreur');




    });


  });
  


































  describe('POST /practice', () => {



    it('creer une pratique', async () => {


      const fakepractice = {

        id: 1,

        name: 'Ma pratique',

        description: 'Desc',

        objective: 'Obj',

        typeId: 2

      };



      mockpool.query.mockResolvedValue({ rows: [fakepractice] });








      const res = await request(app)


        .post('/practice')


        .send({


          name: 'Ma pratique',
          description: 'Desc',
          objective: 'Obj',
          typeId: 2


        });









      expect(res.statusCode).toBe(200);


      expect(res.body).toEqual(fakepractice);




    });























    it('renvoyer une erreur ', async () => {


      mockpool.query.mockRejectedValue(new Error(' error'));




      const res = await request(app)




        .post('/practice')

        .send({ name: 'Test' });







      expect(res.statusCode).toBe(500);


      expect(res.text).toBe('erreur');



    });
  });
















  describe('GET /universes', () => {



    it('retourner liste des univer', async () => {



      const fakeunivers = [{ id: 1, name: 'Univ1' }, { id: 2, name: 'Univ2' }];


      mockpool.query.mockResolvedValue({ rows: fakeunivers });



      const res = await request(app).get('/universes');



      expect(res.statusCode).toBe(200);


      expect(res.body).toEqual(fakeunivers);











    });




























    it('renvoyer une erreur 500 en cas ', async () => {


      mockpool.query.mockRejectedValue(new Error(' error'));




      const res = await request(app).get('/universes');




      expect(res.statusCode).toBe(500);



      expect(res.text).toBe('erreur srvr');




    });
  });


















  describe('GET /universes/:teamId', () => {



    it('devrait retourner les univers d’une team', async () => {



      const fakeuni = [{ id: 1, name: 'Univ1' }];


      mockpool.query.mockResolvedValue({ rows: fakeuni });










      const res = await request(app).get('/universes/123');



      expect(res.statusCode).toBe(200);



      expect(res.body).toEqual(fakeuni);




      expect(mockpool.query.mock.calls[0][1]).toEqual([123]); 
    });










    it('gérer une erreur', async () => {



        
      mockpool.query.mockRejectedValue(new Error('error'));






      const res = await request(app).get('/universes/123');












      expect(mockpool.query).toHaveBeenCalled();
    });
  });
































  describe('POST /activity', () => {







    it('creer une activite avec succes', async () => {

      const mockclient = {

        query: jest.fn(),

        release: jest.fn(),

      };

      mockpool.connect.mockResolvedValue(mockclient);



      mockclient.query

        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({ rows: [{ id: 42 }] }) 
        .mockResolvedValueOnce({ rows: [{ next: 5 }] }) 
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({}); 



      const res = await request(app)



        .post('/activity')


        .send({



          name: 'Activité test',


          description: 'Description',


          lastUpdateById: 1,


          practiceVersionId: 10,



          x: 100,


          y: 200



        });



















      expect(res.statusCode).toBe(200);



      expect(res.body.activityId).toBe(42);


      expect(mockclient.query).toHaveBeenCalledTimes(5);


      expect(mockclient.release).toHaveBeenCalled();



    });





    it('annuler transaction ', async () => {

      const mockclient = {

        query: jest.fn(),

        release: jest.fn(),

      };

      mockpool.connect.mockResolvedValue(mockclient);



      mockclient.query


        .mockResolvedValueOnce({}) 
        .mockRejectedValueOnce(new Error('Insert failed'));




      const res = await request(app)

        .post('/activity')

        .send({

          name: 'Activité test',

          description: 'Description',

          lastUpdateById: 1,

          practiceVersionId: 10,

          x: 100,

          y: 200



        });


        
      expect(mockclient.release).toHaveBeenCalled();



    });

  });















  describe('POST /role', () => {



    it('ceer un rôle avec succees', async () => {


      const mockClient = {


        query: jest.fn(),


        release: jest.fn(),


      };



      mockpool.connect.mockResolvedValue(mockClient);




      mockClient.query


        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({ rows: [{ id: 7 }] }) 
        .mockResolvedValueOnce({ rows: [{ next: 3 }] }) 
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({}); 



      const res = await request(app)


        .post('/role')


        .send({


          name: 'Admin',

          description: 'Administrateur',
          lastUpdateById: 1,



          practiceVersionId: 10,

          typeId: 2,


          x: 50,


          y: 60


        });











      expect(res.statusCode).toBe(200);


      expect(res.body.roleId).toBe(7);

      expect(mockClient.query).toHaveBeenCalledTimes(6);


      expect(mockClient.release).toHaveBeenCalled();


    });

  });




























  describe('POST /workproduct', () => {


    it('devrait créer un workproduct avec succès', async () => {



      const mockclient = {



        query: jest.fn(),



        release: jest.fn(),



      };



      mockpool.connect.mockResolvedValue(mockclient);




      mockclient.query


        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({ rows: [{ id: 9 }] }) 
        .mockResolvedValueOnce({ rows: [{ next: 2 }] }) 
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({}); 




      const res = await request(app)


        .post('/workproduct')

        .send({

          name: 'Doc',

          description: 'Document',

          lastUpdateById: 1,

          practiceVersionId: 10,

          x: 30,
          y: 40

        });


      expect(res.statusCode).toBe(200);

      expect(res.body.workproductId).toBe(9);


      expect(mockclient.query).toHaveBeenCalledTimes(6);



      expect(mockclient.release).toHaveBeenCalled();



    });



  });

















  describe('POST /goal', () => {

    
    it('creer obje avec sucees ', async () => {




      const mockclien = {


        query: jest.fn(),


        release: jest.fn(),



      };





      mockpool.connect.mockResolvedValue(mockclien);




      mockclien.query



        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({ rows: [{ id: 5 }] }) 
        .mockResolvedValueOnce({ rows: [{ next: 4 }] }) 
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({}); 





      const res = await request(app)


        .post('/goal')
        .send({



          name: 'Objectif',


          description: 'Desc',
          practiceVersionId: 10,
          x: 10,

          y: 20


        });







      expect(res.statusCode).toBe(200);
      expect(res.body.goalId).toBe(5);


      expect(mockclien.query).toHaveBeenCalledTimes(5);
      expect(mockclien.release).toHaveBeenCalled();

    });
  });















  describe('POST /metric', () => {


    it('creeer   metrique avec succees', async () => {



      const mockclient = {

        query: jest.fn(),

        release: jest.fn(),


      };





      mockpool.connect.mockResolvedValue(mockclient);



      mockclient.query

        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({ rows: [{ id: 8 }] }) 
        .mockResolvedValueOnce({ rows: [{ next: 1 }] }) 
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({}); 







      const res = await request(app)


        .post('/metric')

        .send({



          name: 'Métrique',
          description: 'Desc',
          unit: 'unit',

          scale: 'scale',

          formula: 'formula',

          lastUpdateById: 1,

          practiceVersionId: 10,


          x: 5,
          y: 5





        });









      expect(res.statusCode).toBe(200);

      expect(res.body.metricId).toBe(8);


      expect(mockclient.query).toHaveBeenCalledTimes(6);


      expect(mockclient.release).toHaveBeenCalled();







    });
  });







  describe('POST /context', () => {




    it('creer context ', async () => {


      const mockclien = {



        query: jest.fn(),
        release: jest.fn(),


      };




      mockpool.connect.mockResolvedValue(mockclien);




      mockclien.query


        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({ rows: [{ id: 12 }] }) 
        .mockResolvedValueOnce({ rows: [{ next: 7 }] }) 
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({}); 




      const res = await request(app)



        .post('/context')



        .send({



          description: 'Contexte',
          practiceVersionId: 10,
          x: 15,


          y: 25


        });




      expect(res.statusCode).toBe(200);


      expect(res.body.id).toBe(12);


      expect(mockclien.query).toHaveBeenCalledTimes(5);


      expect(mockclien.release).toHaveBeenCalled();










    });


























    it('effectuer rollback', async () => {



      const mockclien = {


        query: jest.fn(),


        release: jest.fn(),


      };



      mockpool.connect.mockResolvedValue(mockclien);





      mockclien.query
        .mockResolvedValueOnce({}) 
        
        .mockRejectedValueOnce(new Error('error')); 
        




        
      mockclien.query.mockResolvedValueOnce({}); 



      const res = await request(app)








        .post('/context')


        .send({


          description: 'Contexte',
          practiceVersionId: 10,
          x: 15,



          y: 25



        });











      expect(mockclien.release).toHaveBeenCalled();
    });
  });




















  describe('POST /guideline', () => {





    it('guideline', async () => {






      const mockclien = {


        query: jest.fn(),


        release: jest.fn(),
      };










      mockpool.connect.mockResolvedValue(mockclien);



      mockclien.query


        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({ rows: [{ id: 3 }] }) 
        .mockResolvedValueOnce({ rows: [{ next: 6 }] }) 
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({}); 



      const res = await request(app)
        .post('/guideline')


        .send({
          name: 'Guide',

          
          description: 'Desc',
          content: 'Contenu',


          lastUpdateById: 1,


          practiceVersionId: 10,



          methodVersionId: null,


          typeId: 1,
          x: 100,
          y: 200



        });













      expect(res.statusCode).toBe(200);


      expect(res.body.guidelineId).toBe(3);


      expect(mockclien.query).toHaveBeenCalledTimes(5);


      expect(mockclien.release).toHaveBeenCalled();
    });
  });
});























describe('POST /pitfall', () => {



  it(' pitfall ', async () => {







    const mockclien = {



      query: jest.fn(),
      release: jest.fn(),
    };







    mockpool.connect.mockResolvedValue(mockclien);







    mockclien.query


      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({ rows: [{ id: 15 }] }) 
      .mockResolvedValueOnce({ rows: [{ next: 3 }] }) 
      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({}); 











    const res = await request(app)
      .post('/pitfall')


      .send({
        name: 'Piège',


        description: 'Description',
        content: 'Contenu',


        lastUpdateById: 1,
        practiceVersionId: 10,



        x: 45,
        y: 55,



      });







    expect(res.status).toBe(200);
    expect(res.body.pitfallId).toBe(15);






    expect(mockclien.query).toHaveBeenCalledTimes(5);

    expect(mockclien.release).toHaveBeenCalled();
  });
});


































describe('POST /benefit', () => {


    
  it(' benefit', async () => {



    const mockclien = {



      query: jest.fn(),
      release: jest.fn(),





    };









    mockpool.connect.mockResolvedValue(mockclien);










    mockclien.query


      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({ rows: [{ id: 22 }] }) 
      .mockResolvedValueOnce({ rows: [{ next: 7 }] }) 
      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({}); 











    const res = await request(app)


      .post('/benefit')
      .send({


        name: 'Avantage',
        description: 'Desc',


        content: 'Contenu',

        lastUpdateById: 1,


        practiceVersionId: 10,


        x: 10,


        y: 20,


      });











    expect(res.status).toBe(200);


    expect(res.body.benefitId).toBe(22);







  });
});































describe('GET /practiceVersion/:id/activities', () => {


  it('renvoie versions ', async () => {



    const fakelignes = [





      { id: 1, name: 'Act1', description: 'Desc1', x: 10, y: 20, sequence: 1 },






    ];






    mockpool.query.mockResolvedValue({ rows: fakelignes });




    

    const res = await request(app).get('/practiceVersion/123/activities');


    expect(res.status).toBe(200);



    expect(res.body).toEqual(fakelignes);









  });














  it('erreur 500', async () => {






    mockpool.query.mockRejectedValue(new Error('fail'));








    const res = await request(app).get('/practiceVersion/123/activities');







    expect(res.status).toBe(500);






    expect(res.text).toBe('erreur ');









  });
});






























describe('GET /practiceVersion/:id/goals', () => {






  it('les objectif', async () => {







    const fakelignes = [{ id: 1, name: 'Goal1', description: 'Desc', x: 0, y: 0, sequence: 1 }];






    mockpool.query.mockResolvedValue({ rows: fakelignes });







    const res = await request(app).get('/practiceVersion/123/goals');





    expect(res.status).toBe(200);




    expect(res.body).toEqual(fakelignes);








  });












});










































describe('GET /roles/practiceVersion/:id', () => {





  it('renvoie les rôles', async () => {










    const fakelignes = [{ id: 1, name: 'Role1', description: 'Desc', x: 0, y: 0, sequence: 1 }];







    mockpool.query.mockResolvedValue({ rows: fakelignes });



    const res = await request(app).get('/practiceVersion/123/roles');




    expect(res.status).toBe(200);





    expect(res.body).toEqual(fakelignes);







  });
});











describe('GET /practiceVersion/:id/workproduct', () => {





  it(' workproducts', async () => {





    const fakelignes = [{ id: 1, name: 'WP1', description: 'Desc', x: 0, y: 0, sequence: 1 }];



    mockpool.query.mockResolvedValue({ rows: fakelignes });





    const res = await request(app).get('/practiceVersion/123/workproduct');







    expect(res.status).toBe(200);







    expect(res.body).toEqual(fakelignes);










  });
});































































describe('GET /practiceVersion/:id/metric', () => {





    
  it('metriques', async () => {


    const fakelignes = [{





      id: 1, name: 'Metric1', unit: 'u', scale: 's', formula: 'f',







      description: 'Desc', x: 0, y: 0, sequence: 1






    }];















    mockpool.query.mockResolvedValue({ rows: fakelignes });










    const res = await request(app).get('/practiceVersion/123/metric');









    expect(res.status).toBe(200);








    expect(res.body).toEqual(fakelignes);



  });
});











































describe('GET /practiceVersion/:id/guideline', () => {











    
  it('guidelines', async () => {











    const fakelignes = [{ id: 1, name: 'Guide', content: '...', description: 'Desc', typeid: 1, x: 0, y: 0 }];







    mockpool.query.mockResolvedValue({ rows: fakelignes });






    const res = await request(app).get('/practiceVersion/123/guideline');






    expect(res.status).toBe(200);






    expect(res.body).toEqual(fakelignes);












  });
});







































describe('GET /practiceVersion/:id/pitfall', () => {







  it(' pitfalls', async () => {







    const fakelignes = [{ id: 1, name: 'Pit', content: '...', description: 'Desc', x: 0, y: 0, sequence: 1 }];




    mockpool.query.mockResolvedValue({ rows: fakelignes });









    const res = await request(app).get('/practiceVersion/123/pitfall');






    expect(res.status).toBe(200);



    expect(res.body).toEqual(fakelignes);







  });
});






























describe('GET /practiceVersion/:id/benefit', () => {









  it('rbenefits', async () => {



    const fakelignes = [{ id: 1, name: 'Ben', content: '...', description: 'Desc', x: 0, y: 0, sequence: 1 }];




    mockpool.query.mockResolvedValue({ rows: fakelignes });









    const res = await request(app).get('/practiceVersion/123/benefit');













    expect(res.status).toBe(200);




    expect(res.body).toEqual(fakelignes);





  });
});


























describe('GET /practiceVersion/:id/context', () => {



  it(' contextes', async () => {








    const fakelignes = [{ id: 1, description: 'Ctx', x: 0, y: 0, sequence: 1 }];







    mockpool.query.mockResolvedValue({ rows: fakelignes });














    const res = await request(app).get('/practiceVersion/123/context');








    expect(res.status).toBe(200);









    expect(res.body).toEqual(fakelignes);
  });
});



































describe('POST /contextindicator', () => {











  it('indicc contexte', async () => {






    const fakeindic = {





      id: 7,
      contextId: 1,

      name: 'Indic',
      description: 'Desc',




      attributes: 'attr',
      precision: 2,

      value: 'val',
    };










    mockpool.query.mockResolvedValue({ rows: [fakeindic] });








    const res = await request(app)



      .post('/contextindicator')





      .send({









        contextId: 1,
        name: 'Indic',
        description: 'Desc',
        attributes: 'attr',
        precision: 2,
        value: 'val',







      });









    expect(res.status).toBe(200);




    expect(res.body).toEqual(fakeindic);







  });
});









































describe('GET /contextindicator/all', () => {










  it('les indics  ', async () => {






    
    const fakelignes = [{ id: 1, name: 'Indic1' }];




    mockpool.query.mockResolvedValue({ rows: fakelignes });






    const res = await request(app).get('/contextindicator/all');






    expect(res.status).toBe(200);









    expect(res.body).toEqual(fakelignes);
















  });
});





































describe('POST /completioncriteria', () => {







  it('crreeer  critere  compléti', async () => {




    
    const mockclien = {


      query: jest.fn(),
      release: jest.fn(),







    };

    mockpool.connect.mockResolvedValue(mockclien);









    mockclien.query

      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({ rows: [{ id: 33 }] }) 
      .mockResolvedValueOnce({ rows: [{ next: 4 }] }) 
      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({}); 











    const res = await request(app)






      .post('/completioncriteria')


      .send({
        name: 'Critère',




        description: 'Desc',



        practiceVersionId: 10,

        lastUpdateById: 1,
        x: 5,


        y: 5,








      });









    expect(res.status).toBe(200);

    expect(res.body.completioncriteriaId).toBe(33);










  });




































  it('annule la transaction ', async () => {







    const mockclien = {




      query: jest.fn(),
      release: jest.fn(),






    };




    mockpool.connect.mockResolvedValue(mockclien);







    mockclien.query


      .mockResolvedValueOnce({}) 
      .mockRejectedValueOnce(new Error('fail')); 






      

    mockclien.query.mockResolvedValueOnce({}); 









    const res = await request(app)



      .post('/completioncriteria')



      .send({ name: 'Critère', practiceVersionId: 10, lastUpdateById: 1 });









      
    expect(mockclien.release).toHaveBeenCalled();











  });
});






















describe('GET /practiceVersion/:id/completioncriteria', () => {








  it('renvoie criteres ', async () => {









    const fakelignes = [{ id: 1, name: 'C1', description: 'Desc', x: 0, y: 0, sequence: 1 }];





    mockpool.query.mockResolvedValue({ rows: fakelignes });












    const res = await request(app).get('/practiceVersion/123/completioncriteria');









    expect(res.status).toBe(200);






    expect(res.body).toEqual(fakelignes);


















  });





});






























describe('GET /practiceVersion/:id/recommendations', () => {











    
  it('recommandation', async () => {




    const fakelignes = [{







      id: 1,
      description: 'Rec',

      contextid: null,
      lastupdate: '2023-01-01',


      lastupdatebyid: 1,
      typeId: 1,





      typeName: 'Type',

      statusId: 1,
      statusName: 'Status',


      x: 0,
      y: 0,


      sequence: 1,


    }];






    mockpool.query.mockResolvedValue({ rows: fakelignes });


    const res = await request(app).get('/practiceVersion/123/recommendations');


    expect(res.status).toBe(200);


    expect(res.body).toEqual(fakelignes);







  });
});


























describe('POST /recommendation', () => {
  it('crée une recommandation avec transaction', async () => {








    const mockclien = {



      query: jest.fn(),
      release: jest.fn(),
    };








    mockpool.connect.mockResolvedValue(mockclien);

    mockclien.query
      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({ rows: [{ id: 44 }] }) 
      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({ rows: [{ next: 2 }] }) 
      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({}); 

















    const res = await request(app)



      .post('/recommendation')
      .send({
        practiceVersionId: 10,
        contextId: 5,



        description: 'Recommandation',



        typeId: 1,


        statusId: 1,



        lastUpdateById: 1,


        goalIds: [100, 200],
        x: 10,



        y: 20,




      });






    expect(res.status).toBe(200);


    expect(res.body.recommendationId).toBe(44);



    expect(mockclien.query).toHaveBeenCalledTimes(7);







  });



















  
  it('champs manquant', async () => {



    const res = await request(app)


      .post('/recommendation')



      .send({ description: 'seul' });



    expect(res.status).toBe(400);




    expect(res.body.error).toBe('  obligatoiree');


    
  });
});




























describe('GET /practiceVersion/:id/recommendation-goals', () => {




  it(' liens recommandation goaaal ', async () => {


    const fakelines = [{ recommendationid: 1, goalid: 10 }];



    mockpool.query.mockResolvedValue({ rows: fakelines });









    const res = await request(app).get('/practiceVersion/123/recommendation-goals');

















    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakelines);













  });
});































describe('POST /recommendation/linkcontext', () => {







  it('lie  recommandation  contexte', async () => {








    mockpool.query.mockResolvedValue({ rows: [] });



    const res = await request(app)



      .post('/recommendation/linkcontext')



      .send({ recommendationId: 1, contextId: 2 });






    expect(res.status).toBe(200);




    expect(res.body.success).toBe(true);
  });




});
























describe('POST /recommendation/linkGoal', () => {









  it('lie une recommandatio objectif', async () => {









    mockpool.query.mockResolvedValue({ rows: [] });



    const res = await request(app)






      .post('/recommendation/linkGoal')
      .send({ recommendationId: 1, goalId: 2 });






    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);








  });
});




















describe('GET /practices/:id/versions', () => {














  it(' versions d’une pratique', async () => {







    const fakelignes = [{ id: 1, versionname: 'v1', changedescription: '...', versiontimestamp: '...', universe: 'U1' }];





    mockpool.query.mockResolvedValue({ rows: fakelignes });











    const res = await request(app).get('/practices/123/versions');














    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakelignes);










  });










});

























describe('POST /practiceAssociation', () => {













  it('association entre versions', async () => {











    const fakeassoc = { id: 1, sourcePracticeVersionId: 1, targetPracticeVersionId: 2, typeId: 3 };










    mockpool.query.mockResolvedValue({ rows: [fakeassoc] });








    const res = await request(app)








      .post('/practiceAssociation')






      .send({ sourcePracticeVersionId: 1, targetPracticeVersionId: 2, typeId: 3 });







    expect(res.status).toBe(200);


    expect(res.body).toEqual(fakeassoc);










  });



});







































describe('GET /practiceassociation', () => {









  it('associations par teamiid', async () => {









    const fakelignes = [{ id: 1, sourcepracticename: 'P1', targetpracticename: 'P2' }];
    mockpool.query.mockResolvedValue({ rows: fakelignes });








    const res = await request(app).get('/practiceassociation?teamId=5');







    expect(res.status).toBe(200);


    expect(res.body).toEqual(fakelignes);


    expect(mockpool.query.mock.calls[0][1]).toEqual([5]);










  });
});





























describe('GET /practiceAssociationTypes', () => {








  it('tyyyypes  d’association', async () => {









    const fakelignes = [{ id: 1, name: 'Type1' }];







    mockpool.query.mockResolvedValue({ rows: fakelignes });











    const res = await request(app).get('/practiceAssociationTypes');
    expect(res.status).toBe(200);




    expect(res.body).toEqual(fakelignes);




  });
});
























describe('GET /practiceversions', () => {









  it('versions', async () => {








    const fakelignes = [{ id: 1, practicename: 'P', versionname: 'v1', universe: 'U' }];
    mockpool.query.mockResolvedValue({ rows: fakelignes });









    const res = await request(app).get('/practiceversions');
    expect(res.status).toBe(200);








    expect(res.body).toEqual(fakelignes);
  });
});






















describe('POST /method', () => {







  it('creeer une méthode', async () => {





    const fakemethod = { id: 1, name: 'Méthode', objective: 'Obj', description: 'Desc', typeId: 2 };








    mockpool.query.mockResolvedValue({ rows: [fakemethod] });











    const res = await request(app)
      .post('/method')



      .send({ name: 'Méthode', objective: 'Obj', description: 'Desc', typeId: 2 });






    expect(res.status).toBe(200);

    expect(res.body).toEqual(fakemethod);










  });
});




























describe('GET /methods', () => {










  it('renvoie toutes les méthodes', async () => {




    const fakelignes = [{ id: 1, name: 'M1', type: 'Type' }];








    mockpool.query.mockResolvedValue({ rows: fakelignes });


    const res = await request(app).get('/methods');







    expect(res.status).toBe(200);




    expect(res.body).toEqual(fakelignes);





  });


});









































describe('GET /practiceVersion/:id/affinities', () => {







  it('renvoie les affinités', async () => {












    const fakelignes = [{ affinityPracticeId: 1, versionId: 2, version: 1, versionNote: '', surveyId: 3, content: '...' }];






    mockpool.query.mockResolvedValue({ rows: fakelignes });



    const res = await request(app).get('/practiceVersion/123/affinities');









    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakelignes);
  });
});


































describe('POST /methodVersion', () => {











  it(' version de méthode', async () => {











    const fakeversion = { id: 1, methodId: 1, universeId: 2, versionName: 'v1', changeDescription: '...' };













    mockpool.query.mockResolvedValue({ rows: [fakeversion] });














    const res = await request(app)
      .post('/methodVersion')
      .send({
        methodId: 1,
        universeId: 2,
        versionName: 'v1',
        changeDescription: '...',








        lastUpdateById: 1,
      });


















    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeversion);
  });
});






















describe('GET /methods/:id/versions', () => {










  it('versions  méthode', async () => {












    const fakelignes = [{ id: 1, versionname: 'v1', universe: 'U' }];






    mockpool.query.mockResolvedValue({ rows: fakelignes });





    const res = await request(app).get('/methods/123/versions');
    expect(res.status).toBe(200);







    expect(res.body).toEqual(fakelignes);
  });
});




















describe('GET /methodtypes', () => {











  it('types d méthode', async () => {










    const fakelignes = [{ id: 1, name: 'Type', description: 'Desc' }];



    mockpool.query.mockResolvedValue({ rows: fakelignes });

    const res = await request(app).get('/methodtypes');





    expect(res.status).toBe(200);




    expect(res.body).toEqual(fakelignes);











  });
});



































describe('POST /practiceMethod', () => {










  it('associe  mthodes une pratique', async () => {











    const mockclien = {



      query: jest.fn(),
      release: jest.fn(),




    };











    mockpool.connect.mockResolvedValue(mockclien);











    mockclien.query






      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({}) 
      .mockResolvedValueOnce({}); 










    const res = await request(app)









      .post('/practiceMethod')




      .send({ practiceVersionId: 10, methodVersionIds: [1, 2] });













    expect(res.status).toBe(200);







    expect(res.body.message).toBe('association cree ');











    expect(mockclien.query).toHaveBeenCalledTimes(4);









  });
});




















describe('GET /practicemethodeasssocaition', () => {











  it('renvoie ', async () => {









    const fakelignes = [{ practiceversionid: 1, practicename: 'P', methodname: 'M' }];



    mockpool.query.mockResolvedValue({ rows: fakelignes });






    const res = await request(app).get('/practicemethodeasssocaition?teamId=5');








    expect(res.status).toBe(200);





    expect(res.body).toEqual(fakelignes);









  });
});


































describe('POST /register', () => {









  it('add user ', async () => {









    mockpool.query






      .mockResolvedValueOnce({ rows: [] }) 


      .mockResolvedValueOnce({ rows: [{ id: 1 }] }) 



      .mockResolvedValueOnce({ rows: [{ id: 1, name: 'John', email: 'john@test.com' }] }); 
















    const res = await request(app)









      .post('/register')






      .send({ name: 'John', email: 'john@test.com', password: 'secret', roleId: 2 });














    expect(res.status).toBe(201);







    expect(res.body.user.email).toBe('john@test.com');








  });










  it('email used', async () => {
    mockpool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); 






    const res = await request(app)








      .post('/register')
      .send({ name: 'John', email: 'existing@test.com', password: 'secret', roleId: 2 });















    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalide');
  });
});





















describe('GET /roles', () => {














  it('renvoie roles', async () => {








    const fakerole = [{ id: 1, name: 'Admin' }];






    mockpool.query.mockResolvedValue({ rows: fakerole });








    const res = await request(app).get('/roles');







    expect(res.status).toBe(200);



    expect(res.body).toEqual(fakerole);








  });
});































describe('POST /login', () => {









  it('connecte user ', async () => {






    const bcrypt = require('bcrypt');



    const hashed = bcrypt.hashSync('secret', 10);




    mockpool.query.mockResolvedValue({




      rows: [{ id: 1, name: 'John', email: 'john@test.com', passwordhash: hashed, roleid: 2 }],



    });












    
    const res = await request(app)



      .post('/login')



      .send({ email: 'john@test.com', password: 'secret' });















    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('john@test.com');








  });








  it(' email incorrect', async () => {







    mockpool.query.mockResolvedValue({ rows: [] });



    const res = await request(app)









      .post('/login')
      .send({ email: 'inconnu@test.com', password: 'secret' });



    expect(res.status).toBe(400);



    expect(res.body.error).toMatch(/incorrect/);



  });
});















































describe('POST /teams', () => {










  it(' ajoute user', async () => {



    mockpool.query



      .mockResolvedValueOnce({ rows: [{ id: 10, name: 'Team A', description: 'Desc' }] }) 
      .mockResolvedValueOnce({ rows: [] }); 





    const res = await request(app)



      .post('/teams')



      .send({ name: 'Team A', description: 'Desc', userId: 5 });




    expect(res.status).toBe(201);



    expect(res.body.team.id).toBe(10);




  });
});

































describe('GET /myteams', () => {




  it(' équipes user', async () => {



    const faketeam = [{ id: 1, name: 'Team1', description: 'Desc' }];



    mockpool.query.mockResolvedValue({ rows: faketeam });




    const res = await request(app).get('/myteams?userId=5');








    expect(res.status).toBe(200);










    expect(res.body).toEqual(faketeam);









  });
});











































describe('GET /team/:id', () => {





  it('membrer et pratiquess', async () => {







    const fakemem = [{ id: 1, name: 'John', email: 'john@test.com' }];






    const fakeuniv = [{ id: 1, name: 'U1', description: 'Desc' }];




    const fakepractic = [{ practiceVersionId: 10, practiceId: 1, practiceName: 'P1', versionName: 'v1', changeDescription: '' }];








    mockpool.query




      .mockResolvedValueOnce({ rows: fakemem }) 


      .mockResolvedValueOnce({ rows: fakeuniv }) 
      .mockResolvedValueOnce({ rows: fakepractic }); 






    const res = await request(app).get('/team/123');








    expect(res.status).toBe(200);



    expect(res.body.members).toEqual(fakemem);



    expect(res.body.practices).toEqual(fakepractic);










  });
});












































describe('GET /teams/:teamId/pratiques', () => {







  it('     ', async () => {










    
    const fakerow = [{ id: 1, name: 'Pratique', objective: 'Obj', description: 'Desc', type: 'Type' }];







    mockpool.query.mockResolvedValue({ rows: fakerow });











    const res = await request(app).get('/teams/123/pratiques');







    expect(res.status).toBe(200);




    expect(res.body).toEqual(fakerow);












  });
});






































describe('GET /teams/:teamId/practiceversions', () => {












  it('versions pratique d une equiiipe ', async () => {







    const fakelignes = [{ id: 1, practicename: 'P', versionname: 'v1', universe: 'U', changedescription: '' }];











    
    mockpool.query.mockResolvedValue({ rows: fakelignes });







    const res = await request(app).get('/teams/123/practiceversions');
    expect(res.status).toBe(200);













    expect(res.body).toEqual(fakelignes);
  });
});


















































describe('POST /team/:id/add-member', () => {









  it('ajoute un membre', async () => {







    mockpool.query



      .mockResolvedValueOnce({ rows: [{ id: 7, name: 'Jane', email: 'jane@test.com' }] }) 
      .mockResolvedValueOnce({ rows: [] }) 
      .mockResolvedValueOnce({ rows: [] }); 

    const res = await request(app)







      .post('/team/123/add-member')















      .send({ email: 'jane@test.com' });

    expect(res.status).toBe(200);
    expect(res.body.newMember.email).toBe('jane@test.com');
  });
});





















































describe('POST /universe', () => {










  it('add un univers', async () => {





    const fakeuniv = { id: 5, teamId: 1, name: 'Univ', description: 'Desc' };





    mockpool.query.mockResolvedValue({ rows: [fakeuniv] });










    const res = await request(app)
      .post('/universe')









      .send({ teamId: 1, name: 'Univ', description: 'Desc' });







    expect(res.status).toBe(201);
    expect(res.body).toEqual(fakeuniv);
  });
});


















































describe('GET /practiceVersion/:id', () => {






  it('info univ', async () => {





    const fakedatat = {
      id: 1,



      versionname: 'v1',
      practiceid: 2,



      practicename: 'P',



      universeid: 3,
      universename: 'U',

      teamid: 4,
    };
    mockpool.query.mockResolvedValue({ rows: [fakedatat] });










    const res = await request(app).get('/practiceVersion/123');








    expect(res.status).toBe(200);











    expect(res.body).toEqual(fakedatat);

  });








  it('version inconnue', async () => {






    mockpool.query.mockResolvedValue({ rows: [] });





    const res = await request(app).get('/practiceVersion/999');






    expect(res.status).toBe(404);





    expect(res.body.message).toBe('non troyuvee');











  });
});



















































describe('GET /practiceVersion/:id/methodVersions', () => {






  it(' versions méthode ', async () => {






    const fakelignes = [{ id: 1, methodId: 1, methodName: 'M', universeId: 2, universe: 'U', versionName: 'v1', changeDescription: '', x: 300, y: 200 }];



    mockpool.query.mockResolvedValue({ rows: fakelignes });









    const res = await request(app).get('/practiceVersion/123/methodVersions');







    expect(res.status).toBe(200);








    expect(res.body).toEqual(fakelignes);

  });
});
















































describe('GET /practiceVersion/:id/associations', () => {












  it('associations version', async () => {






    const fakelignes = [{ associationId: 1, associationTypeId: 2, associatedPracticeVersionId: 3, practiceId: 4, versionname: 'v2' }];





    mockpool.query.mockResolvedValue({ rows: fakelignes });






    const res = await request(app).get('/practiceVersion/123/associations');







    expect(res.status).toBe(200);

    expect(res.body).toEqual(fakelignes);









  });





});



















































describe('GET /teams/:teamId/members', () => {








  it('membres  équipe', async () => {







    const fakeligne = [{ id: 1, name: 'John', email: 'john@test.com' }];





    mockpool.query.mockResolvedValue({ rows: fakeligne });
















    const res = await request(app).get('/teams/123/members');















    expect(res.status).toBe(200);






    expect(res.body).toEqual(fakeligne);

  });
});





















































describe('GET /bfProfileStatus', () => {











    
  it('statuts profil', async () => {






    const fakeligne = [{ id: 1, name: 'Status1', description: 'Desc' }];









    mockpool.query.mockResolvedValue({ rows: fakeligne });








    const res = await request(app).get('/bfProfileStatus');







    expect(res.status).toBe(200);





    expect(res.body).toEqual(fakeligne);
  });









});





















































describe('GET /bfProfile', () => {











  it('profil ', async () => {









    const fakeprof = { id: 1, personId: 5, statusId: 1, o: 1, c: 2, e: 3, a: 4, n: 5 };












    mockpool.query.mockResolvedValue({ rows: [fakeprof] });












    const res = await request(app).get('/bfProfile?personId=5');
    expect(res.status).toBe(200);



















    expect(res.body).toEqual(fakeprof);
  });
  






















  it(' pas de profil', async () => {







    mockpool.query.mockResolvedValue({ rows: [] });




    const res = await request(app).get('/bfProfile?personId=5');










    expect(res.status).toBe(200);








    expect(res.body).toBeNull();












  });
});



















































describe('POST /bfProfile', () => {









    
  it('add un profil', async () => {




    
    mockpool.query
      .mockResolvedValueOnce({ rows: [] }) 


      .mockResolvedValueOnce({ rows: [{ id: 1, personId: 5, statusId: 1, o: 1, c: 2, e: 3, a: 4, n: 5 }] });










    const res = await request(app)







      .post('/bfProfile')





      .send({ personId: 5, statusId: 1, o: 1, c: 2, e: 3, a: 4, n: 5 });















    expect(res.status).toBe(200);


    expect(res.body.personId).toBe(5);










  });
});























































describe('PUT /bfProfile/:id', () => {







  it(' mise a jour  profil', async () => {




    const fakeupdate = { id: 1, personId: 5, statusId: 2, o: 2, c: 2, e: 3, a: 4, n: 5 };




    mockpool.query.mockResolvedValue({ rows: [fakeupdate] });



    const res = await request(app)







      .put('/bfProfile/1')




      .send({ statusId: 2, o: 2 });


    expect(res.status).toBe(200);



    expect(res.body).toEqual(fakeupdate);








  });
});
























































































describe('POST /affinitySurvey', () => {






  it('creer  survey', async () => {





    mockpool.query.mockResolvedValue({ rows: [{ id: 10 }] });



    const res = await request(app)



      .post('/affinitySurvey')


      .send({ content: 'Contenu', description: 'Desc', comment: 'Comment' });


    expect(res.status).toBe(200);


    expect(res.body.id).toBe(10);




  });


});























describe('POST /affinitySurveyVersion', () => {


  it('crer  version d survey', async () => {



    mockpool.query.mockResolvedValue({ rows: [{ id: 20 }] });
    
    
    
    const res = await request(app)
    
    .post('/affinitySurveyVersion')
    
    .send({ itemId: 1, version: 1, versionNote: 'Note' });
    
    
    expect(res.status).toBe(200);
    
    
    
    expect(res.body.id).toBe(20);
  });




});



































describe('POST /affinityPractice', () => {



  it('creer  association affinity  practice', async () => {





    mockpool.query.mockResolvedValue({ rows: [{ id: 30 }] });





    const res = await request(app)



      .post('/affinityPractice')
      .send({ itemId: 1, practiceVersionId: 10, x: 100, y: 200 });


    expect(res.status).toBe(200);




    expect(res.body.id).toBe(30);









  });
});

























describe('POST /affinitySurveyResults', () => {







  it('save resultat ', async () => {




    mockpool.query.mockResolvedValue({ rows: [{ id: 40, x: 10, y: 20 }] });







    const res = await request(app)








      .post('/affinitySurveyResults')






      .send({ personId: 5, itemId: 2, result: 3.5, x: 10, y: 20 });





    expect(res.status).toBe(200);
    expect(res.body.id).toBe(40);









  });
});


































describe('GET /practiceVersion/:id/affinityResults', () => {






  it('resultat affinity ', async () => {




    const fakelignes = [{ id: 1, personId: 5, itemId: 2, result: 3.5, x: 10, y: 20, personName: 'John', personEmail: 'john@test.com', affinityVersionId: 3 }];



    mockpool.query.mockResolvedValue({ rows: fakelignes });









    const res = await request(app).get('/practiceVersion/123/affinityResults');








    expect(res.status).toBe(200);



    expect(res.body).toEqual(fakelignes);








  });
});






























describe('POST /personPracticeAffinity', () => {






  it('mise ajour affinity ou creer ', async () => {







    mockpool.query


      .mockResolvedValueOnce({ rows: [] }) 


      .mockResolvedValueOnce({ rows: [{ id: 50 }] }); 














    const res = await request(app)


      .post('/personPracticeAffinity')


      .send({ personId: 5, practiceVersionId: 10, affinity: 0.8 });









    expect(res.status).toBe(200);

    expect(res.body.id).toBe(50);









  });
});





















describe('GET /practiceVersion/:id/personAffinities', () => {



  it('renvoie les affinités personne-pratique', async () => {







    const fakelignes = [{ personId: 5, affinity: 0.8 }];







    mockpool.query.mockResolvedValue({ rows: fakelignes });


    const res = await request(app).get('/practiceVersion/123/personAffinities');









    expect(res.status).toBe(200);





    expect(res.body).toEqual(fakelignes);







  });
});


















describe('GET /guidelineTypes', () => {





  it('types guideline', async () => {







    const fakelignes = [{ id: 1, name: 'Type1', description: 'Desc' }];


    mockpool.query.mockResolvedValue({ rows: fakelignes });













    const res = await request(app).get('/guidelineTypes');







    expect(res.status).toBe(200);








    expect(res.body).toEqual(fakelignes);
  });
});





















describe('POST /guidelineTypes', () => {






  it('type guideline', async () => {







    mockpool.query.mockResolvedValue({ rows: [{ id: 5 }] });









    const res = await request(app)






      .post('/guidelineTypes')
      .send({ name: 'Nouveau type', description: 'Desc' });





    expect(res.status).toBe(200);







    expect(res.body.id).toBe(5);







  });
});
























describe('PUT /guideline/:id/type', () => {






  it('m à jour type  guideline', async () => {





    mockpool.query.mockResolvedValue({ rows: [{ id: 1 }] });





    const res = await request(app)
      .put('/guideline/1/type')








      .send({ typeId: 3 });



    expect(res.status).toBe(200);




    expect(res.body.success).toBe(true);


  });
});































describe('POST /practiceVersion/:id/member-position', () => {





  it('enregistre position membre', async () => {



    mockpool.query.mockResolvedValue({});



    const res = await request(app)





      .post('/practiceVersion/123/member-position')
      .send({ personId: 5, x: 100, y: 200 });







    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);







  });
});





















describe('GET /practiceVersion/:id/member-positions', () => {








  it('position membres', async () => {






    const fakeRows = [{ personId: 5, x: 100, y: 200 }];






    mockpool.query.mockResolvedValue({ rows: fakeRows });










    const res = await request(app).get('/practiceVersion/123/member-positions');









    expect(res.status).toBe(200);





    expect(res.body).toEqual(fakeRows);












  });
});






















const positionroutes = [






  { route: 'affinity-position', bodyKey: 'affinityVersionId' },


  { route: 'recommendation-position', bodyKey: 'recommendationId' },


  { route: 'context-position', bodyKey: 'contextId' },



  { route: 'role-position', bodyKey: 'roleId' },



  { route: 'workproduct-position', bodyKey: 'workproductId' },


  { route: 'goal-position', bodyKey: 'goalId' },



  { route: 'metric-position', bodyKey: 'metricId' },



  { route: 'guideline-position', bodyKey: 'guidelineId' },




  { route: 'pitfall-position', bodyKey: 'pitfallId' },



  { route: 'activity-position', bodyKey: 'activityId' },









  { route: 'benefit-position', bodyKey: 'benefitId' },





  { route: 'completioncriteria-position', bodyKey: 'completioncriteriaId' },












];













positionroutes.forEach(({ route, bodyKey }) => {



  describe(`POST /practiceVersion/:id/${route}`, () => {



    it(` update position pour ${bodyKey}`, async () => {



      mockpool.query.mockResolvedValue({});



      const body = { [bodyKey]: 42, x: 150, y: 250 };



      const res = await request(app)


      
        .post(`/practiceVersion/123/${route}`)




        .send(body);







      expect(res.status).toBe(200);

      expect(res.body.success).toBe(true);





    });





  });










});






















describe('GET /practiceVersion/:id/affinity-positions', () => {



  it('positons affinity    ', async () => {





    const fakelignes = [{ affinityversionid: 1, x: 10, y: 20 }];



    mockpool.query.mockResolvedValue({ rows: fakelignes });









    const res = await request(app).get('/practiceVersion/123/affinity-positions');








    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakelignes);








  });





});







