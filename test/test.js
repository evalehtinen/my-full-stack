const mongoose = require("mongoose");
const Image = require('../models/image');


//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
const should = chai.should();

chai.use(chaiHttp);

//Testing the get "refreshed timestamp" route
describe('/GET date', () => {
  it('it should get the timestamp when the database was refreshed last time', (done) => {                  
    chai.request(server)
        .get('/date')        
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
          done();
        });
    });
});

//Testing the get images route and database
describe('/GET images', () => {
  it('it should GET images', (done) => {
    var testimage = new Image({title: "testing"})
    testimage.save((err, testimage) => {                      
    chai.request(server)
        .get('/images')            
        .query({search: testimage.title})
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
          done();
        });
    });
  });
});

//Testing the get "database refresh" route
describe('/GET refresh', () => {
  it('it should refresh database and get timestamp', (done) => {                  
    chai.request(server)
        .get('/refresh')        
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
          done();
        });
    });
  });


