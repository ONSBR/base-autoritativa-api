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

  /** GET / - List all entities */
  index({ params }, res) {
    Sistemas.getAll()
      .then( (data) => res.json(data.data) )
      .catch( (reason) => res.status(400).send(reason) );
  },

  /** GET /:id - Return a given entity */
  read({ sistema }, res) {
    res.json(sistema);
  }
};
let extraFunctions = {
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
