const mdlFornecedores = require("../model/mdlFornecedores");

// GetAllFornecedores
const getAllFornecedores = (req, res) =>
  (async () => {
    const registro = await mdlFornecedores.getAllFornecedores();
    res.json({ status: "ok", registro });
  })();

// GetFornecedorByID
const getFornecedorByID = (req, res) =>
  (async () => {
    const fornecedorID = parseInt(req.body.fornecedorid);
    const registro = await mdlFornecedores.getFornecedorByID(fornecedorID);
    res.json({ status: "ok", registro });
  })();

// InsertFornecedores
const insertFornecedores = (req, res) =>
  (async () => {
    const registro = req.body;
    const { msg, linhasAfetadas } = await mdlFornecedores.insertFornecedores(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// UpdateFornecedores
const updateFornecedores = (req, res) =>
  (async () => {
    const registro = req.body; // fornecedorid, nome, telefone, endereco
    const { msg, linhasAfetadas } = await mdlFornecedores.updateFornecedores(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

// DeleteFornecedores 
const deleteFornecedores = (req, res) =>
  (async () => {
    const registro = req.body; //  fornecedorid
    const { msg, linhasAfetadas } = await mdlFornecedores.deleteFornecedores(registro);
    res.json({ status: msg, linhasAfetadas });
  })();

module.exports = {
  getAllFornecedores,
  getFornecedorByID,
  insertFornecedores,
  updateFornecedores,
  deleteFornecedores,
};
