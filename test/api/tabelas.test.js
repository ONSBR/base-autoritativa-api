import chai from 'chai';
import sinon from 'sinon';
import Tabelas from '../../src/models/Tabelas';
let mockStubs = {
  getTabela: {}
};

import tabelas from '../../src/api/tabelas';

let should = chai.should();
let expect = chai.expect;
let db = {}, config = {};

let getTabelaResponse = {
  "Código": "age",
  "Data de Cadastro": "2017-02-23 18:55:22.573000000",
  "Identificador": "informix.bd_tecn.informix.age",
  "Descrição": "Lista de agentes, que são cada uma das partes envolvidas em regulamentação, planejamento, acesso, expansão e operação do sistema elétrico, bem como em comercialização e consumo de energia elétrica. O conceito \"agente\" contempla as empresas que participam do ONS ou empresas em países vizinhos que possuem interligação com sistema elétrico sob responsabilidade do ONS.",
  "Número de Linhas": "1938",
  "Nome": "Agente",
  "id": 2672961
};

let getTabelaResponseCSV = 'Código,Data de Cadastro,Identificador,Descrição,Número de registros,Nome,nodeId\nage,2017-02-23 18:55:22.573000000,informix.bd_tecn.informix.age,"Lista de agentes, que são cada uma das partes envolvidas em regulamentação, planejamento, acesso, expansão e operação do sistema elétrico, bem como em comercialização e consumo de energia elétrica. O conceito "agente" contempla as empresas que participam do ONS ou empresas em países vizinhos que possuem interligação com sistema elétrico sob responsabilidade do ONS.",1938,Agente,2672961'

describe('tabelas handler', () => {
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

  it('should load one tabela', (done) => {
      mockStubs.getTabela = sinon.stub(Tabelas,'getTabela');
      mockStubs.getTabela.callsFake( () => {
        return new Promise( (resolve) => resolve([getTabelaResponse]));
      });
      tabelas.generalFunctions.load({params:'test'},'informix.bd_tecn.informix.age',(err,data) => {
        mockStubs.getTabela.calledOnce.should.be.ok;
        should.not.exist(err);
        data.should.be.equal(getTabelaResponse);
        mockStubs.getTabela.restore();
        done();
      });
  });

  it('should handle error on load one sistema', (done) => {
    mockStubs.getTabela = sinon.stub(Tabelas,'getTabela');
    mockStubs.getTabela.callsFake( () => {
      return new Promise( (resolve,reject) => reject('error'));
    });
    tabelas.generalFunctions.load({params:'test'},'informix.bd_tecn.informix.age',(err,data) => {
      mockStubs.getTabela.calledOnce.should.be.ok;
      err.should.be.equal('error');
      should.not.exist(data);
      mockStubs.getTabela.restore();
      done();
    });
  });
  it('should return single tabela', (done) => {
    let res = {
      json: sinon.spy()
    }
    tabelas.generalFunctions.read({tabela:getTabelaResponse,query:{}}, res);
    res.json.calledOnce.should.be.ok; 
    res.json.calledWith(getTabelaResponse).should.be.ok;
    done();
  });

  it('should return a csv file with a single tabela', (done) => {
    let res = {
      json:(data) => {
        done('Unhandled format');
      },
      status: (stat) => {
        return {
          send:(payload)=>{
            stat.should.be.equal(200);
            payload.should.be.equal(getTabelaResponseCSV);
            done();
          }};
      }
    };
    tabelas.generalFunctions.read({tabela:getTabelaResponse,query:{format:'csv'}}, res);
  });

  it('should return a json with a single tabela', (done) => {
    let res = {
      json: sinon.spy(),
      status: (stat) => {
        return {
          send:(payload)=>{
            done('Unhandled format');
          }};
      }
    };
    tabelas.generalFunctions.read({tabela:getTabelaResponse,query:{format:'cs'}}, res);
    res.json.calledOnce.should.be.ok;
    res.json.calledWith(getTabelaResponse).should.be.ok;
    done();
  });

});
