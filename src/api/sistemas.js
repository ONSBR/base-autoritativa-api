import Sistemas from '../models/Sistemas';

function transformTablesJson2CSV(data) {
  let results = [];
  results.push(['Usuário', 'Verbo', 'Tabelas']);
  for (let key in data.results) {
    let resultItem = {};
    data.results[key].data.forEach( (item) => {
      if (!resultItem[item.verb]) resultItem[item.verb] = [];
      resultItem[item.verb].push(item.fromIdentificador);
    } );
    for (let verbKey in resultItem) {
      let result = [];
      result.push(key);
      result.push(verbKey);
      let fromIdentificadors = '"' + resultItem[verbKey].join(',') + '"';
      result.push(fromIdentificadors);
      results.push(result);
    }
  }
  return results.join('\n');
}
let generalFunctions = {
  id:'sistema',

  /** For requests with an `id`, you can auto-load the entity.
   *  Errors terminate the request, success sets `req[id] = data`.
   */
  load(req, id, callback) {
    Sistemas.getSistema(id)
      .then( (data) => callback(null, data.data[0]) )
      .catch( (reason) => callback(reason) );
  },

  /**
   * @api {get} /sistemas/:sistema Get Sistema
   * @apiVersion 1.0.0
   * @apiName GetSistema
   * @apiGroup Sistemas
   * @apiDescription Get a sistema detail
   * @apiParam {String} sistema Name of Sistema
   * @apiPermission annonimous
   * @apiSuccess {String} Status Sistema situation
   * @apiSuccess {String} Codigo Known id of Sistema
   * @apiSuccess {DateTime} Data_de_Cadastro Date and time of Sistema insertion
   * @apiSuccess {String} Identificador Same as Código
   * @apiSuccess {String} Descricao description of Sistema
   * @apiSuccess {String} Gerencia_Responsavel Name of organization unit owner
   * @apiSuccess {String} URL_de_Producao Sistema endpoint
   * @apiSuccess {String} Processo_ONS_Associado Related processes
   * @apiSuccess {String} Nome Fullname of Sistema
   * @apiSuccess {String} Diretoria main organization unit owner
   * @apiSuccess {Number} id Identificador on Mapa da Informação
   */
  index({ params }, res) {
    Sistemas.getAll()
      .then( (data) => res.json(data.data) )
      .catch( (reason) => res.status(400).send(reason) );
  },

  /**
   * @api {get} /sistemas List Sistemas
   * @apiVersion 1.0.0
   * @apiName GetSistemas
   * @apiGroup Sistemas
   * @apiDescription Get a sistema detail
   * @apiPermission annonimous
   * @apiSuccess {Object[]} List of Sistema Object
   */
  read({ sistema }, res) {
    res.json(sistema);
  }
};
let extraFunctions = {
  /**
   * @api {get} /sistemas/:sistema/users Get Sistema Db users
   * @apiVersion 1.0.0
   * @apiName GetSistemaDbUsers
   * @apiGroup Sistemas
   * @apiDescription Get a list of sistema database users
   * @apiParam {String} sistema Name of Sistema
   * @apiPermission annonimous
   * @apiSuccess {Object[]} List of bd users
   */
  users:{
    verb:'get',
    action:({params},res) => {
      let sistema = params.sistema;
      if (sistema && sistema.length > 0) {
        Sistemas.getAllSistemaDbUsers(sistema)
          .then( (data) => res.json(data.data) )
          .catch( (reason) => res.status(400).send(reason) );
      }
      else {
        res.status(400).send({status:'Failure',data:{message:'Invalid sistema param'}});
      }
    }
  },
  /**
   * @api {get} /sistemas/:sistema/tables Get Sistema read access tables
   * @apiVersion 1.0.0
   * @apiName GetSistemaTables
   * @apiGroup Sistemas
   * @apiDescription Get a list of sistema database tables with read permissions
   * @apiParam {String} sistema Name of Sistema
   * @apiPermission annonimous
   * @apiSuccess {Object[]} results List of read access of sistema
   */
  tables:{
    verb:'get',
    action:({params, query},res) => {
      let format = query.format;
      let sistema = params.sistema;
      if (sistema && sistema.length > 0) {
        Sistemas.getTablesReadBySistema(sistema)
          .then( (data) => {
            let result = data.data;
            if (format && 'csv' == format.toLowerCase()) {
              result = transformTablesJson2CSV(data.data);
              res.status(200).send(result);
            }
            else res.json(result);
          } )
          .catch( (reason) => res.status(400).send(reason) );
      }
      else {
        res.status(400).send({status:'Failure',data:{message:'Invalid sistema param'}});
      }
    }
  }
}

export default {
  generalFunctions:generalFunctions,
  extraFunctions:extraFunctions,
  setConfig:(config) => { Sistemas.setConfig(config); }
};
