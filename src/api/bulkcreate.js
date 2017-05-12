import Tabelas from '../models/Tabelas';
let tabelas = new Tabelas();

let generalFunctions = {
};
let extraFunctions = {
  tabelas_de_banco_de_dados:{
    verb:'get',
    action:({params},res) => {
      tabelas.getTabelasDeBancoDeDadosLinks()
        .then( (data) => res.json(data) )
        .catch( (reason) => res.status(400).send(reason) );
    }
  }
}

export default {
  generalFunctions:generalFunctions,
  extraFunctions:extraFunctions,
  setConfig:(config) => { tabelas.setConfig(config); }
}
