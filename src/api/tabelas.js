import Tabelas from '../models/Tabelas';

function transformResultJson2CSV(data) {
  let resultline = [], results = [];
  results.push(['Código', 'Data de Cadastro', 'Identificador','Descrição','Número de registros','Nome','nodeId']);
  resultline.push(data['Código']);
  resultline.push(data['Data de Cadastro']);
  resultline.push(data['Identificador']);
  resultline.push('"' + data['Descrição'] + '"');
  resultline.push(data['Número de Linhas']);
  resultline.push(data['Nome']);
  resultline.push(data['id']);
  results.push(resultline);

  return results.join('\n');
}
let generalFunctions = {
  id:'tabela',

  /** For requests with an `id`, you can auto-load the entity.
   *  Errors terminate the request, success sets `req[id] = data`.
   */
  load(req, id, callback) {
    Tabelas.getTabela(id)
      .then( (data) => callback(null, data.data[0]) )
      .catch( (reason) => callback(reason) );
  },

  /**
   * @api {get} /tables/:tabela Get Tabela
   * @apiVersion 1.0.0
   * @apiName GetTabela
   * @apiGroup Tabelas
   * @apiDescription Get a Tabela detail
   * @apiParam {String} tabela Name of Tabela
   * @apiPermission annonimous
   * @apiSuccess {String} Codigo Tabela Identificador
   * @apiSuccess {DateTime} Data_de_Cadastro Date and time of Tabela insertion
   * @apiSuccess {String} Identificador Same as Código
   * @apiSuccess {String} Descricao description of Tabela
   * @apiSuccess {Number} Numero_de_Linhas Number of records on table
   * @apiSuccess {String} Nome Fullname of Tabela
   * @apiSuccess {Number} id Identificador on Mapa da Informação
   */
  read({tabela,query}, res) {
    let format = query.format;
    if (format && 'csv' == format.toLowerCase()) {
      let result = transformResultJson2CSV(tabela);
      res.status(200).send(result);
    }
    else res.json(tabela);
  }
};
let extraFunctions = {
}

export default {
  generalFunctions:generalFunctions,
  extraFunctions:extraFunctions,
  setConfig:(config) => { Tabelas.setConfig(config); }
}
