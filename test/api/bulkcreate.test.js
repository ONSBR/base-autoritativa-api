import chai from 'chai';
import sinon from 'sinon';
import Tabelas from '../../src/models/Tabelas';
let mockStubs = {
  getTabelasDeBancoDeDadosLinks: {},
  createPageTabelaDeBancoDeDados: {}
};

import bulkcreate from '../../src/api/bulkcreate';

let should = chai.should();
let expect = chai.expect;
let db = {}, config = {};

let getTabelasDeBancoDeDadosLinksResponse = {
  status:'Success',
  data:{tabelas:['tabela1','tabela2','tabela3']}
};

let createPageTabelaDeBancoDeDadosResponse = {
  status:'Success',
  data:[
    {nome:'Tabela1',result:'Success'},
    {nome:'Tabela2',result:'Success'}
  ]
};

describe('bulkcreate handler', () => {
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

  it('should return a json with attribute "tabelas" with a list of existing tabelas', (done) => {
      mockStubs.getTabelasDeBancoDeDadosLinks = sinon.stub(Tabelas,'getTabelasDeBancoDeDadosLinks');
      mockStubs.getTabelasDeBancoDeDadosLinks.callsFake( () => {
        return new Promise( (resolve) => {
          resolve(getTabelasDeBancoDeDadosLinksResponse);
        });
      });
      let res = {
        json: (data) => {
          mockStubs.getTabelasDeBancoDeDadosLinks.calledOnce.should.be.ok;
          data.should.be.deep.equal(getTabelasDeBancoDeDadosLinksResponse.data);
          mockStubs.getTabelasDeBancoDeDadosLinks.restore();
          done();
        },
        status: (stat) => {
          return {
            send:(payload)=>{
              mockStubs.getTabelasDeBancoDeDadosLinks.restore();
              done('Unhandled exception');
            }};
        }
      };
      bulkcreate.extraFunctions.tabelas_de_banco_de_dados.action({params:'test'},res);
  });

  it('should handle error on get list of tabelas', (done) => {
    mockStubs.getTabelasDeBancoDeDadosLinks = sinon.stub(Tabelas,'getTabelasDeBancoDeDadosLinks');
    mockStubs.getTabelasDeBancoDeDadosLinks.callsFake( () => {
      return new Promise( (resolve,reject) => reject({status:'Failure',data:'error'}));
    });
    let res = {
      json:(data) => done('Unhandled exception'),
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getTabelasDeBancoDeDadosLinks.calledOnce.should.be.ok;
            errCode.should.be.equal(400);
            reason.should.be.ok;
            reason.should.be.deep.equal({status:'Failure',data:'error'});
            mockStubs.getTabelasDeBancoDeDadosLinks.restore();
            done();
          }};
      }
    };
    bulkcreate.extraFunctions.tabelas_de_banco_de_dados.action({params:'test'},res);
  });

  it('should create a list of pages Tabela de Banco de Dados', (done) => {
    mockStubs.getTabelasDeBancoDeDadosLinks = sinon.stub(Tabelas,'getTabelasDeBancoDeDadosLinks');
    mockStubs.getTabelasDeBancoDeDadosLinks.callsFake( () => {
      return new Promise( (resolve) => {
        resolve(getTabelasDeBancoDeDadosLinksResponse);
      });
    });
    mockStubs.createPageTabelaDeBancoDeDados = sinon.stub(Tabelas,'createPageTabelaDeBancoDeDados');
    mockStubs.createPageTabelaDeBancoDeDados.callsFake( () => {
      return new Promise( (resolve) => {
        resolve(createPageTabelaDeBancoDeDadosResponse);
      });
    });
    let res = {
      json: (data) => {
        mockStubs.getTabelasDeBancoDeDadosLinks.calledOnce.should.be.ok;
        mockStubs.createPageTabelaDeBancoDeDados.calledOnce.should.be.ok;
        data.should.be.deep.equal(createPageTabelaDeBancoDeDadosResponse);
        mockStubs.getTabelasDeBancoDeDadosLinks.restore();
        mockStubs.createPageTabelaDeBancoDeDados.restore();
        done();
      },
      status: (stat) => {
        return {
          send:(payload)=>{
            mockStubs.getTabelasDeBancoDeDadosLinks.restore();
            mockStubs.createPageTabelaDeBancoDeDados.restore();
            done(payload);
          }};
      }
    };
    bulkcreate.extraFunctions.create_pages_tabelas_de_banco_de_dados.action({},res);
  });

  it('should not create a list of pages Tabela de Banco de Dados on empty tabela list', (done) => {
    mockStubs.getTabelasDeBancoDeDadosLinks = sinon.stub(Tabelas,'getTabelasDeBancoDeDadosLinks');
    mockStubs.getTabelasDeBancoDeDadosLinks.callsFake( () => {
      return new Promise( (resolve) => {
        resolve({status:'Success',data:[]});
      });
    });
    mockStubs.createPageTabelaDeBancoDeDados = sinon.stub(Tabelas,'createPageTabelaDeBancoDeDados');
    mockStubs.createPageTabelaDeBancoDeDados.callsFake( () => {
      return new Promise( (resolve) => {
        resolve(createPageTabelaDeBancoDeDadosResponse);
      });
    });
    let res = {
      json: (data) => {
        mockStubs.getTabelasDeBancoDeDadosLinks.calledOnce.should.be.ok;
        mockStubs.createPageTabelaDeBancoDeDados.calledOnce.should.be.not.ok;
        data.should.be.deep.equal({status:'Success',data:[]});
        mockStubs.getTabelasDeBancoDeDadosLinks.restore();
        mockStubs.createPageTabelaDeBancoDeDados.restore();
        done();
      },
      status: (stat) => {
        return {
          send:(payload)=>{
            mockStubs.getTabelasDeBancoDeDadosLinks.restore();
            mockStubs.createPageTabelaDeBancoDeDados.restore();
            done(payload);
          }};
      }
    };
    bulkcreate.extraFunctions.create_pages_tabelas_de_banco_de_dados.action({},res);
  });

  it('should handle an error on get tabelas on create a list of pages Tabela de Banco de Dados', (done) => {
    mockStubs.getTabelasDeBancoDeDadosLinks = sinon.stub(Tabelas,'getTabelasDeBancoDeDadosLinks');
    mockStubs.getTabelasDeBancoDeDadosLinks.callsFake( () => {
      return new Promise( (resolve,reject) => {
        reject({status:'Failure',data:'error'});
      });
    });
    mockStubs.createPageTabelaDeBancoDeDados = sinon.stub(Tabelas,'createPageTabelaDeBancoDeDados');
    mockStubs.createPageTabelaDeBancoDeDados.callsFake( () => {
      return new Promise( (resolve) => {
        resolve(createPageTabelaDeBancoDeDadosResponse);
      });
    });

    let res = {
      json:(data) => done('Unhandled exception'),
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getTabelasDeBancoDeDadosLinks.calledOnce.should.be.ok;
            mockStubs.createPageTabelaDeBancoDeDados.calledOnce.should.be.not.ok;
            errCode.should.be.equal(400);
            reason.should.be.ok;
            reason.should.be.deep.equal({status:'Failure',data:'error'});
            mockStubs.getTabelasDeBancoDeDadosLinks.restore();
            mockStubs.createPageTabelaDeBancoDeDados.restore();
            done();
          }};
      }
    };
    bulkcreate.extraFunctions.create_pages_tabelas_de_banco_de_dados.action({},res);
  });

  it('should handle an error on create a list of pages Tabelas de Banco de Dados', (done) => {
    let failureCreatePageTabelaDeBancoDeDadosResponse = Object.assign({},createPageTabelaDeBancoDeDadosResponse);
    failureCreatePageTabelaDeBancoDeDadosResponse.status = 'Failure';
    failureCreatePageTabelaDeBancoDeDadosResponse.data[1].result = 'Failure';
    mockStubs.getTabelasDeBancoDeDadosLinks = sinon.stub(Tabelas,'getTabelasDeBancoDeDadosLinks');
    mockStubs.getTabelasDeBancoDeDadosLinks.callsFake( () => {
      return new Promise( (resolve) => {
        resolve(getTabelasDeBancoDeDadosLinksResponse);
      });
    });
    mockStubs.createPageTabelaDeBancoDeDados = sinon.stub(Tabelas,'createPageTabelaDeBancoDeDados');
    mockStubs.createPageTabelaDeBancoDeDados.callsFake( () => {
      return new Promise( (resolve,reject) => {
        reject(failureCreatePageTabelaDeBancoDeDadosResponse);
      });
    });
    let res = {
      json:(data) => done('Unhandled exception'),
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getTabelasDeBancoDeDadosLinks.calledOnce.should.be.ok;
            mockStubs.createPageTabelaDeBancoDeDados.calledOnce.should.be.ok;
            errCode.should.be.equal(400);
            reason.should.be.ok;
            reason.should.be.deep.equal(failureCreatePageTabelaDeBancoDeDadosResponse);
            mockStubs.getTabelasDeBancoDeDadosLinks.restore();
            mockStubs.createPageTabelaDeBancoDeDados.restore();
            done();
          }};
      }
    };
    bulkcreate.extraFunctions.create_pages_tabelas_de_banco_de_dados.action({},res);
  });

  it('should create a single page of Tabela de Banco de dados', (done) => {
    let createOnePageTabelaDeBancoDeDadosResponse = {
      status:'Success',
      data:[
        {nome:'Tabela1',result:'Success'}
      ]
    };
    mockStubs.getTabelasDeBancoDeDadosLinks = sinon.stub(Tabelas,'getTabelasDeBancoDeDadosLinks');
    mockStubs.getTabelasDeBancoDeDadosLinks.callsFake( () => {
      return new Promise( (resolve) => {
        resolve(getTabelasDeBancoDeDadosLinksResponse);
      });
    });
    mockStubs.createPageTabelaDeBancoDeDados = sinon.stub(Tabelas,'createPageTabelaDeBancoDeDados');
    mockStubs.createPageTabelaDeBancoDeDados.callsFake( (tabelas) => {
      expect(tabelas).to.be.ok;
      tabelas.should.be.a('array');
      tabelas.should.be.deep.equal(['tabela']);
      return new Promise( (resolve) => {

        resolve(createOnePageTabelaDeBancoDeDadosResponse);
      });
    });
    let res = {
      json: (data) => {
        mockStubs.getTabelasDeBancoDeDadosLinks.calledOnce.should.be.not.ok;
        mockStubs.createPageTabelaDeBancoDeDados.calledOnce.should.be.ok;
        data.should.be.deep.equal(createOnePageTabelaDeBancoDeDadosResponse);
        mockStubs.getTabelasDeBancoDeDadosLinks.restore();
        mockStubs.createPageTabelaDeBancoDeDados.restore();
        done();
      },
      status: (stat) => {
        return {
          send:(payload)=>{
            mockStubs.getTabelasDeBancoDeDadosLinks.restore();
            mockStubs.createPageTabelaDeBancoDeDados.restore();
            done(payload);
          }};
      }
    }
    bulkcreate.extraFunctions.create_page_tabela_de_banco_de_dados.action({nome_tabela:'tabela'},res);
  });

  it('should handle no tabela name on create on tabela de banco de dados', (done) => {
    mockStubs.getTabelasDeBancoDeDadosLinks = sinon.stub(Tabelas,'getTabelasDeBancoDeDadosLinks');
    mockStubs.getTabelasDeBancoDeDadosLinks.callsFake( () => {
      return new Promise( (resolve) => {
        resolve(getTabelasDeBancoDeDadosLinksResponse);
      });
    });
    mockStubs.createPageTabelaDeBancoDeDados = sinon.stub(Tabelas,'createPageTabelaDeBancoDeDados');
    mockStubs.createPageTabelaDeBancoDeDados.callsFake( () => {
      return new Promise( (resolve,reject) => {
        reject(failureCreatePageTabelaDeBancoDeDadosResponse);
      });
    });
    let res = {
      json:(data) => done('Unhandled exception'),
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getTabelasDeBancoDeDadosLinks.calledOnce.should.be.not.ok;
            mockStubs.createPageTabelaDeBancoDeDados.calledOnce.should.be.not.ok;
            errCode.should.be.equal(400);
            reason.should.be.ok;
            reason.should.be.deep.equal({status:'Failure',data:'Invalid tabela name'});
            mockStubs.getTabelasDeBancoDeDadosLinks.restore();
            mockStubs.createPageTabelaDeBancoDeDados.restore();
            done();
          }};
      }
    };
    bulkcreate.extraFunctions.create_page_tabela_de_banco_de_dados.action({},res);
  });

  it('should handle empty tabela name on create on tabela de banco de dados', (done) => {
    mockStubs.getTabelasDeBancoDeDadosLinks = sinon.stub(Tabelas,'getTabelasDeBancoDeDadosLinks');
    mockStubs.getTabelasDeBancoDeDadosLinks.callsFake( () => {
      return new Promise( (resolve) => {
        resolve(getTabelasDeBancoDeDadosLinksResponse);
      });
    });
    mockStubs.createPageTabelaDeBancoDeDados = sinon.stub(Tabelas,'createPageTabelaDeBancoDeDados');
    mockStubs.createPageTabelaDeBancoDeDados.callsFake( () => {
      return new Promise( (resolve,reject) => {
        reject(failureCreatePageTabelaDeBancoDeDadosResponse);
      });
    });
    let res = {
      json:(data) => done('Unhandled exception'),
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getTabelasDeBancoDeDadosLinks.calledOnce.should.be.not.ok;
            mockStubs.createPageTabelaDeBancoDeDados.calledOnce.should.be.not.ok;
            errCode.should.be.equal(400);
            reason.should.be.ok;
            reason.should.be.deep.equal({status:'Failure',data:'Invalid tabela name'});
            mockStubs.getTabelasDeBancoDeDadosLinks.restore();
            mockStubs.createPageTabelaDeBancoDeDados.restore();
            done();
          }};
      }
    };
    bulkcreate.extraFunctions.create_page_tabela_de_banco_de_dados.action({nome_tabela:''},res);
  });
});
