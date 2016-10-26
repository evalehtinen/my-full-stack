const mongoose = require("mongoose");
const Image = require('../models/image');


//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../main.js');
const should = chai.should();

chai.use(chaiHttp);

/*
  * Test the /GET route
  */
  describe('/GET images', () => {
      it('it should GET images', (done) => {
        var testimage = new Image({title: "flowers"})
        testimage.save((err, testimage) => {                      
        chai.request(server)
            .get('/images')            
            .send(testimage.title)
            .end((err, res) => {
                res.should.have.status(200);
//                res.body.should.be.a('array');
//                res.body.length.should.be.eql(1);
              done();
            });
        });
      });
  });

