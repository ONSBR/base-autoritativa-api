import chai from 'chai';
import sinon from 'sinon';
import Tabelas from '../../src/models/Tabelas';
let mockStubs = {
  _fetchResults: {},
  _getArguments: {},
  _fetchWebApiResults: {}
};

let should = chai.should();
let expect = chai.expect;
let db = {}, config = {};

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
    let localArgs = {arg1:1,arg2:2};
    mockStubs._getArguments = sinon.stub(Tabelas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Tabelas,'_fetchResults');
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['oneTabela']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args) => {
      return new Promise( (resolve) => resolve(getTabelaResponse) );
    });
    Tabelas.getTabela(tabelaName).then( (results) => {
      mockStubs._getArguments.calledOnce.should.be.ok;
      mockStubs._fetchResults.calledOnce.should.be.ok;
      results.should.be.equal(getTabelaResponse);
      mockStubs._getArguments.restore();
      mockStubs._fetchResults.restore();
      done();
    } );
  });

  it('should handle no tabela name on get one tabela', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs._getArguments = sinon.stub(Tabelas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Tabelas,'_fetchResults');
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['oneTabela']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args) => {
      return new Promise( (resolve) => resolve(getTabelaResponse) );
    });
    Tabelas.getTabela().then( (results) => {
      mockStubs._getArguments.restore();
      mockStubs._fetchResults.restore();
      done('Unhandled no tabela name');
    } ).catch( (reason) => {
      mockStubs._getArguments.calledOnce.should.be.not.ok;
      mockStubs._fetchResults.calledOnce.should.be.not.ok;
      reason.should.be.equal('No Tabela name provided');
      mockStubs._getArguments.restore();
      mockStubs._fetchResults.restore();
      done();
    } ) ;
  });

  it('should handle empty tabela name on get one tabela', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs._getArguments = sinon.stub(Tabelas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Tabelas,'_fetchResults');
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['oneTabela']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args) => {
      return new Promise( (resolve) => resolve(getTabelaResponse) );
    });
    Tabelas.getTabela('').then( (results) => {
      mockStubs._getArguments.restore();
      mockStubs._fetchResults.restore();
      done('Unhandled no tabela name');
    } ).catch( (reason) => {
      mockStubs._getArguments.calledOnce.should.be.not.ok;
      mockStubs._fetchResults.calledOnce.should.be.not.ok;
      reason.should.be.equal('No Tabela name provided');
      mockStubs._getArguments.restore();
      mockStubs._fetchResults.restore();
      done();
    } ) ;
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
      data.should.be.deep.equal(tabelasResponse);
      mockStubs._fetchWebApiResults.restore();
      done();
    } ).catch( (reason) => {
      mockStubs._fetchWebApiResults.restore();
      done(reason)
    } );
  });

});
