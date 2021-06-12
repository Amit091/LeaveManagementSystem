var expect = require("chai").expect;
var request = require("request");

describe("Status and content", function() {
    describe("Main page", function() {
        it("Main page content", function(done) {
            request("http://127.0.0.1:5000", function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });
    it("User Login status status", function(done) {
        request("http://127.0.0.1:5000/login", function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            done();
        });
    });

    it("About page content", function(done) {
        request("http://127.0.0.1:5000/about", function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            done();
        });
    });

    it("Holiday page content", function(done) {
        request("http://127.0.0.1:5000/holiday", function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it("Leave Type page content", function(done) {
        request("http://127.0.0.1:5000/leavetype", function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            done();
        });
    });
});