// our example model is just an Array
import ModelBase from './ModelBase';
import {MapaInformacaoConnector} from 'base-autoritativa-connectors';

class Sistemas extends ModelBase {
  constructor() {
    super();
  }

  setEntityConfig() {
    this.mapaInformacaoConnector = new MapaInformacaoConnector(this.config.mapaInformacaoBaseUrl,this.config.authentication);
  }
  /**
  *
  * Retrive all Sistema objects from Neo4J repository
  * return a Promise to retrived data
  */
  getAll() {
    return this.mapaInformacaoConnector.getAllSistemas();
  }

  /**
  *
  * Get a sistema from mapa da informação Neo4J
  * params:
  * sistema
  * return a Promise of an array of objects representing sistema
  *
  */
  getSistema(sistema) {
    return this.mapaInformacaoConnector.getSistema(sistema);
  }

  /**
  *
  * Retrive all database users of a sistemas
  * params:
  * sistema - sistema name
  * return a Promisse of an array of database users internal logins
  */
  getAllSistemaDbUsers(sistema) {
    return this.mapaInformacaoConnector.getAllSistemaDbUsers(sistema);
  }

  /**
   *
   * Retrive a list of tables with READ access from this sistema
   * params:
   * sistema - sistema name
   * return a Promisse of an array of database users internal logins and respective accessed tables
   */
  getTablesReadBySistema(sistema) {
    return new Promise( (resolve,reject) => {
      this.mapaInformacaoConnector.getAllSistemaDbUsers(sistema)
        .then( (userData) => {
          let userCodes = '';
          if (!userData || userData.status == 'Failure' || !userData.data) reject(userData);
          else {
            userData.data.forEach( (u) => {
              userCodes += (u.id + ',');
            });

            if (userCodes != '') {
              userCodes = userCodes.slice(0,-1);
              this.mapaInformacaoConnector.getTablesReadByUser(userCodes)
                .then( (data) => {
                  let reducedData = {};
                  let mainCount = 0;
                  if (!data || data.status == 'Failure' || !data.data) reject(data);
                  data.data.map( (d) => {
                    if (!reducedData[d.toIdentificador]) {
                      reducedData[d.toIdentificador] = {
                        data:[],
                        count:0
                      };
                    }
                    reducedData[d.toIdentificador].data.push(d);
                    reducedData[d.toIdentificador].count += 1;
                    mainCount += 1;
                  } )
                  resolve({status:'Success',data:{results:reducedData, totalTabelas:mainCount}});
                } )
                .catch( (reason) => reject(reason) );
            }
            else {
              resolve({status:'Success',data:{results:{}, totalTabelas:0}});
            }
          }
        })
        .catch( (reason) => reject(reason) );
    });
  }
}
export default new Sistemas();
