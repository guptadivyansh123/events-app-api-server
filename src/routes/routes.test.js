//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const server = require('../server');

chai.use(chaiHttp);

describe('Test routes', () => {

    describe('GET /', () => {
        it('should return the root/home object', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.be.a('object');
                    chai.assert.isTrue(res.body.message.includes("Events API Server. Version:"));
                    done();
                })
        });
    });

    describe('GET /api/config', () => {
        it('should return the config object', (done) => {
            chai.request(server)
                .get('/api/config')
                .end((err, res) => {
                    res.should.have.status((200));
                    res.body.should.be.a('object');
                    done();
                })
        });
    });

    describe('GET /api/config/team', () => {
        it('should return the team name', (done) => {
            chai.request(server)
                .get('/api/config/team')
                .end((err, res) => {
                    res.should.have.status((200));
                    res.body.should.be.a('object');
                    res.body.config.team.should.be.a('string');
                    done();
                })
        });
    });

    describe('GET /api/config/version', () => {
        it('should return the version', (done) => {
            chai.request(server)
                .get('/api/config/version')
                .end((err, res) => {
                    res.should.have.status((200));
                    res.body.should.be.a('object');
                    res.body.config.version.should.be.a('string');
                    done();
                })
        });
    });

    describe('GET /api/config/notexist', () => {
        it('should return notexist -> null', (done) => {
            chai.request(server)
                .get('/api/config/notexist')
                .end((err, res) => {
                    console.log(res.body.config);
                    res.should.have.status((200));
                    res.body.should.be.a('object');
                    expect(res.body.config.notexist).to.be.null;
                    done();
                })
        });
    });

    describe('GET /api/events', () => {
        it('should return the events', (done) => {
            chai.request(server)
                .get('/api/events')
                .end((err, res) => {
                    res.should.have.status((200));
                    res.body.should.be.a('object');
                    res.body.events.should.a('array');
                    done();
                })
        });
    });

    describe('GET /fred', () => {
        it('should return error 404', (done) => {
            chai.request(server)
                .get('/fred')
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.should.be.a('object');
                    chai.assert.isTrue(res.body.error.message.includes("End Point Not Found"));
                    done();
                })
        });
    });

    describe('Test Save, getByTitle and delete', () => {
        let testEvents = [];
        let eventId;
            it('should post a new event & return all the events', (done) => {
                const event ={
                    title: 'Test event',
                    description: 'Test Event Description'
                };
                chai.request(server)
                    .post('/api/event')
                    .send(event)
                    .end((err, res) => {
                        res.should.have.status((201));
                        res.body.should.be.a('object');
                        res.body.events.should.a('array');
                        done();
                    });
            });

            it('should use title search to get all the test events', (done) => {
                chai.request(server)
                    .get('/api/events/search/title/Test event')
                    .send()
                    .end((err, res) => {
                        res.should.have.status((200));
                        res.body.should.be.a('object');
                        res.body.events.should.a('array');
                        res.body.events.length.should.be.greaterThan(0);
                        testEvents = res.body.events;
                        done();
                    })
            });

            it('should update the first test event', (done) => {
                eventId = testEvents[0].id;
                const event ={
                    title: 'Test event updated',
                };
                chai.request(server)
                    .put(`/api/event/${eventId}`)
                    .send(event)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.events.should.a('array');
                        done();
                    })
            });

        it('should use title search to get updated test event', (done) => {
            chai.request(server)
                .get('/api/events/search/title/Test event updated')
                .send()
                .end((err, res) => {
                    res.should.have.status((200));
                    res.body.should.be.a('object');
                    res.body.events.should.a('array');
                    res.body.events.length.should.be.eql(1);
                    done();
                })
        });

        it('should get event by id', (done) => {
            chai.request(server)
                .get(`/api/event/${eventId}`)
                .send()
                .end((err, res) => {
                    res.should.have.status((200));
                    res.body.should.be.a('object');
                    res.body.event.should.a('object');
                    res.body.event.id.should.be.eql(eventId);
                    done();
                })
        });

        after(function () {
            testEvents.forEach(event => {
                chai.request(server)
                    .delete(`/api/event/${event.id}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status((200));
                        res.body.should.be.a('object');
                        res.body.events.should.a('array');
                    });
            });

            chai.request(server)
                .get('/api/events/search/title/Test event')
                .send()
                .end((err, res) => {
                    res.should.have.status((200));
                    res.body.should.be.a('object');
                    res.body.events.should.a('array');
                    res.body.events.length.should.be.eq(0);
                });
        });
    });
});
