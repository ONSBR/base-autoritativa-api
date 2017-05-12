import chai from 'chai';
import sinon from 'sinon';
import Sistemas from '../../src/models/Sistemas';
let mockStubs = {
  getAll: sinon.stub(Sistemas,'getAll'),
  getSistema: sinon.stub(Sistemas,'getSistema'),
  getAllSistemaDbUsers: sinon.stub(Sistemas,'getAllSistemaDbUsers'),
  getTablesReadBySistema: sinon.stub(Sistemas,'getTablesReadBySistema')
};

import sistemas from '../../src/api/sistemas';



import Api from '../../src/api';


let should = chai.should();
let db = {}, config = {};

let getAllResponse = [
  {id:1},
  {id:2}
];

describe('sistemas handler', () => {
  before(() => {

    for (let mockKey in mockStubs) {
      mockStubs[mockKey].callsFake((req,res) => {
        return res.json({})
      });
    }

    mockStubs.getAll.callsFake(() => {return new Promise((resolve) => resolve(getAllResponse))});
  });

  beforeEach(() => {
  });


  afterEach(() => {
  });

  after(() => {
    for (let mockKey in mockStubs) {
      mockStubs[mockKey].restore();
    }
  });
  it('should list sistemas', (done) => {
    sistemas.generalFunctions.index({params:'test'},{
      json:(data) => {
        data.should.be.equal(getAllResponse);
        done();
      }
    });
  });

});
