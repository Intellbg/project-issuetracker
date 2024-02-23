const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let toUpdateProject = "5871dda29faedc3491ff93bb";
suite('Functional Tests', function () {
    suite('POST', function () {
        test('All', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/passe')
                .send({
                    issue_title: "No prende",
                    issue_text: "Al reiniciar el programa no se ejecuta",
                    created_by: "Un Gato",
                    assigned_to: "David",
                    status_text: "No iniciado",
                })
                .end(function (err, res) {
                    toUpdateProject = res.body['_id']
                    assert.equal(res.status, 201);
                    assert.equal(res.body['issue_title'], "No prende");
                    assert.equal(res.body['issue_text'], "Al reiniciar el programa no se ejecuta",);
                    assert.equal(res.body['created_by'], "Un Gato");
                    assert.equal(res.body['assigned_to'], "David");
                    assert.equal(res.body['status_text'], "No iniciado");
                    done();
                });
        });
        test('Only Required', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/passe')
                .send({
                    issue_title: "No prende",
                    issue_text: "Al reiniciar el programa no se ejecuta",
                    created_by: "Otro Gato",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 201);
                    assert.equal(res.body['issue_title'], "No prende");
                    assert.equal(res.body['issue_text'], "Al reiniciar el programa no se ejecuta",);
                    assert.equal(res.body['created_by'], "Otro Gato");
                    assert.equal(res.body['assigned_to'], "");
                    assert.equal(res.body['status_text'], "");
                    done();
                });
        });
        test('Missing', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/issues/passe')
                .send({
                    issue_title: "No prende",
                    created_by: "Un Gato",
                    assigned_to: "David",
                    status_text: "No iniciado",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body['error'], 'required field(s) missing');
                    done();
                });
        });
    });
    suite('GET', function () {
        test('All', function (done) {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/passe')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 2);
                    done();
                });
        });
        test('One', function (done) {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/passe?created_by=Un Gato')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 1);
                    done();
                });
        });
        test('Multiple', function (done) {
            chai
                .request(server)
                .keepOpen()
                .get('/api/issues/passe?created_by=Un Gato&issue_title=paldea')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 0);
                    done();
                });
        });
    });
    suite('UPDATE', function () {
        test('ONE', function (done) {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/passe')
                .send({
                    _id: toUpdateProject,
                    issue_title: "Nuevo Titulo"
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body['result'], 'successfully updated')
                    assert.equal(res.body['_id'], toUpdateProject)
                    done();
                });
        });
        test('Multiple', function (done) {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/passe')
                .send({
                    _id: toUpdateProject,
                    issue_title: "Nuevo Titulo2",
                    issue_text: "Ocourrio un nuevo lio",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body['result'], 'successfully updated');
                    assert.equal(res.body['_id'], toUpdateProject);
                    done();
                });
        });
        test('Missing id', function (done) {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/passe')
                .send({
                    issue_title: "Nuevo Titulo2",
                    issue_text: "Ocourrio un nuevo lio",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body['error'], "missing _id");
                    done();
                });
        });
        test('Empty', function (done) {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/passe')
                .send({
                    _id: toUpdateProject,
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body['error'], 'no update field(s) sent');
                    assert.equal(res.body['_id'], toUpdateProject);
                    done();
                });
        });
        test('Invalid', function (done) {
            chai
                .request(server)
                .keepOpen()
                .put('/api/issues/passe')
                .send({
                    _id: "2"
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body['error'], 'no update field(s) sent')
                    assert.equal(res.body['_id'], '2')
                    done();
                });
        });
    });
    suite('DELETE', function () {
        test('success', function (done) {
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/passe')
                .send({
                    _id: toUpdateProject,
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body['result'], 'successfully deleted');
                    assert.equal(res.body['_id'], toUpdateProject);
                    done();
                });
        });
        test('invalid', function (done) {
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/passe')
                .send({
                    _id: toUpdateProject,
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body["error"], 'could not delete');
                    assert.equal(res.body["_id"], toUpdateProject);
                    done();
                });
        });
        test('missing', function (done) {
            chai
                .request(server)
                .keepOpen()
                .delete('/api/issues/passe')
                .send({})
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body['error'], 'missing _id')
                    done();
                });
        });
    });
});
