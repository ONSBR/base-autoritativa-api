import chai from 'chai';
import sinon from 'sinon';
// import sinonTest from 'sinon-test';
// sinon.test = sinonTest.configureTest(sinon, {useFakeTimers: false});
// sinon.testCase = sinonTest.configureTestCase(sinon);

import sistemas from '../../src/api/sistemas';
let mockStubs = {
  index: {},
  load: {},
  read: {},
  users: {},
  tables: {}
};

import Api from '../../src/api';


let should = chai.should();
let db = {}, config = {};

sinon.config = {
  useFakeTimers: false
};


describe('base-autoritativa-api', () => {
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



  it('should configure routes', () => {
    let router = Api({ config, db });
    router.stack.should.be.a('array');
    router.stack.length.should.be.equal(4);
  });

  it('should call sistemas api module function from /sistemas', (done) => {
    mockStubs.index = sinon.stub(sistemas.generalFunctions,'index');
    let router = Api({ config, db });
    mockStubs.index.callsFake(({params},res) => {
      return res.json({})
    });
    router.handle({ url: '/sistemas', method: 'GET' }, {end:() => {return},status:()=>{return {send:()=>{return}}}}, () => {
      mockStubs.index.calledOnce.should.be.ok;
      mockStubs.index.restore();
      done();
    });
  });

  it('should call sistemas api module function from /sistemas/id', (done) => {
    mockStubs.load = sinon.stub(sistemas.generalFunctions,'load');
    mockStubs.read = sinon.stub(sistemas.generalFunctions,'read');
    let router = Api({ config, db });
    mockStubs.load.callsFake((req, id, cb) => {
      cb(null,id);
    });
    mockStubs.read.callsFake((req,res) => {
      return res.json({})
    });
    router.handle({ url: '/sistemas/id', method: 'GET' }, {end:() => {return}}, () => {
      mockStubs.load.calledOnce.should.be.ok;
      mockStubs.read.calledOnce.should.be.ok;
      mockStubs.read.restore();
      mockStubs.load.restore();
      done();
    });
  });

  it('should call sistemas api module function from /sistemas/id/tables', (done) => {
    mockStubs.tables = sinon.stub(sistemas.extraFunctions.tables,'action');
    mockStubs.load = sinon.stub(sistemas.generalFunctions,'load');
    mockStubs.tables.callsFake((req,res) => {
      return res.json({})
    });
    mockStubs.load.callsFake((req, id, cb) => {
      cb(null,id);
    });
    let router = Api({ config, db });
    router.handle({ url: '/sistemas/id/tables', method: 'GET' }, {end:() => {return}}, () => {
      mockStubs.load.calledOnce.should.be.ok;
      mockStubs.tables.calledOnce.should.be.ok;
      mockStubs.tables.restore();
      mockStubs.load.restore();
      done();
    });
  });

  it('should call sistemas api module function from /sistemas/id/users', (done) => {
    mockStubs.load = sinon.stub(sistemas.generalFunctions,'load');
    mockStubs.users = sinon.stub(sistemas.extraFunctions.users,'action');
    mockStubs.users.callsFake((req,res) => {
      return res.json({})
    });
    mockStubs.load.callsFake((req, id, cb) => {
      cb(null,id);
    });
    let router = Api({ config, db });
    router.handle({ url: '/sistemas/id/users', method: 'GET' }, {end:() => {return}}, () => {
      mockStubs.load.calledOnce.should.be.ok;
      mockStubs.users.calledOnce.should.be.ok;
      mockStubs.load.restore();
      mockStubs.users.restore();
      done();
    });
  });
});
