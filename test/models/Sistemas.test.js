import chai from 'chai';
import sinon from 'sinon';
import {MapaInformacaoConnector} from 'base-autoritativa-connectors';
import Sistemas from '../../src/models/Sistemas';

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
  getAllSistemas:{},
  getSistema:{},
  getAllSistemaDbUsers:{},
  getTablesReadByUser:{}
};

let should = chai.should();
let expect = chai.expect;

let allResponse = [
  {
    id:1,
    name:'Test1'
  },
  {
    id:2,
    name:'Test2'
  }
];

let tabelasParsedResults = [
  {fromId:'a1',fromIdentificador:'b1',verb:'c1',toId:'d1',toIdentificador:'e1'},
  {fromId:'a2',fromIdentificador:'b2',verb:'c2',toId:'d2',toIdentificador:'e1'},
  {fromId:'a3',fromIdentificador:'b3',verb:'c3',toId:'d3',toIdentificador:'e3'}
]

let allUsers = [
  {id:'user1'},
  {id:'user2'}
];

let tabelasReadbySistemaResponse = {
  'e1':{
    data:[
      {fromId:'a1',fromIdentificador:'b1',verb:'c1',toId:'d1',toIdentificador:'e1'},
      {fromId:'a2',fromIdentificador:'b2',verb:'c2',toId:'d2',toIdentificador:'e1'}
    ],
    count:2
  },
  'e3':{
    data:[
      {fromId:'a3',fromIdentificador:'b3',verb:'c3',toId:'d3',toIdentificador:'e3'}
    ],
    count:1
  }
};

let totalTabelasReadBySistema = 3;

describe('Sistemas Model', () => {
  before(() => {
    Sistemas.setConfig(config);
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

  it('should list all Sistemas', (done) => {
    mockStubs.getAllSistemas = sinon.stub(MapaInformacaoConnector.prototype,'getAllSistemas');
    mockStubs.getAllSistemas.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:allResponse}) )} );

    Sistemas.getAll().then( (data) => {
      mockStubs.getAllSistemas.calledOnce.should.be.ok;
      data.should.be.deep.equal({status:'Success',data:allResponse});
      done();
    } ).catch( (reason) => {
      done(reason);
    } );
  });

  it('should get a sistema', (done) => {
    mockStubs.getSistema = sinon.stub(MapaInformacaoConnector.prototype,'getSistema');
    mockStubs.getSistema.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:allResponse[0]}) )} );

    Sistemas.getSistema('Test1').then( (data) => {
      mockStubs.getSistema.calledOnce.should.be.ok;
      data.should.be.deep.equal({status:'Success',data:allResponse[0]});
      done();
    } ).catch( (reason) => {
      done(reason);
    } );
  });

  it('should get all db users of a sistema', (done) => {
    mockStubs.getAllSistemaDbUsers = sinon.stub(MapaInformacaoConnector.prototype,'getAllSistemaDbUsers');
    mockStubs.getAllSistemaDbUsers.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:allResponse}) )} );

    Sistemas.getAllSistemaDbUsers('Test1').then( (data) => {
      mockStubs.getAllSistemaDbUsers.calledOnce.should.be.ok;
      data.should.be.deep.equal({status:'Success',data:allResponse});
      done();
    } ).catch( (reason) => {
      done(reason);
    } );
  });

  it('should list tabelas read by Sistema', (done) => {
    mockStubs.getAllSistemaDbUsers = sinon.stub(MapaInformacaoConnector.prototype,'getAllSistemaDbUsers');
    mockStubs.getAllSistemaDbUsers.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:allResponse}) )} );
    mockStubs.getTablesReadByUser = sinon.stub(MapaInformacaoConnector.prototype,'getTablesReadByUser');
    mockStubs.getTablesReadByUser.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:tabelasParsedResults}) )} );

    Sistemas.getTablesReadBySistema('Test1').then( (data) => {
      mockStubs.getAllSistemaDbUsers.calledOnce.should.be.ok;
      mockStubs.getTablesReadByUser.calledOnce.should.be.ok;
      data.should.be.ok;
      data.status.should.be.equal('Success');
      data.data.totalTabelas.should.be.equal(totalTabelasReadBySistema);
      data.data.results.should.be.deep.equal(tabelasReadbySistemaResponse);
      done();
    } ).catch( (reason) => {
      done(reason);
    } );
  });

  it('should handle no sistema name on tabelas read by Sistema', (done) => {
    mockStubs.getAllSistemaDbUsers = sinon.stub(MapaInformacaoConnector.prototype,'getAllSistemaDbUsers');
    mockStubs.getAllSistemaDbUsers.callsFake( () => {return new Promise( (resolve,reject) => reject({status:'Failure',data:'No Sistema name provided'}) )} );
    mockStubs.getTablesReadByUser = sinon.stub(MapaInformacaoConnector.prototype,'getTablesReadByUser');
    mockStubs.getTablesReadByUser.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:tabelasParsedResults}) )} );

    Sistemas.getTablesReadBySistema().then( (data) => {
      done('Unhandled no sistema name');
    } ).catch( (reason) => {
      mockStubs.getAllSistemaDbUsers.calledOnce.should.be.ok;
      mockStubs.getTablesReadByUser.calledOnce.should.be.not.ok;
      reason.should.be.deep.equal({status:'Failure',data:'No Sistema name provided'});
      done();
    } );
  });

  it('should handle empty sistema name on tabelas read by Sistema', (done) => {
    mockStubs.getAllSistemaDbUsers = sinon.stub(MapaInformacaoConnector.prototype,'getAllSistemaDbUsers');
    mockStubs.getAllSistemaDbUsers.callsFake( () => {return new Promise( (resolve,reject) => reject({status:'Failure',data:'No Sistema name provided'}) )} );
    mockStubs.getTablesReadByUser = sinon.stub(MapaInformacaoConnector.prototype,'getTablesReadByUser');
    mockStubs.getTablesReadByUser.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:tabelasParsedResults}) )} );

    Sistemas.getTablesReadBySistema('').then( (data) => {
      done('Unhandled no sistema name');
    } ).catch( (reason) => {
      mockStubs.getAllSistemaDbUsers.calledOnce.should.be.ok;
      mockStubs.getTablesReadByUser.calledOnce.should.be.not.ok;
      reason.should.be.deep.equal({status:'Failure',data:'No Sistema name provided'});
      done();
    } );
  });

  it('should handle empty user list on tabelas read by Sistema', (done) => {
    mockStubs.getAllSistemaDbUsers = sinon.stub(MapaInformacaoConnector.prototype,'getAllSistemaDbUsers');
    mockStubs.getAllSistemaDbUsers.callsFake( () => {return new Promise( (resolve,reject) => resolve({status:'Success',data:[]}) )} );
    mockStubs.getTablesReadByUser = sinon.stub(MapaInformacaoConnector.prototype,'getTablesReadByUser');
    mockStubs.getTablesReadByUser.callsFake( () => {return new Promise( (resolve) => resolve({status:'Success',data:tabelasParsedResults}) )} );

    Sistemas.getTablesReadBySistema('Test1').then( (data) => {
      mockStubs.getAllSistemaDbUsers.calledOnce.should.be.ok;
      mockStubs.getTablesReadByUser.calledOnce.should.be.not.ok;
      data.should.be.deep.equal({status:'Success',data:{results:{}, totalTabelas:0}});
      done();
    } ).catch( (reason) => {
      done(reason);
    } );
  });

  it('should handle get tables by user exception on tabelas read by Sistema', (done) => {
    mockStubs.getAllSistemaDbUsers = sinon.stub(MapaInformacaoConnector.prototype,'getAllSistemaDbUsers');
    mockStubs.getAllSistemaDbUsers.callsFake( () => {return new Promise( (resolve,reject) => resolve({status:'Success',data:allUsers}) )} );
    mockStubs.getTablesReadByUser = sinon.stub(MapaInformacaoConnector.prototype,'getTablesReadByUser');
    mockStubs.getTablesReadByUser.callsFake( () => {return new Promise( (resolve,reject) => reject({status:'Failure',data:'Error on fetching tabelas'}) )} );

    Sistemas.getTablesReadBySistema('Test1').then( (data) => {
      done('Unhandled exception');
    } ).catch( (reason) => {
      mockStubs.getAllSistemaDbUsers.calledOnce.should.be.ok;
      mockStubs.getTablesReadByUser.calledOnce.should.be.ok;
      reason.should.be.deep.equal({status:'Failure',data:'Error on fetching tabelas'});
      done();
    } );
  });
});
