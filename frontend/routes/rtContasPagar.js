var express = require('express');
var router = express.Router();
var contasApp = require("../apps/contas/controller/ctlContasPagar")

//Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
    // Verificar se existe uma sessão válida.
    isLogged = req.session.isLogged;    
  
    if (!isLogged) {      
      res.redirect("/Login");
    }
    next();
}; 
  
/* GET métodos */
router.get('/ManutContasPagar', authenticationMiddleware, contasApp.manutContasPagar)
router.get('/InsertContasPagar', authenticationMiddleware, contasApp.insertContasPagar);
router.get('/ViewContasPagar/:id', authenticationMiddleware, contasApp.ViewContasPagar);
router.get('/UpdateContasPagar/:id', authenticationMiddleware, contasApp.UpdateContaPagar);

/* POST métodos */
router.post('/InsertContasPagar', authenticationMiddleware, contasApp.insertContasPagar);
router.post('/UpdateContasPagar', authenticationMiddleware, contasApp.UpdateContaPagar);
router.post('/DeleteContasPagar', authenticationMiddleware, contasApp.DeleteContaPagar);
// router.post('/viewContasPagar', authenticationMiddleware, contasApp.viewContasPagar);


module.exports = router;