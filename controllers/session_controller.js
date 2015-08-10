//GET carga formulario de login
exports.new = function (req, res) {
  var errors = req.session.errors || {} ;
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

//POST /login crea session
exports.create = function (req, res) {
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');

  userController.autenticar( login, password, function (error, user) {

    if(error){ // retorna mensaje de error
      req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
      res.redirect('/login');
      return;
    }

    //Crear req.session.user y guardar id y username
    // La session se define por la existencia de req.session.user
    req.session.user = {id:user.id, username:user.username};

    //redireccion a path anterior al login
    res.redirect(req.session.redir.toString());
  });
};


//DELETE /logout destruye session
exports.destroy = function (req, res) {
  delete req.session.user;
  res.redirect(req.session.redir.toString());
};
