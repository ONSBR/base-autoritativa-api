import Tabelas from '../models/Tabelas';

let generalFunctions = {
};
let extraFunctions = {
  tabelas_de_banco_de_dados:{
    verb:'get',
    action:({params},res) => {
      Tabelas.getTabelasDeBancoDeDadosLinks()
        .then( (data) => res.json(data.data) )
        .catch( (reason) => res.status(400).send(reason) );
    }
  },
  create_pages_tabelas_de_banco_de_dados:{
    verb:'get',
    action:(req,res) => {
      Tabelas.getTabelasDeBancoDeDadosLinks()
        .then( (data) => {
          if (!data || !data.data || data.data.length == 0) res.json({status:'Success',data:[]});
          else {
            let tabelas = data.data.tabelas;
            Tabelas.createPageTabelaDeBancoDeDados(tabelas)
              .then( (data) => res.json(data))
              .catch( (reason) => res.status(400).send(reason));
          }
        })
        .catch( (reason) => res.status(400).send(reason));
    }
  },
  create_page_tabela_de_banco_de_dados:{
    verb:'get',
    param:'nome_tabela',
    action:(req,res) => {
      let tabela = req.nome_tabela;
      if (!tabela || tabela.length == 0) res.status(400).send({status:'Failure',data:'Invalid tabela name'});
      else {
        let tabelas = [ tabela ];
        Tabelas.createPageTabelaDeBancoDeDados(tabelas)
          .then( (data) => res.json(data))
          .catch( (reason) => res.status(400).send(reason));
      }
    }
  }
}

export default {
  generalFunctions:generalFunctions,
  extraFunctions:extraFunctions,
  setConfig:(config) => { Tabelas.setConfig(config); }
}
