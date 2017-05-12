import { version } from '../../package.json';
import resource from 'resource-router-middleware';
import { Router } from 'express';
import sistemas from './sistemas';
import tabelas from './tabelas';
import bulkcreate from './bulkcreate';

/**
 * Set partial routes based on handler
 * @param {object} config server configuration
 * @param {object} db     Database endpoint
 */
function setRoutes(config, db, handler, parameterPath ) {
	handler.setConfig(config);
  let router = resource(handler.generalFunctions);
  for (let key in handler.extraFunctions) {
		let extraFunction = handler.extraFunctions[key];
    router[extraFunction.verb](parameterPath+key,extraFunction.action);
  }
  return router;
}

export default ({ config, db }) => {
	let api = Router();

	api.use('/sistemas',setRoutes(config,db,sistemas,'/:sistema/'));
	api.use('/tabelas',setRoutes( config, db,tabelas,'/:tabela/' ));
	api.use('/bulkcreate',setRoutes(config,db,bulkcreate,'/'));

	api.get('/', (req, res) => {
		res.json({ version });
	});
	return api;
}
