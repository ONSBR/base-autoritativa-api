import chai from 'chai';
import sinon from 'sinon';
import Sistemas from '../../src/models/Sistemas';
let mockStubs = {
  _fetchResults: {},
  _getArguments: {},
  getAllSistemaDbUsers:{}
};

let should = chai.should();
let expect = chai.expect;
let db = {}, config = {};

let statements = {
  "allSistemas":"MATCH (v:`Sistema`) RETURN v ORDER BY v. `Identificador` SKIP { s } LIMIT { l }",
  "oneSistema":"MATCH (v:`Sistema`) WHERE (lower(v.`Identificador`) CONTAINS 'test1' OR lower(v.`Código`) CONTAINS 'test1') RETURN v ORDER BY v.`Identificador` SKIP { s } LIMIT { l }",
  "allSistemaDBUsers":"MATCH (v:`Login`) WHERE (lower(v.`Identificador`) CONTAINS 'test1' OR lower(v.`Código`) CONTAINS 'test1') RETURN v ORDER BY v.`Identificador` SKIP { s } LIMIT { l }",
  "allTablesReadBySistema":"MATCH (vFrom)-[r]->(vTo) WHERE (id(vFrom) IN [user1,user2] OR id(vTo) IN [user1,user2]) AND type(r) = 'é uma Tabela com leitura pelo Login' RETURN id(vFrom), vFrom.`Identificador`, type(r), id(vTo), vTo.`Identificador` ORDER BY r.type, vFrom.`Identificador`, vTo.`Identificador` SKIP { s } LIMIT { l }"
};

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

let tabelasResponse = [
  {rest:['a1','b1','c1','d1','e1']},
  {rest:['a2','b2','c2','d2','e1']},
  {rest:['a3','b3','c3','d3','e3']}
]

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
    let localArgs = {arg1:1,arg2:2};
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['allSistemas']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args) => {
      return new Promise( (resolve) => resolve(allResponse) );
    });

    Sistemas.getAll().then( (data) => {
      mockStubs._getArguments.calledOnce.should.be.ok;
      mockStubs._fetchResults.calledOnce.should.be.ok;
      data.should.be.deep.equal(allResponse);
      done();
    } ).catch( (reason) => {
      done('Unhandled exception');
    } );
  });

  it('should get a sistema', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['oneSistema']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args) => {
      return new Promise( (resolve) => resolve(allResponse[0]) );
    });

    Sistemas.getSistema('Test1').then( (data) => {
      mockStubs._getArguments.calledOnce.should.be.ok;
      mockStubs._fetchResults.calledOnce.should.be.ok;
      data.should.be.deep.equal(allResponse[0]);
      done();
    } ).catch( (reason) => {
      done('Unhandled exception');
    } );
  });

  it('should handle no sistema name', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['oneSistema']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args) => {
      return new Promise( (resolve) => resolve(allResponse[0]) );
    });

    Sistemas.getSistema().then( (data) => {
      done('Unhandled no sistema name provided');
    } ).catch( (reason) => {
      mockStubs._getArguments.calledOnce.should.be.not.ok;
      mockStubs._fetchResults.calledOnce.should.be.not.ok;
      reason.should.be.equal('No Sistema name provided');
      done();
    } );
  });

  it('should handle empty sistema name', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['oneSistema']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args) => {
      return new Promise( (resolve) => resolve(allResponse[0]) );
    });

    Sistemas.getSistema('').then( (data) => {
      done('Unhandled no sistema name provided');
    } ).catch( (reason) => {
      mockStubs._getArguments.calledOnce.should.be.not.ok;
      mockStubs._fetchResults.calledOnce.should.be.not.ok;
      reason.should.be.equal('No Sistema name provided');
      done();
    } );
  });

  it('should get all db users of a sistema', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['allSistemaDBUsers']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args) => {
      return new Promise( (resolve) => resolve(allResponse) );
    });

    Sistemas.getAllSistemaDbUsers('Test1').then( (data) => {
      mockStubs._getArguments.calledOnce.should.be.ok;
      mockStubs._fetchResults.calledOnce.should.be.ok;
      data.should.be.deep.equal(allResponse);
      done();
    } ).catch( (reason) => {
      done('Unhandled exception');
    } );
  });

  it('should handle no sistema name for all db users', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['allSistemaDBUsers']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args) => {
      return new Promise( (resolve) => resolve(allResponse[0]) );
    });

    Sistemas.getAllSistemaDbUsers().then( (data) => {
      done('Unhandled no sistema name provided');
    } ).catch( (reason) => {
      mockStubs._getArguments.calledOnce.should.be.not.ok;
      mockStubs._fetchResults.calledOnce.should.be.not.ok;
      reason.should.be.equal('No Sistema name provided');
      done();
    } );
  });

  it('should handle empty sistema name for all db users', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['allSistemaDBUsers']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args) => {
      return new Promise( (resolve) => resolve(allResponse[0]) );
    });

    Sistemas.getAllSistemaDbUsers('').then( (data) => {
      done('Unhandled no sistema name provided');
    } ).catch( (reason) => {
      mockStubs._getArguments.calledOnce.should.be.not.ok;
      mockStubs._fetchResults.calledOnce.should.be.not.ok;
      reason.should.be.equal('No Sistema name provided');
      done();
    } );
  });

  it('should list tabelas read by Sistema', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs.getAllSistemaDbUsers = sinon.stub(Sistemas,'getAllSistemaDbUsers');
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs.getAllSistemaDbUsers.callsFake( (sistema) => {
      return new Promise( (resolve,reject) => {
        resolve(allUsers);
      } )
    } );
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['allTablesReadBySistema']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args, parseFunction) => {
      parseFunction.should.be.a('function');
      let parsedResults = [];
      tabelasResponse.forEach( (tabela) => {parseFunction(tabela,parsedResults)} );
      parsedResults.should.be.deep.equal(tabelasParsedResults);
      return new Promise( (resolve) => resolve(parsedResults) );
    });

    Sistemas.getTablesReadBySistema('Test1').then( (data) => {
      mockStubs.getAllSistemaDbUsers.calledOnce.should.be.ok;
      mockStubs._getArguments.calledOnce.should.be.ok;
      mockStubs._fetchResults.calledOnce.should.be.ok;

      data.should.be.ok;
      data.totalTabelas.should.be.equal(totalTabelasReadBySistema);
      data.results.should.be.deep.equal(tabelasReadbySistemaResponse);
      done();
    } ).catch( (reason) => {
      done(reason);
    } );
  });

  it('should handle no sistema name on tabelas read by Sistema', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs.getAllSistemaDbUsers = sinon.stub(Sistemas,'getAllSistemaDbUsers');
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs.getAllSistemaDbUsers.callsFake( (sistema) => {
      return new Promise( (resolve,reject) => {
        resolve(allUsers);
      } )
    } );
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['allTablesReadBySistema']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args, parseFunction) => {
      parseFunction.should.be.a('function');
      let parsedResults = [];
      tabelasResponse.forEach( (tabela) => {parseFunction(tabela,parsedResults)} );
      parsedResults.should.be.deep.equal(tabelasParsedResults);
      return new Promise( (resolve) => resolve(parsedResults) );
    });

    Sistemas.getTablesReadBySistema().then( (data) => {
      done('Unhandled no sistema name');
    } ).catch( (reason) => {
      mockStubs.getAllSistemaDbUsers.calledOnce.should.be.not.ok;
      mockStubs._getArguments.calledOnce.should.be.not.ok;
      mockStubs._fetchResults.calledOnce.should.be.not.ok;
      reason.should.be.equal('No Sistema name provided');
      done();
    } );
  });

  it('should handle empty sistema name on tabelas read by Sistema', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs.getAllSistemaDbUsers = sinon.stub(Sistemas,'getAllSistemaDbUsers');
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs.getAllSistemaDbUsers.callsFake( (sistema) => {
      return new Promise( (resolve,reject) => {
        resolve(allUsers);
      } )
    } );
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['allTablesReadBySistema']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args, parseFunction) => {
      parseFunction.should.be.a('function');
      let parsedResults = [];
      tabelasResponse.forEach( (tabela) => {parseFunction(tabela,parsedResults)} );
      parsedResults.should.be.deep.equal(tabelasParsedResults);
      return new Promise( (resolve) => resolve(parsedResults) );
    });

    Sistemas.getTablesReadBySistema('').then( (data) => {
      done('Unhandled no sistema name');
    } ).catch( (reason) => {
      mockStubs.getAllSistemaDbUsers.calledOnce.should.be.not.ok;
      mockStubs._getArguments.calledOnce.should.be.not.ok;
      mockStubs._fetchResults.calledOnce.should.be.not.ok;
      reason.should.be.equal('No Sistema name provided');
      done();
    } );
  });

  it('should handle getAllSistemaDbUsers exception on tabelas read by Sistema', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs.getAllSistemaDbUsers = sinon.stub(Sistemas,'getAllSistemaDbUsers');
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs.getAllSistemaDbUsers.callsFake( (sistema) => {
      return new Promise( (resolve,reject) => {
        reject('Error on get users');
      } )
    } );
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['allTablesReadBySistema']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args, parseFunction) => {
      parseFunction.should.be.a('function');
      let parsedResults = [];
      tabelasResponse.forEach( (tabela) => {parseFunction(tabela,parsedResults)} );
      parsedResults.should.be.deep.equal(tabelasParsedResults);
      return new Promise( (resolve) => resolve(parsedResults) );
    });

    Sistemas.getTablesReadBySistema('Test1').then( (data) => {
      done('Unhandled exception');
    } ).catch( (reason) => {
      mockStubs.getAllSistemaDbUsers.calledOnce.should.be.ok;
      mockStubs._getArguments.calledOnce.should.be.not.ok;
      mockStubs._fetchResults.calledOnce.should.be.not.ok;
      reason.should.be.equal('Error on get users');
      done();
    } );
  });

  it('should handle _fetchResults exception on tabelas read by Sistema', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs.getAllSistemaDbUsers = sinon.stub(Sistemas,'getAllSistemaDbUsers');
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs.getAllSistemaDbUsers.callsFake( (sistema) => {
      return new Promise( (resolve,reject) => {
        resolve(allUsers);
      } )
    } );
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['allTablesReadBySistema']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args, parseFunction) => {
      return new Promise( (resolve,reject) => reject('Error on fetching tabelas') );
    });

    Sistemas.getTablesReadBySistema('Test1').then( (data) => {
      done('Unhandled exception');
    } ).catch( (reason) => {
      mockStubs.getAllSistemaDbUsers.calledOnce.should.be.ok;
      mockStubs._getArguments.calledOnce.should.be.ok;
      mockStubs._fetchResults.calledOnce.should.be.ok;
      reason.should.be.equal('Error on fetching tabelas');
      done();
    } );
  });

  it('should handle empty user list on tabelas read by Sistema', (done) => {
    let localArgs = {arg1:1,arg2:2};
    mockStubs.getAllSistemaDbUsers = sinon.stub(Sistemas,'getAllSistemaDbUsers');
    mockStubs._getArguments = sinon.stub(Sistemas,'_getArguments');
    mockStubs._fetchResults = sinon.stub(Sistemas,'_fetchResults');
    mockStubs.getAllSistemaDbUsers.callsFake( (sistema) => {
      return new Promise( (resolve,reject) => {
        resolve([]);
      } )
    } );
    mockStubs._getArguments.callsFake( (statement) => {
      statement.should.be.equal(statements['allTablesReadBySistema']);
      return localArgs;
    });
    mockStubs._fetchResults.callsFake( (args, parseFunction) => {
      parseFunction.should.be.a('function');
      let parsedResults = [];
      tabelasResponse.forEach( (tabela) => {parseFunction(tabela,parsedResults)} );
      parsedResults.should.be.deep.equal(tabelasParsedResults);
      return new Promise( (resolve) => resolve(parsedResults) );
    });

    Sistemas.getTablesReadBySistema('Test1').then( (data) => {
      mockStubs.getAllSistemaDbUsers.calledOnce.should.be.ok;
      mockStubs._getArguments.calledOnce.should.be.not.ok;
      mockStubs._fetchResults.calledOnce.should.be.not.ok;
      data.should.be.deep.equal({results:{}, totalTabelas:0});
      done();
    } ).catch( (reason) => {
      done(reason);
    } );
  });
});
