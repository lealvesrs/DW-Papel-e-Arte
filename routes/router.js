const express = require("express");
const routerApp = express.Router();

const appLogin = require("../apps/login/controller/ctlLogin");

// middleware that is specific to this router
routerApp.use((req, res, next) => {
  next();
});

routerApp.get("/", (req, res) => {
  res.send("Olá mundo!");
});

// Rotas de Login
routerApp.post("/Login",  appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

// Rotas de Fornecedores
routerApp.get ("/GetAllFornecedores",  appLogin.AutenticaJWT, appFornecedores.getAllFornecedores);
routerApp.post("/GetFornecedorByID",   appLogin.AutenticaJWT, appFornecedores.getFornecedorByID);
routerApp.post("/InsertFornecedores",  appLogin.AutenticaJWT, appFornecedores.insertFornecedores);
routerApp.post("/UpdateFornecedores",  appLogin.AutenticaJWT, appFornecedores.updateFornecedores);
routerApp.post("/DeleteFornecedores",  appLogin.AutenticaJWT, appFornecedores.deleteFornecedores);

// Rotas de Contas a Pagar
routerApp.get ("/GetAllContasPagar",   appLogin.AutenticaJWT, appContas_Pagar.getAllContasPagar);
routerApp.post("/GetContaPagarByID",   appLogin.AutenticaJWT, appContas_Pagar.getContaPagarByID);
routerApp.post("/InsertContasPagar",   appLogin.AutenticaJWT, appContas_Pagar.insertContasPagar);
routerApp.post("/UpdateContasPagar",   appLogin.AutenticaJWT, appContas_Pagar.updateContasPagar);
routerApp.post("/DeleteContasPagar",   appLogin.AutenticaJWT, appContas_Pagar.deleteContasPagar);






module.exports = routerApp;
