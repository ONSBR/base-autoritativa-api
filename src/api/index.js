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
    if (extraFunction.param) {
			router.param(extraFunction.param,function(req, res, next, id){
				req[extraFunction.param] = id;
				next();
			});
			router[extraFunction.verb](parameterPath+key+'/:'+extraFunction.param,extraFunction.action);
		}
		else router[extraFunction.verb](parameterPath+key,extraFunction.action);
  }
	// console.log(router);
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
