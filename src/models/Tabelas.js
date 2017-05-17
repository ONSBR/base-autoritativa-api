// our example model is just an Array
import ModelBase from './ModelBase';
import {MapaInformacaoConnector} from 'base-autoritativa-connectors';

class Tabelas extends ModelBase{
  constructor() {
    super();
    this.statements = {
      "tabelasWiki":"/api.php?action=ask&format=json&query=%5B%5BPossui+direito+de+leitura+em%3A%3A%2B%5D%5D%7C%3FPossui+direito+de+leitura+em%7Cmainlabel%3D-+",
      "create_page":"/api.php?action=edit&format=json&title=__PAGETITLE__&section=0&text=__BODY__&token=__TOKEN__",
      "get_token":"/api.php?action=query&meta=tokens"
    }
  }

  setEntityConfig() {
    this.mapaInformacaoConnector = new MapaInformacaoConnector(this.config.mapaInformacaoBaseUrl,this.config.authentication);
  }
  /**
  *
  * Get a sistema from mapa da informação Neo4J
  * params:
  * sistema
  * return a Promise of an array of objects representing sistema
  *
  */
  getTabela(tabela) {
    return this.mapaInformacaoConnector.getTabela(tabela);
  }

  /**
   *
   * Get a list of Tabela de Banco de Dados pages from wiki
   * return a Promise of an array of objects representing sistema
   *
   */
   getTabelasDeBancoDeDadosLinks() { 
     let statement = this.statements['tabelasWiki'];

     return this._fetchWebApiResults(statement,['query','results'],{},'get', (data) => {
       let results = {'tabelas':[]};
       for (let key in data.query.results) {
         let tabelas = data.query.results[key].printouts['Possui direito de leitura em'];
         tabelas.forEach( (item) => {
           let nomeTabela = item['fulltext'];
           if (!results.tabelas.includes(nomeTabela)) results.tabelas.push(nomeTabela);
         } );
       }
       return results;
     });
   }

   /**
    *
    * create pages of Tabela de Banco de Dados, based on an array of names
    * params:
    *  list of names
    * return a Promise of completed execution
    *
    */
    createPageTabelaDeBancoDeDados(nomes) {
      let promises = [];
      let statement = this.statements['get_token'];
      let pageBody = '%7B%7BTemplateTabelaBancoDados%7D%7D%0A%7B%7BTabela+de+Banco+de+Dados%7D%7D%0A';
      return new Promise( (resolve,reject) => {
        if (!nomes || nomes.length == 0) reject('Invalid list of tabelas names');
        else {
          this._fetchWebApiResults(statement,['query','tokens','csrftoken'],{},'get',(data) => {
            return encodeURI(data.query.tokens.csrftoken);
          }).then(token => {
            let i = 1;
            let total = nomes.length;
            nomes.forEach((item) => {
              statement = this.statements['create_page'].replace(/__PAGETITLE__/g,item).replace(/__BODY__/g,pageBody).replace(/__TOKEN__/g,token);
              let promise = this._fetchWebApiResults(statement,['edit','result'],{},'get',(data) => {
                console.log('Processed ' + i + ' of ' + total);
                i++;
                return {nome: item, result: data.edit.result};
              });
              promises.push(promise);
            });
            Promise.all(promises).then((data)=>{
              let rejectItems = [];
              data.forEach( (item) => {
                if (item.result == 'Failure') {
                  rejectItems.push({ message: 'Error on creation of page', arguments: item.nome});
                }
              } )
              if (rejectItems.length > 0) reject(rejectItems);
              else resolve('All created');
            }).catch((reason) => reject('Error in creation'));
          }).catch(reason => {
            reject(reason);
          });
        }
      });
    }
}
export default new Tabelas();
