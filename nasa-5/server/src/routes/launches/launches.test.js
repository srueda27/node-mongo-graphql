require("dotenv").config();
const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
  beforeAll( async () => {
    await mongoConnect();
  });

  afterAll( async () => {
    await mongoDisconnect
  })

  describe('Test GET /launches', () => {
    test('It should respond with 200 sucess', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701',
      target: 'Kepler-1652 b',
      launchDate: 'January 4, 2029'
    }

    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701',
      target: 'Kepler-1652 b'
    }

    const launchDataWithBadDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701',
      target: 'Kepler-1652 b',
      launchDate: 'bad date'
    }

    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(requestDate).toBe(responseDate);

      expect(response.body).toMatchObject(launchDataWithoutDate)
    });

    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Missing required launch property',
      })
    });

    test('It should catch catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithBadDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      })
    });
  });

})