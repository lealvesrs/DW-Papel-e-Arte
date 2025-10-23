const db = require("../../../database/databaseconfig");

const getAllContasPagar = async () => {
  return (
    await db.query(
      // Ordenação por vencimento mais próximo
      "SELECT * FROM contas_pagar WHERE removido = FALSE ORDER BY data_vencimento ASC, id ASC"
    )
  ).rows;
};

const getContaPagarByID = async (contaPagarIDPar) => {
  return (
    await db.query(
      "SELECT * FROM contas_pagar WHERE id = $1 AND removido = FALSE",
      [contaPagarIDPar]
    )
  ).rows;
};

const insertContasPagar = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO contas_pagar (fornecedor_id, descricao, valor, data_vencimento, removido) " +
          "VALUES ($1, $2, $3, $4, FALSE)",
        [
          registroPar.fornecedor_id,     // bigint (FK de fornecedores.id)
          registroPar.descricao,         // text (obrigatório)
          registroPar.valor,             // numeric(15,2)
          registroPar.data_vencimento,   // date (YYYY-MM-DD)
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlContasPagar|insertContasPagar] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const updateContasPagar = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE contas_pagar SET " +
          "fornecedor_id = $2, " +
          "descricao = $3, " +
          "valor = $4, " +
          "data_vencimento = $5 " +
          "WHERE id = $1",
        [
          registroPar.contapagarid,     
          registroPar.fornecedor_id,
          registroPar.descricao,
          registroPar.valor,
          registroPar.data_vencimento,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlContasPagar|updateContasPagar] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const deleteContasPagar = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE contas_pagar SET removido = TRUE WHERE id = $1",
        [registroPar.contapagarid]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlContasPagar|deleteContasPagar] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  getAllContasPagar,
  getContaPagarByID,
  insertContasPagar,
  updateContasPagar,
  deleteContasPagar,
};
