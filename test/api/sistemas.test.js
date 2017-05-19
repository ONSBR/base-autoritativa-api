import chai from 'chai';
import sinon from 'sinon';
import Sistemas from '../../src/models/Sistemas';
let mockStubs = {
  getAll: {},
  getSistema: {},
  getAllSistemaDbUsers: {},
  getTablesReadBySistema: {}
};

import sistemas from '../../src/api/sistemas';

let should = chai.should();
let expect = chai.expect;
let db = {}, config = {};

let getAllResponse = [
  {
    id:1,
    name:'Test1'
  },
  {
    id:2,
    name:'Test2'
  }
];

let getAllTabelasResponseCSV = 'Usuário,Verbo,Tabelas\ninformix.bd_tecn.sagic,é uma Tabela com leitura pelo Login,"informix.bd_tecn.informix.age,informix.bd_tecn.informix.agecos"\ninformix.rpdp.sagic,é uma Tabela com leitura pelo Login,"informix.rpdp.informix.altercad,informix.rpdp.informix.area"'

let getAllTabelasResponse = {
  "results": {
    "informix.bd_tecn.sagic": {
      "data": [
        {
          "fromId": 2612223,
          "fromIdentificador": "informix.bd_tecn.informix.age",
          "verb": "é uma Tabela com leitura pelo Login",
          "toId": 2670265,
          "toIdentificador": "informix.bd_tecn.sagic"
        },
        {
          "fromId": 2612214,
          "fromIdentificador": "informix.bd_tecn.informix.agecos",
          "verb": "é uma Tabela com leitura pelo Login",
          "toId": 2670265,
          "toIdentificador": "informix.bd_tecn.sagic"
        }
      ]
    },
    "informix.rpdp.sagic": {
      "data": [
        {
          "fromId": 2611604,
          "fromIdentificador": "informix.rpdp.informix.altercad",
          "verb": "é uma Tabela com leitura pelo Login",
          "toId": 2670077,
          "toIdentificador": "informix.rpdp.sagic"
        },
        {
          "fromId": 2611591,
          "fromIdentificador": "informix.rpdp.informix.area",
          "verb": "é uma Tabela com leitura pelo Login",
          "toId": 2670077,
          "toIdentificador": "informix.rpdp.sagic"
        }
      ]
    }
  },
  "totalTabelas": 315
};

describe('sistemas handler', () => {
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

  it('should list sistemas', (done) => {
    mockStubs.getAll = sinon.stub(Sistemas,'getAll');
    mockStubs.getAll.callsFake(() => {return new Promise((resolve) => resolve({status:'Success',data:getAllResponse}))});
    sistemas.generalFunctions.index({params:'test'},{
      json:(data) => {
        mockStubs.getAll.calledOnce.should.be.ok;
        data.should.be.equal(getAllResponse);
        mockStubs.getAll.restore();
        done();
      },
      status: (errCode) => {
        return {send:(reason)=>{done(reason)}};
      }
    });
  });

  it('should return system errors on list sistemas', (done) => {
    mockStubs.getAll = sinon.stub(Sistemas,'getAll');
    mockStubs.getAll.callsFake(() => {return new Promise((resolve, reject) => reject({status:'Failure',data:'error'}))});
    sistemas.generalFunctions.index({params:'test'},{
      json:(data) => {
        mockStubs.getAll.restore();
        done('Unhandled error');
      },
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getAll.calledOnce.should.be.ok;
            errCode.should.be.equal(400);
            reason.should.be.deep.equal({status:'Failure',data:'error'});
            mockStubs.getAll.restore();
            done();
          }};
      }
    });
  });

  it('should load one sistema', (done) => {
      mockStubs.getSistema = sinon.stub(Sistemas,'getSistema');
      mockStubs.getSistema.callsFake( () => {
        return new Promise( (resolve) => resolve({status:'Success',data:[getAllResponse[0]]}));
      });
      sistemas.generalFunctions.load({params:'test'},1,(err,data) => {
        mockStubs.getSistema.calledOnce.should.be.ok;
        should.not.exist(err);
        data.should.be.equal(getAllResponse[0]);
        mockStubs.getSistema.restore();
        done();
      });
  });

  it('should handle error on load one sistema', (done) => {
    mockStubs.getSistema = sinon.stub(Sistemas,'getSistema');
    mockStubs.getSistema.callsFake( () => {
      return new Promise( (resolve,reject) => reject({status:'Failure',data:'error'}));
    });
    sistemas.generalFunctions.load({params:'test'},1,(err,data) => {
      mockStubs.getSistema.calledOnce.should.be.ok;
      err.should.be.deep.equal({status:'Failure',data:'error'});
      should.not.exist(data);
      mockStubs.getSistema.restore();
      done();
    });
  });
  it('should return single sistema', (done) => {
    let res = {
      json: sinon.spy()
    }
    sistemas.generalFunctions.read({sistema:getAllResponse[0]}, res);
    res.json.calledOnce.should.be.ok;
    res.json.calledWith(getAllResponse[0]).should.be.ok;
    done();
  });
  it('should return a list of users of a sistema', (done) => {
    mockStubs.getAllSistemaDbUsers = sinon.stub(Sistemas,'getAllSistemaDbUsers');
    mockStubs.getAllSistemaDbUsers.callsFake( () => {
      return new Promise( (resolve) => resolve({status:'Success',data:getAllResponse}));
    });
    sistemas.extraFunctions.users.action({params:{sistema:'test'}}, {
      json:(data) => {
        mockStubs.getAllSistemaDbUsers.calledOnce.should.be.ok;
        data.should.be.equal(getAllResponse);
        mockStubs.getAllSistemaDbUsers.restore();
        done();
      },
      status: (errCode) => {
        return {
          send:(reason)=>{
            done('Unhandled error');
          }};
      }
    });
  });
  it('should handle no sistema name for a list of users of a sistema', (done) => {
    mockStubs.getAllSistemaDbUsers = sinon.stub(Sistemas,'getAllSistemaDbUsers');
    mockStubs.getAllSistemaDbUsers.callsFake( () => {
      return new Promise( (resolve) => resolve({status:'Success',data:getAllResponse}));
    });
    sistemas.extraFunctions.users.action({params:{}}, {
      json:(data) => {
        mockStubs.getAllSistemaDbUsers.restore();
        done('Unhandled error');
      },
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getAllSistemaDbUsers.calledOnce.should.not.be.ok;
            errCode.should.be.equal(400);
            reason.should.be.ok;
            reason.should.be.deep.equal({status:'Failure',data:{message:'Invalid sistema param'}});
            mockStubs.getAllSistemaDbUsers.restore();
            done();
          }};
      }
    });
  });
  it('should handle empty sistema name for a list of users of sistema', (done) => {
    mockStubs.getAllSistemaDbUsers = sinon.stub(Sistemas,'getAllSistemaDbUsers');
    mockStubs.getAllSistemaDbUsers.callsFake( () => {
      return new Promise( (resolve) => resolve({status:'Success',data:getAllResponse}));
    });
    sistemas.extraFunctions.users.action({params:{sistema:''}}, {
      json:(data) => {
        mockStubs.getAllSistemaDbUsers.restore();
        done('Unhandled error');
      },
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getAllSistemaDbUsers.calledOnce.should.not.be.ok;
            errCode.should.be.equal(400);
            reason.should.be.ok;
            reason.should.be.deep.equal({status:'Failure',data:{message:'Invalid sistema param'}});
            mockStubs.getAllSistemaDbUsers.restore();
            done();
          }};
      }
    });
  });
  it('should handle error for list of users of sistema', (done) => {
    mockStubs.getAllSistemaDbUsers = sinon.stub(Sistemas,'getAllSistemaDbUsers');
    mockStubs.getAllSistemaDbUsers.callsFake( () => {
      return new Promise( (resolve, reject) => reject({status:'Failure',data:'error'}));
    });
    sistemas.extraFunctions.users.action({params:{sistema:'test'}}, {
      json:(data) => {
        mockStubs.getAllSistemaDbUsers.restore();
        done('Unhandled error');
      },
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getAllSistemaDbUsers.calledOnce.should.be.ok;
            errCode.should.be.equal(400);
            reason.should.be.deep.equal({status:'Failure',data:'error'});
            mockStubs.getAllSistemaDbUsers.restore();
            done();
          }};
      }
    });
  });
  it('should return a list of tabelas read by sistema', (done) => {
    mockStubs.getTablesReadBySistema = sinon.stub(Sistemas,'getTablesReadBySistema');
    mockStubs.getTablesReadBySistema.callsFake( () => {
      return new Promise( (resolve) => resolve({status:'Success',data:getAllResponse}));
    });
    sistemas.extraFunctions.tables.action({params:{sistema:'test'},query:{}}, {
      json:(data) => {
        mockStubs.getTablesReadBySistema.calledOnce.should.be.ok;
        data.should.be.equal(getAllResponse);
        mockStubs.getTablesReadBySistema.restore();
        done();
      },
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getTablesReadBySistema.restore();
            done('Unhandled error');
          }};
      }
    });
  });
  it('should handle no sistema name for a list of tabelas read by sistema', (done) => {
    mockStubs.getTablesReadBySistema = sinon.stub(Sistemas,'getTablesReadBySistema');
    mockStubs.getTablesReadBySistema.callsFake( () => {
      return new Promise( (resolve) => resolve({status:'Success',data:getAllResponse}));
    });
    sistemas.extraFunctions.tables.action({params:{},query:{}}, {
      json:(data) => {
        mockStubs.getTablesReadBySistema.restore();
        done('Unhandled error');
      },
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getTablesReadBySistema.calledOnce.should.not.be.ok;
            errCode.should.be.equal(400);
            reason.should.be.ok;
            reason.should.be.deep.equal({status:'Failure',data:{message:'Invalid sistema param'}});
            mockStubs.getTablesReadBySistema.restore();
            done();
          }};
      }
    });
  });
  it('should handle empty sistema name for a list of tabelas read by sistema', (done) => {
    mockStubs.getTablesReadBySistema = sinon.stub(Sistemas,'getTablesReadBySistema');
    mockStubs.getTablesReadBySistema.callsFake( () => {
      return new Promise( (resolve) => resolve({status:'Success',data:getAllResponse}));
    });
    sistemas.extraFunctions.tables.action({params:{sistema:''},query:{}}, {
      json:(data) => {
        mockStubs.getTablesReadBySistema.restore();
        done('Unhandled error');
      },
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getTablesReadBySistema.calledOnce.should.not.be.ok;
            errCode.should.be.equal(400);
            reason.should.be.ok;
            reason.should.be.deep.equal({status:'Failure',data:{message:'Invalid sistema param'}});
            mockStubs.getTablesReadBySistema.restore();
            done();
          }};
      }
    });
  });
  it('should handle an error for a list of tabelas read by sistema', (done) => {
    mockStubs.getTablesReadBySistema = sinon.stub(Sistemas,'getTablesReadBySistema');
    mockStubs.getTablesReadBySistema.callsFake( () => {
      return new Promise( (resolve, reject) => reject({status:'Failure',data:'error'}));
    });
    sistemas.extraFunctions.tables.action({params:{sistema:'test'},query:{}}, {
      json:(data) => {
        mockStubs.getTablesReadBySistema.restore();
        done('Unhandled error');
      },
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getTablesReadBySistema.calledOnce.should.be.ok;
            errCode.should.be.equal(400);
            reason.should.be.deep.equal({status:'Failure',data:'error'});
            mockStubs.getTablesReadBySistema.restore();
            done();
          }};
      }
    });
  });
  it('should return a csv file of a list of tabelas read by sistema', (done) => {
    mockStubs.getTablesReadBySistema = sinon.stub(Sistemas,'getTablesReadBySistema');
    mockStubs.getTablesReadBySistema.callsFake( () => {
      return new Promise( (resolve) => resolve({status:'Success',data:getAllTabelasResponse}));
    });
    sistemas.extraFunctions.tables.action({params:{sistema:'test'},query:{format:'csv'}}, {
      json:(data) => {
        mockStubs.getTablesReadBySistema.restore();
        done('Unhandled format');
      },
      status: (stat) => {
        return {
          send:(payload)=>{
            stat.should.be.equal(200);
            payload.should.be.equal(getAllTabelasResponseCSV);
            mockStubs.getTablesReadBySistema.calledOnce.should.be.ok;
            mockStubs.getTablesReadBySistema.restore();
            done();
          }};
      }
    });
  });
  it('should return a json of a list of tabelas read by sistema', (done) => {
    mockStubs.getTablesReadBySistema = sinon.stub(Sistemas,'getTablesReadBySistema');
    mockStubs.getTablesReadBySistema.callsFake( () => {
      return new Promise( (resolve) => resolve({status:'Success',data:getAllResponse}));
    });
    sistemas.extraFunctions.tables.action({params:{sistema:'test'},query:{format:'cs'}}, {
      json:(data) => {
        mockStubs.getTablesReadBySistema.calledOnce.should.be.ok;
        data.should.be.equal(getAllResponse);
        mockStubs.getTablesReadBySistema.restore();
        done();
      },
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getTablesReadBySistema.restore();
            done('Unhandled error');
          }};
      }
    });
  });

});
