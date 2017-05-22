import Tabelas from '../models/Tabelas';

let generalFunctions = {
};
let extraFunctions = {
  /**
   * @api {get} /tabelas_de_banco_de_dados List Tabelas MediaWiki
   * @apiVersion 1.0.0
   * @apiName GetTabelasDeBancoDeDados
   * @apiGroup BulkCreate
   * @apiDescription List all known Tabela de Banco de Dados on Media Wiki
   * @apiPermission annonimous
   * @apiSuccess {String[]} tabelas List of tabelas
   */
  tabelas_de_banco_de_dados:{
    verb:'get',
    action:({params},res) => {
      Tabelas.getTabelasDeBancoDeDadosLinks()
        .then( (data) => res.json(data.data) )
        .catch( (reason) => res.status(400).send(reason) );
    }
  },
  /**
   * @api {get} /create_pages_tabelas_de_banco_de_dados Bulk create pages of Tabela
   * @apiVersion 1.0.0
   * @apiName CreatePagesTabelasDeBancoDeDados
   * @apiGroup BulkCreate
   * @apiDescription Create pages for known Tabelas de Banco de Dados on Media Wiki
   * @apiPermission annonimous
   * @apiSuccess {String} result All operation result
   * @apiSuccess {Object[]} data Individual results
   */
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
  /**
   * @api {get} /create_page_tabela_de_banco_de_dados Create single page Tabela
   * @apiVersion 1.0.0
   * @apiName CreatePageTabelaDeBancoDeDados
   * @apiGroup BulkCreate
   * @apiDescription Create page for suplied Tabela de Banco de Dados on Media Wiki
   * @apiPermission annonimous
   * @apiSuccess {String} result All operation result
   * @apiSuccess {Object[]} data Individual results
   */
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
