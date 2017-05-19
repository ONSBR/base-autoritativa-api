// our example model is just an Array
import {Client} from 'node-rest-client';
let client = new Client();
class ModelBase {
  constructor(config) {
    this.config = config;
  }

  /**
  *
  * fetch results from web api
  * params
  *  uri - query string of webapi
  *  validationAttributes - hierarchy of attributes to chack a valid result like ['query','results']
  *  args - arguments used on a post query
  *  verb - http verb
  *  parseFunction - function used to parse results
  * }
  * return a Promise to retrived data
  */
  _fetchWebApiResults(uri, validationAttributes,args, verb, parseFunction) {
    let queryUrl = this.config.wikiBaseUrl + uri;
    return new Promise( (resolve, reject) => {
      client[verb](queryUrl, args, (data) => {
        if (data.errors && data.errors.length > 0) {
          reject(data.errors);
        }
        else {
          if (!data || !this._validateResults(data,validationAttributes)) {
            resolve({});
          }
          else {
            let parsedData = parseFunction?parseFunction(data):data;
            resolve(parsedData);
          }
        }
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   *
   * validateResults - recursive function for validate results
   * params
   *  data - results for validations
   *  attributes - hierarchy of validation
   * return boolean
   */
   _validateResults(data,attributes) {
     if (!attributes || attributes.length == 0) return true;
     return data[attributes[0]]?this._validateResults(data[attributes[0]],attributes.slice(1)):false;
   }
   
  setEntityConfig() {}
  /*
  ** auxiliar function to set configurations
  */
  setConfig(config) {
    this.config = config;
    this.setEntityConfig();
  }
}
export default ModelBase;
