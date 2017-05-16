import chai from 'chai';
import sinon from 'sinon';
import Tabelas from '../../src/models/Tabelas';
let mockStubs = {
  getTabelasDeBancoDeDadosLinks: {}
};

import bulkcreate from '../../src/api/bulkcreate';

let should = chai.should();
let expect = chai.expect;
let db = {}, config = {};

let getTabelasDeBancoDeDadosLinksResponse = {
  tabelas:['tabela1','tabela2','tabela3']
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
          data.should.be.equal(getTabelasDeBancoDeDadosLinksResponse);
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
      return new Promise( (resolve,reject) => reject('error'));
    });
    let res = {
      json:(data) => done('Unhandled exception'),
      status: (errCode) => {
        return {
          send:(reason)=>{
            mockStubs.getTabelasDeBancoDeDadosLinks.calledOnce.should.be.ok;
            errCode.should.be.equal(400);
            reason.should.be.ok;
            reason.should.be.equal('error');
            mockStubs.getTabelasDeBancoDeDadosLinks.restore();
            done();
          }};
      }
    };
    bulkcreate.extraFunctions.tabelas_de_banco_de_dados.action({params:'test'},res);
  });

});
