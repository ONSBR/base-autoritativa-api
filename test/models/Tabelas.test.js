import chai from 'chai';
import sinon from 'sinon';
import {MapaInformacaoConnector} from 'base-autoritativa-connectors';
import Tabelas from '../../src/models/Tabelas';

let config = {
  "port": 8080,
	"bodyLimit": "100kb",
	"corsHeaders": ["Link"],
	"authentication":"Basic test_test_test",
	"mapaInformacaoBaseUrl":"http://localhost:7474",
	"wikiBaseUrl":"http://localhost",
	"statements":{
	}
}

let mockStubs = {
  getTabela:{},
  _fetchResults: {},
  _getArguments: {},
  _fetchWebApiResults: {}
};

let should = chai.should();
let expect = chai.expect;

let statements = {
  "oneTabela":"MATCH (v:`Tabela`) WHERE (lower(v.`Identificador`) = 'informix.bd_tecn.informix.age' OR lower(v.`Código`) = 'informix.bd_tecn.informix.age' OR lower(v.`Nome`) = 'informix.bd_tecn.informix.age') RETURN v",
  "tabelasWiki":"/api.php?action=ask&format=json&query=%5B%5BPossui+direito+de+leitura+em%3A%3A%2B%5D%5D%7C%3FPossui+direito+de+leitura+em%7Cmainlabel%3D-+",
  "create_page":"/api.php?action=edit&format=json&title=__PAGETITLE__&section=0&text=__BODY__&token=__TOKEN__",
  "get_token":"/api.php?action=query&meta=tokens"
}

let tabelaName = 'informix.bd tecn.informix.age';

let getTabelaResponse = {
  "Código": "age",
  "Data de Cadastro": "2017-02-23 18:55:22.573000000",
  "Identificador": "informix.bd_tecn.informix.age",
  "Descrição": "Lista de agentes, que são cada uma das partes envolvidas em regulamentação, planejamento, acesso, expansão e operação do sistema elétrico, bem como em comercialização e consumo de energia elétrica. O conceito \"agente\" contempla as empresas que participam do ONS ou empresas em países vizinhos que possuem interligação com sistema elétrico sob responsabilidade do ONS.",
  "Número de Linhas": "1938",
  "Nome": "Agente",
  "id": 2672961
};

let tokenResponse = {
    "batchcomplete": "",
    "query": {
        "tokens": {
            "csrftoken": "59322ed9a6c171b759070c6b60b5591c591c49f0+\\"
        }
    }
};
let createResponse = {
  "edit": {
    "result":"Success"
  }
};

let tabelasWikiResponse = {
  	"query": {
  		"printrequests": [
  			{
  				"label": "Possui direito de leitura em",
  				"key": "Possui_direito_de_leitura_em",
  				"redi": "",
  				"typeid": "_wpg",
  				"mode": 1,
  				"format": ""
  			}
  		],
  		"results": {
  			"BD Dinâmica# dd3f9824b3f31a5651323ef171a2a7b6": {
  				"printouts": {
  					"Possui direito de leitura em": [
  						{
  							"fulltext": "Informix.bd tecn.informix.age",
  							"fullurl": "http://wiki.devdc.ons.org.br/wiki/Informix.bd_tecn.informix.age",
  							"namespace": 0,
  							"exists": "1",
  							"displaytitle": ""
  						},
  						{
  							"fulltext": "Informix.bd tecn.informix.cos",
  							"fullurl": "http://wiki.devdc.ons.org.br/wiki/Informix.bd_tecn.informix.cos",
  							"namespace": 0,
  							"exists": "",
  							"displaytitle": ""
  						}
  					]
  				}
  			}
  		},
  		"serializer": "SMW\\Serializers\\QueryResultSerializer",
  		"version": 2,
  		"meta": {
  			"hash": "10b16f7992532984b65f19763d868a38",
  			"count": 43,
  			"offset": 0,
  			"source": "",
  			"time": "0.640393"
  		}
  	}
  };

let tabelasResponse = {
    tabelas:[
      'Informix.bd tecn.informix.age',
      'Informix.bd tecn.informix.cos'
    ]
};

describe('Tabelas Model', () => {
  before(() => {
    Tabelas.setConfig(config);
  });

  beforeEach(() => {
  });


  afterEach(() => {
    for (let mockKey in mockStubs) {
      if (mockStubs[mockKey].restore)
        mockStubs[mockKey].restore();
    }
  });

  after(() => {
  });

  it('should get one tabela', (done) => {
    mockStubs.getTabela = sinon.stub(MapaInformacaoConnector.prototype,'getTabela');
    mockStubs.getTabela.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:getTabelaResponse}) )} );

    Tabelas.getTabela(tabelaName).then( (results) => {
      mockStubs.getTabela.calledOnce.should.be.ok;
      results.should.be.deep.equal({status:'Success',data:getTabelaResponse});
      done();
    } );
  });

  it('should get a list of Tabela de Banco de Dados', (done) => {
    mockStubs._fetchWebApiResults = sinon.stub(Tabelas,'_fetchWebApiResults');
    mockStubs._fetchWebApiResults.callsFake( (statement, validationAttributes, args, verb, parseFunction) => {
      statement.should.be.equal(statements['tabelasWiki']);
      validationAttributes.should.be.ok;
      validationAttributes.should.be.a('array');
      args.should.be.ok;
      verb.should.be.equal('get');
      parseFunction.should.be.a('function');
      return new Promise( (resolve,reject) => {
        let parsed = parseFunction(tabelasWikiResponse);
        resolve(parsed);
      } );
    });
    Tabelas.getTabelasDeBancoDeDadosLinks().then( (data) => {
      mockStubs._fetchWebApiResults.calledOnce.should.be.ok;
      data.should.be.deep.equal(tabelasResponse);
      mockStubs._fetchWebApiResults.restore();
      done();
    } ).catch( (reason) => {
      mockStubs._fetchWebApiResults.restore();
      done(reason)
    } );
  });

  it('should create a list of pages on Tabela de Banco de Dados names', (done) => {
    mockStubs._fetchWebApiResults = sinon.stub(Tabelas,'_fetchWebApiResults');
    mockStubs._fetchWebApiResults.callsFake( (statement, validationAttributes, args, verb, parseFunction) => {
      // First coall to _fetchWebApiResults retorn token
      if (mockStubs._fetchWebApiResults.callCount == 1) {
        statement.should.be.equal(statements['get_token']);
        validationAttributes.should.be.ok;
        validationAttributes.should.be.a('array');
        args.should.be.ok;
        verb.should.be.equal('get');
        parseFunction.should.be.a('function');
        return new Promise( (resolve,reject) => {
          let parsed = parseFunction(tokenResponse);
          resolve(parsed);
        } );
      }
      else { // Second call to _fetchWebApiResults return processed data
        let nome = tabelasResponse.tabelas[mockStubs._fetchWebApiResults.callCount - 2];
        let pageBody = '%7B%7BTemplateTabelaBancoDados%7D%7D%0A%7B%7BTabela+de+Banco+de+Dados%7D%7D%0A';
        let token = encodeURI(tokenResponse.query.tokens.csrftoken);
        let stm = statements['create_page'].replace(/__PAGETITLE__/g,nome).replace(/__BODY__/g,pageBody).replace(/__TOKEN__/g,token);
        statement.should.be.equal(stm);
        validationAttributes.should.be.ok;
        validationAttributes.should.be.a('array');
        args.should.be.ok;
        verb.should.be.equal('get');
        parseFunction.should.be.a('function');
        return new Promise( (resolve,reject) => {
          let parsed = parseFunction(createResponse);
          resolve(parsed);
        } );
      }
    });
    Tabelas.createPageTabelaDeBancoDeDados(tabelasResponse.tabelas).then( (data) => {
      mockStubs._fetchWebApiResults.callCount.should.be.equal(3);
      data.should.be.equal('All created');
      mockStubs._fetchWebApiResults.restore();
      done();
    } ).catch( (reason) => {
      mockStubs._fetchWebApiResults.restore();
      done(reason)
    } );
  });

  it('should handle no nomes list on create a list of pages on Tabela de Banco de Dados names', (done) => {
    mockStubs._fetchWebApiResults = sinon.stub(Tabelas,'_fetchWebApiResults');
    mockStubs._fetchWebApiResults.callsFake( (statement, validationAttributes, args, verb, parseFunction) => {
      // First coall to _fetchWebApiResults retorn token
      if (mockStubs._fetchWebApiResults.callCount == 1) {
        statement.should.be.equal(statements['get_token']);
        validationAttributes.should.be.ok;
        validationAttributes.should.be.a('array');
        args.should.be.ok;
        verb.should.be.equal('get');
        parseFunction.should.be.a('function');
        return new Promise( (resolve,reject) => {
          let parsed = parseFunction(tokenResponse);
          resolve(parsed);
        } );
      }
      else { // Second call to _fetchWebApiResults return processed data
        let nome = tabelasResponse.tabelas[mockStubs._fetchWebApiResults.callCount - 2];
        let pageBody = '%7B%7BTemplateTabelaBancoDados%7D%7D%0A%7B%7BTabela+de+Banco+de+Dados%7D%7D%0A';
        let token = encodeURI(tokenResponse.query.tokens.csrftoken);
        let stm = statements['create_page'].replace(/__PAGETITLE__/g,nome).replace(/__BODY__/g,pageBody).replace(/__TOKEN__/g,token);
        statement.should.be.equal(stm);
        validationAttributes.should.be.ok;
        validationAttributes.should.be.a('array');
        args.should.be.ok;
        verb.should.be.equal('get');
        parseFunction.should.be.a('function');
        return new Promise( (resolve,reject) => {
          let parsed = parseFunction(createResponse);
          resolve(parsed);
        } );
      }
    });
    Tabelas.createPageTabelaDeBancoDeDados().then( (data) => {
      mockStubs._fetchWebApiResults.restore();
      done('Unhandled exception');
    } ).catch( (reason) => {
      mockStubs._fetchWebApiResults.callCount.should.be.equal(0);
      reason.should.be.equal('Invalid list of tabelas names');
      mockStubs._fetchWebApiResults.restore();
      done();
    } );
  });

  it('should handle empty nomes list on create a list of pages on Tabela de Banco de Dados names', (done) => {
    mockStubs._fetchWebApiResults = sinon.stub(Tabelas,'_fetchWebApiResults');
    mockStubs._fetchWebApiResults.callsFake( (statement, validationAttributes, args, verb, parseFunction) => {
      // First coall to _fetchWebApiResults retorn token
      if (mockStubs._fetchWebApiResults.callCount == 1) {
        statement.should.be.equal(statements['get_token']);
        validationAttributes.should.be.ok;
        validationAttributes.should.be.a('array');
        args.should.be.ok;
        verb.should.be.equal('get');
        parseFunction.should.be.a('function');
        return new Promise( (resolve,reject) => {
          let parsed = parseFunction(tokenResponse);
          resolve(parsed);
        } );
      }
      else { // Second call to _fetchWebApiResults return processed data
        let nome = tabelasResponse.tabelas[mockStubs._fetchWebApiResults.callCount - 2];
        let pageBody = '%7B%7BTemplateTabelaBancoDados%7D%7D%0A%7B%7BTabela+de+Banco+de+Dados%7D%7D%0A';
        let token = encodeURI(tokenResponse.query.tokens.csrftoken);
        let stm = statements['create_page'].replace(/__PAGETITLE__/g,nome).replace(/__BODY__/g,pageBody).replace(/__TOKEN__/g,token);
        statement.should.be.equal(stm);
        validationAttributes.should.be.ok;
        validationAttributes.should.be.a('array');
        args.should.be.ok;
        verb.should.be.equal('get');
        parseFunction.should.be.a('function');
        return new Promise( (resolve,reject) => {
          let parsed = parseFunction(createResponse);
          resolve(parsed);
        } );
      }
    });
    Tabelas.createPageTabelaDeBancoDeDados([]).then( (data) => {
      mockStubs._fetchWebApiResults.restore();
      done('Unhandled exception');
    } ).catch( (reason) => {
      mockStubs._fetchWebApiResults.callCount.should.be.equal(0);
      reason.should.be.equal('Invalid list of tabelas names');
      mockStubs._fetchWebApiResults.restore();
      done();
    } );
  });

  it('should handle error on get token on create a list of pages on Tabela de Banco de Dados names', (done) => {
    mockStubs._fetchWebApiResults = sinon.stub(Tabelas,'_fetchWebApiResults');
    mockStubs._fetchWebApiResults.callsFake( (statement, validationAttributes, args, verb, parseFunction) => {
      // First coall to _fetchWebApiResults retorn token
      if (mockStubs._fetchWebApiResults.callCount == 1) {
        statement.should.be.equal(statements['get_token']);
        validationAttributes.should.be.ok;
        validationAttributes.should.be.a('array');
        args.should.be.ok;
        verb.should.be.equal('get');
        parseFunction.should.be.a('function');
        return new Promise( (resolve,reject) => {
          reject('Could not get Authorization Token');
        } );
      }
      else { // Second call to _fetchWebApiResults return processed data
        let nome = tabelasResponse.tabelas[mockStubs._fetchWebApiResults.callCount - 2];
        let pageBody = '%7B%7BTemplateTabelaBancoDados%7D%7D%0A%7B%7BTabela+de+Banco+de+Dados%7D%7D%0A';
        let token = encodeURI(tokenResponse.query.tokens.csrftoken);
        let stm = statements['create_page'].replace(/__PAGETITLE__/g,nome).replace(/__BODY__/g,pageBody).replace(/__TOKEN__/g,token);
        statement.should.be.equal(stm);
        validationAttributes.should.be.ok;
        validationAttributes.should.be.a('array');
        args.should.be.ok;
        verb.should.be.equal('get');
        parseFunction.should.be.a('function');
        return new Promise( (resolve,reject) => {
          let parsed = parseFunction(createResponse);
          resolve(parsed);
        } );
      }
    });
    Tabelas.createPageTabelaDeBancoDeDados(tabelasResponse.tabelas).then( (data) => {
      mockStubs._fetchWebApiResults.restore();
      done('Unhandled exception');
    } ).catch( (reason) => {
      mockStubs._fetchWebApiResults.callCount.should.be.equal(1);
      reason.should.be.equal('Could not get Authorization Token');
      mockStubs._fetchWebApiResults.restore();
      done();
    } );
  });

  it('should handle Failure on create a list of pages on Tabela de Banco de Dados names', (done) => {
    mockStubs._fetchWebApiResults = sinon.stub(Tabelas,'_fetchWebApiResults');
    mockStubs._fetchWebApiResults.callsFake( (statement, validationAttributes, args, verb, parseFunction) => {
      // First coall to _fetchWebApiResults retorn token
      if (mockStubs._fetchWebApiResults.callCount == 1) {
        statement.should.be.equal(statements['get_token']);
        validationAttributes.should.be.ok;
        validationAttributes.should.be.a('array');
        args.should.be.ok;
        verb.should.be.equal('get');
        parseFunction.should.be.a('function');
        return new Promise( (resolve,reject) => {
          let parsed = parseFunction(tokenResponse);
          resolve(parsed);
        } );
      }
      else { // Second call to _fetchWebApiResults return processed data
        let nome = tabelasResponse.tabelas[mockStubs._fetchWebApiResults.callCount - 2];
        let pageBody = '%7B%7BTemplateTabelaBancoDados%7D%7D%0A%7B%7BTabela+de+Banco+de+Dados%7D%7D%0A';
        let token = encodeURI(tokenResponse.query.tokens.csrftoken);
        let stm = statements['create_page'].replace(/__PAGETITLE__/g,nome).replace(/__BODY__/g,pageBody).replace(/__TOKEN__/g,token);
        statement.should.be.equal(stm);
        validationAttributes.should.be.ok;
        validationAttributes.should.be.a('array');
        args.should.be.ok;
        verb.should.be.equal('get');
        parseFunction.should.be.a('function');
        return new Promise( (resolve,reject) => {
          let response = JSON.parse(JSON.stringify(createResponse));
          if (mockStubs._fetchWebApiResults.callCount == 3) response.edit.result = 'Failure';
          let parsed = parseFunction(response);
          resolve(parsed);
        } );
      }
    });
    Tabelas.createPageTabelaDeBancoDeDados(tabelasResponse.tabelas).then( (data) => {
      mockStubs._fetchWebApiResults.restore();
      done('Unhandled exception');
    } ).catch( (reason) => {
      mockStubs._fetchWebApiResults.callCount.should.be.equal(3);
      reason.should.be.a('array');
      reason.length.should.be.equal(1);
      reason[0].should.be.deep.equal({ message: 'Error on creation of page', arguments: 'Informix.bd tecn.informix.cos'});
      mockStubs._fetchWebApiResults.restore();
      done();
    } );
  });
});
