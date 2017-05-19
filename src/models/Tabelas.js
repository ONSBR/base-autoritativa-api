// our example model is just an Array
import ModelBase from './ModelBase';
import {MapaInformacaoConnector, MediaWikiConnector} from 'base-autoritativa-connectors';

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
    this.mediaWikiConnector = new MediaWikiConnector(this.config.mapaInformacaoBaseUrl,this.config.authentication);
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
            .catch( (reason) => reject(reason));
        }
      });
    }
}
export default new Tabelas();
