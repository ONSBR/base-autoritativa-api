import chai from 'chai';
import sinon from 'sinon';
import sistemas from '../../src/api/sistemas';
let mockStubs = {
  index: sinon.stub(sistemas.generalFunctions,'index'),
  load: sinon.stub(sistemas.generalFunctions,'load'),
  read: sinon.stub(sistemas.generalFunctions,'read'),
  users: sinon.stub(sistemas.extraFunctions.users,'action'),
  tables: sinon.stub(sistemas.extraFunctions.tables,'action'),
};

import Api from '../../src/api';


let should = chai.should();
let db = {}, config = {};


describe('base-autoritativa-connectors', () => {
  before(() => {
    for (let mockKey in mockStubs) {
      mockStubs[mockKey].callsFake((req,res) => {
        return res.json({})
      });
      mockStubs.load.callsFake((req,id,cb) => {
        cb(null,id);
      })
    }
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



  it('should configure routes', () => {

    let router = Api({ config, db });
    router.stack.should.be.a('array');
    router.stack.length.should.be.equal(4);
  });

  it('should call sistemas api module function from /sistemas', (done) => {
    let router = Api({ config, db });
    router.handle({ url: '/sistemas', method: 'GET' }, {end:() => {return}}, () => {
      mockStubs.index.calledOnce.should.be.ok;
      done();
    });
  });

  it('should call sistemas api module function from /sistemas/id', (done) => {
    let router = Api({ config, db });
    router.handle({ url: '/sistemas/id', method: 'GET' }, {end:() => {return}}, () => {
      mockStubs.load.calledOnce.should.be.ok;
      mockStubs.read.calledOnce.should.be.ok;
      done();
    });
  });

  it('should call sistemas api module function from /sistemas/id/tables', (done) => {
    let router = Api({ config, db });
    router.handle({ url: '/sistemas/id/tables', method: 'GET' }, {end:() => {return}}, () => {
      mockStubs.tables.calledOnce.should.be.ok;
      done();
    });
  });

  it('should call sistemas api module function from /sistemas/id/users', (done) => {
    let router = Api({ config, db });
    router.handle({ url: '/sistemas/id/users', method: 'GET' }, {end:() => {return}}, () => {
      mockStubs.users.calledOnce.should.be.ok;
      done();
    });
  });
});
