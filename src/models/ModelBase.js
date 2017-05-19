// our example model is just an Array
import {Client} from 'node-rest-client';
let client = new Client();
class ModelBase {
  constructor(config) {
    this.config = config;
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
