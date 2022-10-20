//Require the dev-dependencies
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const MockDatabaseService = require("./class.mock.database.service");

describe('Test Database methods', () => {
    let db = new MockDatabaseService();
    let eventId;
    let eventsLength;
    beforeEach(async function(){
        const countObj = await db.getEventsCount(false);
        eventsLength = countObj.count;
    })

    console.log('#1: eventsLength: ', eventsLength);

    it('should add an event and return only the new event', (done) => {
        const event ={
            title: 'New Test event',
            description: 'Test Event Description'
        };
        const response = db.addEvent(event, false).then(data => {
            data.should.be.a('object');
            data.event.title.should.eql('New Test event');
            eventId = data.event.id;
            done();
        }).catch(err => {
            console.log('#1: Error: ', err.message);
            done(err);
        });
    });

    it('should update the last entry', (done) => {
        const event ={
            title: 'New Test event updated'
        };
        const response = db.updateEvent(eventId, event, false).then(data => {
            data.should.be.a('object');
            data.event.title.should.eql('New Test event updated');
            done();
        }).catch(err => {
            console.log('#2: Error: ', err.message);
            done(err);
        });
    });

    it('should get an entry by valid id', (done) => {
        const response = db.getEventById(eventId).then(data => {
            data.should.be.an('object');
            data.event.title.should.eql('New Test event updated');
            done();
        }).catch(err => {
            console.log('#11: Error: ', err.message);
            done(err);
        });
    });

    it('should try to get an entry by an invalid id', (done) => {
        const response = db.getEventById(0).then(data => {
            data.should.be.an('object');
            expect(data.event).to.be.null;
            done();
        }).catch(err => {
            console.log('#11: Error: ', err.message);
            done(err);
        });
    });

    it('should delete the last entry setting it to null', (done) => {
        const response = db.deleteEvent(eventId, false).then(data => {
            data.should.be.a('object');
            data.deletedEvent.title.should.eql('New Test event updated');
            done();
        }).catch(err => {
            console.log('#3: Error: ', err.message);
            done(err);
        });
    });

    it('should get all events entries including nulls', (done) => {
        const response = db.getEvents(true).then(data => {
            data.should.be.a('object');
            data.events.should.be.a('array');
            data.events.length.should.be.greaterThan(0);
            done();
        }).catch(err => {
            console.log('#4: Error: ', err.message);
            done(err);
        });
    });

    it('should get all events entries excluding nulls', (done) => {
        const response = db.getEvents().then(data => {
            data.should.be.a('object');
            data.events.should.be.a('array');
            data.events.length.should.be.greaterThan(0);
            done();
        }).catch(err => {
            console.log('#5: Error: ', err.message);
            done(err);
        });
    });

    it('should get the events count including null entries', (done) => {
        const response = db.getEventsCount().then(data => {
            data.count.should.be.greaterThan(2);
            done();
        }).catch(err => {
            console.log('#6: Error: ', err.message);
            done(err);
        });
    });

    it('should get the events count excluding null entries', (done) => {
        const response = db.getEventsCount(false).then(data => {
            data.count.should.eql(2);
            done();
        }).catch(err => {
            console.log('#7: Error: ', err.message);
            done(err);
        });
    });

    after(function (done) {
        db.deleteLastEntry().then(data => {
            db.getEventsCount(false).then(data => {
                const count = data.count;
                console.log('Count: ', count);
                console.log('#3: eventsLength: ', eventsLength);
                eventsLength.should.eql(count);
                done();
            }).catch(e => {
                done(e);
            })
        }).catch(err => {
            console.log('#8: Error: ', err.message);
            done(err);
        });
    });

});
