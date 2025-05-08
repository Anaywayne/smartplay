// smartplay/server/test/unit/controllers/authController.test.js
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const { register, login } = require('../../../controllers/authController');
const User = require('../../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res, statusStub, jsonStub;

  beforeEach(() => {
    statusStub = sinon.stub();
    jsonStub = sinon.stub();
    
    res = {
      status: statusStub,
      json: jsonStub
    };
    
    statusStub.returns(res);
  });

  describe('register', () => {
    it('should return 400 if email or password is missing', async () => {
      req = { body: {} };
      
      await register(req, res);
      
      expect(statusStub.calledWith(400)).to.be.true;
      expect(jsonStub.calledWith(sinon.match({ message: 'Email and password are required' }))).to.be.true;
    });
    
    // Add more tests for register function
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      req = { body: {} };
      
      await login(req, res);
      
      expect(statusStub.calledWith(400)).to.be.true;
      expect(jsonStub.calledWith(sinon.match({ message: 'Email and password are required' }))).to.be.true;
    });
    
    // Add more tests for login function
  });
});
