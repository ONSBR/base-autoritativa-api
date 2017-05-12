import Tabelas from '../models/Tabelas';
let tabelas = new Tabelas();

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
    tabelas.getTabela(id)
      .then( (data) => callback(null, data[0]) )
      .catch( (reason) => callback(reason) );
  },

  /** GET /:id - Return a given entity */
  read({tabela,query}, res) {
    let format = query.format;
    if (format && 'csv' == format.toLowerCase()) {
      result = transformResultJson2CSV(tabela);
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
  setConfig:(config) => { tabelas.setConfig(config); }
}
