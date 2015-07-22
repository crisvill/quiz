var models = require('../models/models.js');

// Autoload: factoriza el codigo si la ruta contiene :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
      where: {id: Number(quizId)},
      include: [{model: models.Comment}]
    }).then( function(quiz) {
      if(quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId' + quizId));
      }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  var search = '%';
  if (req.query.search) {
    search = req.query.search;
  }
  //agrega simbolo % al inicio y al final, y remplaza los espcios en blanco
  search = '%' + search.replace(/[\s]/g,"%") + '%';
  // Busca en la colección los datos que concuerde con search
  models.Quiz.findAll({
      order: 'pregunta',
      where: ["pregunta like ?", search]
    })
    .then(
    function(quizes) {
        res.render('quizes/index.ejs', { quizes: quizes, errors: []});
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes/:categoria
exports.indexCat = function(req, res) {
 // Busca en la colección los datos que concuerde con la categoria
  models.Quiz.findAll({
      order: 'pregunta',
      where: ["categoria like ?", req.params.categoria]
      })
      .then( function(quizes) {
          res.render('quizes/index.ejs', { quizes: quizes, errors: []});
      }
  ).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
    }
    res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
};

/* GET /author*/
exports.author = function(req, res) {
  res.render('author', {autor: 'Elon Musk', errors: []});
};

/* GET /new */
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta", categoria: "Categoria"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz);

  quiz
  .validate()
  .then(
    function(err) {
      if(err){
        res.render("quizes/new", {quiz: quiz , errors: err.errors});
      } else {
        quiz
        .save({fields: ["pregunta", "respuesta", "categoria"]})
        .then(function(){
          res.redirect('/quizes');
        });   // res.redirect: Redirección HTTP a lista de preguntas
      }
    }
  );
};

//GET /quizes/:id/edit

exports.edit = function(req, res) {
  var quiz = req.quiz; //autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};
// PUT /quizes/:id
exports.update = function (req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.categoria = req.body.quiz.categoria;

  req.quiz
  .validate()
  .then(
    function(err) {
      if(err){
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz
        .save({fields: ["pregunta","respuesta","categoria"]})
        .then( function() { res.redirect('/quizes');});
      }
    }
  );
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy()
  .then( function() {
    res.redirect('/quizes');
  })
  .catch(function(err) { next(error);});
};
