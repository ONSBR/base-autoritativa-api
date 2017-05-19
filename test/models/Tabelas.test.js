import chai from 'chai';
import sinon from 'sinon';
import {MapaInformacaoConnector,MediaWikiConnector} from 'base-autoritativa-connectors';
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
  getAllTabelasBancoDeDados:{},
  getAuthenticationToken:{},
  createPageTabelaDeBancoDeDados:{}
};

let should = chai.should();
let expect = chai.expect;

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

let mockCreateResponse = {
  status:'Success',
  data:[
    {nome:'Table1',result:'Success'},
    {nome:'Table2',result:'Success'}
  ]
}

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
    mockStubs.getAllTabelasBancoDeDados = sinon.stub(MediaWikiConnector.prototype,'getAllTabelasBancoDeDados');
    mockStubs.getAllTabelasBancoDeDados.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:tabelasResponse}) )} );

    Tabelas.getTabelasDeBancoDeDadosLinks().then( (data) => {
      mockStubs.getAllTabelasBancoDeDados.calledOnce.should.be.ok;
      data.should.be.deep.equal({status:'Success',data:tabelasResponse});
      mockStubs.getAllTabelasBancoDeDados.restore();
      done();
    } ).catch( (reason) => {
      mockStubs.getAllTabelasBancoDeDados.restore();
      done(reason)
    } );
  });

  it('should create a list of pages on Tabela de Banco de Dados names', (done) => {
    mockStubs.getAuthenticationToken = sinon.stub(MediaWikiConnector.prototype,'getAuthenticationToken');
    mockStubs.getAuthenticationToken.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:'generated_token'}) )} );
    mockStubs.createPageTabelaDeBancoDeDados = sinon.stub(MediaWikiConnector.prototype,'createPageTabelaDeBancoDeDados');
    mockStubs.createPageTabelaDeBancoDeDados.callsFake( () => {return new Promise( (resolve) => resolve(mockCreateResponse) )} );

    Tabelas.createPageTabelaDeBancoDeDados(tabelasResponse.tabelas).then( (data) => {
      mockStubs.getAuthenticationToken.calledOnce.should.be.ok;
      mockStubs.createPageTabelaDeBancoDeDados.calledOnce.should.be.ok;
      data.should.be.deep.equal(mockCreateResponse);
      mockStubs.getAuthenticationToken.restore();
      mockStubs.createPageTabelaDeBancoDeDados.restore();
      done();
    } ).catch( (reason) => {
      mockStubs.getAuthenticationToken.restore();
      mockStubs.createPageTabelaDeBancoDeDados.restore();
      done(reason)
    } );
  });

  it('should handle no nomes list on create a list of pages on Tabela de Banco de Dados names', (done) => {
    mockStubs.getAuthenticationToken = sinon.stub(MediaWikiConnector.prototype,'getAuthenticationToken');
    mockStubs.getAuthenticationToken.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:'generated_token'}) )} );
    mockStubs.createPageTabelaDeBancoDeDados = sinon.stub(MediaWikiConnector.prototype,'createPageTabelaDeBancoDeDados');
    mockStubs.createPageTabelaDeBancoDeDados.callsFake( () => {return new Promise( (resolve) => resolve(mockCreateResponse) )} );

    Tabelas.createPageTabelaDeBancoDeDados().then( (data) => {
      mockStubs.getAuthenticationToken.restore();
      mockStubs.createPageTabelaDeBancoDeDados.restore();
      done('Unhandled exception');
    } ).catch( (reason) => {
      mockStubs.getAuthenticationToken.calledOnce.should.be.not.ok;
      mockStubs.createPageTabelaDeBancoDeDados.calledOnce.should.be.not.ok;
      reason.should.be.deep.equal({status:'Failure',data:'Invalid list of tabelas names'});
      mockStubs.getAuthenticationToken.restore();
      mockStubs.createPageTabelaDeBancoDeDados.restore();
      done();
    } );
  });

  it('should handle empty nomes list on create a list of pages on Tabela de Banco de Dados names', (done) => {
    mockStubs.getAuthenticationToken = sinon.stub(MediaWikiConnector.prototype,'getAuthenticationToken');
    mockStubs.getAuthenticationToken.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:'generated_token'}) )} );
    mockStubs.createPageTabelaDeBancoDeDados = sinon.stub(MediaWikiConnector.prototype,'createPageTabelaDeBancoDeDados');
    mockStubs.createPageTabelaDeBancoDeDados.callsFake( () => {return new Promise( (resolve) => resolve(mockCreateResponse) )} );

    Tabelas.createPageTabelaDeBancoDeDados([]).then( (data) => {
      mockStubs.getAuthenticationToken.restore();
      mockStubs.createPageTabelaDeBancoDeDados.restore();
      done('Unhandled exception');
    } ).catch( (reason) => {
      mockStubs.getAuthenticationToken.calledOnce.should.be.not.ok;
      mockStubs.createPageTabelaDeBancoDeDados.calledOnce.should.be.not.ok;
      reason.should.be.deep.equal({status:'Failure',data:'Invalid list of tabelas names'});
      mockStubs.getAuthenticationToken.restore();
      mockStubs.createPageTabelaDeBancoDeDados.restore();
      done();
    } );
  });

  it('should handle error on get token on create a list of pages on Tabela de Banco de Dados names', (done) => {
    mockStubs.getAuthenticationToken = sinon.stub(MediaWikiConnector.prototype,'getAuthenticationToken');
    mockStubs.getAuthenticationToken.callsFake( () => {return new Promise( (resolve,reject) => reject({status:'Failure',data:'Could not get Authorization Token'}) )} );
    mockStubs.createPageTabelaDeBancoDeDados = sinon.stub(MediaWikiConnector.prototype,'createPageTabelaDeBancoDeDados');
    mockStubs.createPageTabelaDeBancoDeDados.callsFake( () => {return new Promise( (resolve) => resolve(mockCreateResponse) )} );

    Tabelas.createPageTabelaDeBancoDeDados(tabelasResponse.tabelas).then( (data) => {
      mockStubs.getAuthenticationToken.restore();
      mockStubs.createPageTabelaDeBancoDeDados.restore();
      done('Unhandled exception');
    } ).catch( (reason) => {
      mockStubs.getAuthenticationToken.calledOnce.should.be.ok;
      mockStubs.createPageTabelaDeBancoDeDados.calledOnce.should.be.not.ok;
      reason.should.be.deep.equal({status:'Failure',data:'Could not get Authorization Token'});
      mockStubs.getAuthenticationToken.restore();
      mockStubs.createPageTabelaDeBancoDeDados.restore();
      done();
    } );
  });

  it('should handle Failure on create a list of pages on Tabela de Banco de Dados names', (done) => {
    let failureCreateResponse = Object.assign({},mockCreateResponse);
    failureCreateResponse.data[1].result = 'Failure';
    failureCreateResponse.status = 'Failure';
    mockStubs.getAuthenticationToken = sinon.stub(MediaWikiConnector.prototype,'getAuthenticationToken');
    mockStubs.getAuthenticationToken.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:'generated_token'}) )} );
    mockStubs.createPageTabelaDeBancoDeDados = sinon.stub(MediaWikiConnector.prototype,'createPageTabelaDeBancoDeDados');
    mockStubs.createPageTabelaDeBancoDeDados.callsFake( () => {return new Promise( (resolve,reject) => reject(failureCreateResponse) )} );

    Tabelas.createPageTabelaDeBancoDeDados(tabelasResponse.tabelas).then( (data) => {
      mockStubs.getAuthenticationToken.restore();
      mockStubs.createPageTabelaDeBancoDeDados.restore();
      done('Unhandled exception');
    } ).catch( (reason) => {
      mockStubs.getAuthenticationToken.calledOnce.should.be.ok;
      mockStubs.createPageTabelaDeBancoDeDados.calledOnce.should.be.ok;
      reason.should.be.ok;
      reason.should.be.deep.equal(failureCreateResponse);
      mockStubs.getAuthenticationToken.restore();
      mockStubs.createPageTabelaDeBancoDeDados.restore();
      done();
    } );
  });
});
