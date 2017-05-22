// our example model is just an Array
import ModelBase from './ModelBase';
import {MapaInformacaoConnector, MediaWikiConnector} from 'base-autoritativa-connectors';

class Tabelas extends ModelBase{
  constructor() {
    super();
  }

  setEntityConfig() {
    this.mapaInformacaoConnector = new MapaInformacaoConnector(this.config.mapaInformacaoBaseUrl,this.config.authentication);
    this.mediaWikiConnector = new MediaWikiConnector(this.config.wikiBaseUrl);
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
     return this.mediaWikiConnector.getAllTabelasBancoDeDados();
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
      return new Promise( (resolve,reject) => {
        // First check list of nomes
        if (!nomes || nomes.length == 0) reject({status:'Failure',data:'Invalid list of tabelas names'});
        else {
          // Get a authentication token First
          this.mediaWikiConnector.getAuthenticationToken()
            .then( (data) => {
              let token = data.data;
              if (!token || token.length == 0) reject({status:'Failure',data:'Could not get Authorization Token'});
              else {
                this.mediaWikiConnector.createPageTabelaDeBancoDeDados(nomes,token)
                  .then( (data) => resolve(data))
                  .catch( (reason) => reject(reason));
              }
            })
            .catch( (reason) => {
              reject(reason)
            });
        }
      });
    }
}
export default new Tabelas();
