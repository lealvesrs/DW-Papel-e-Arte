const db = require("../../../database/databaseconfig");

// GetAllFornecedores
const getAllFornecedores = async () => {
  return (
    await db.query(
      "SELECT * FROM fornecedores WHERE removido = FALSE ORDER BY nome ASC"
    )
  ).rows;
};

// GetFornecedorByID
const getFornecedorByID = async (fornecedorIDPar) => {
  return (
    await db.query(
      "SELECT * FROM fornecedores WHERE id = $1 AND removido = FALSE ORDER BY nome ASC",
      [fornecedorIDPar]
    )
  ).rows;
};

// InsertFornecedores
const insertFornecedores = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO fornecedores (nome, telefone, endereco, removido) VALUES ($1, $2, $3, FALSE)",
        [
          registroPar.nome,
          registroPar.telefone ?? null,
          registroPar.endereco ?? null,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlFornecedores|insertFornecedores] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

// UpdateFornecedores
const updateFornecedores = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE fornecedores SET " +
          "nome = $2, " +
          "telefone = $3, " +
          "endereco = $4 " +
          "WHERE id = $1",
        [
          registroPar.fornecedorid, // id do fornecedor
          registroPar.nome,
          registroPar.telefone ?? null,
          registroPar.endereco ?? null,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlFornecedores|updateFornecedores] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

// DeleteFornecedores 
const deleteFornecedores = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE fornecedores SET removido = TRUE WHERE id = $1",
        [registroPar.fornecedorid] // usando o ID do fornecedor
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlFornecedores|deleteFornecedores] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

module.exports = {
  getAllFornecedores,
  getFornecedorByID,
  insertFornecedores,
  updateFornecedores,
  deleteFornecedores,
};
