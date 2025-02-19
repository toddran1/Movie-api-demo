import request from 'supertest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import app from '../src/server';

// Mock Adapter
const mock = new MockAdapter(axios);

describe('GET /movies/:year', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should return movies with editors', async () => {
    mock.onGet('https://api.themoviedb.org/3/discover/movie').reply(200, {
      results: [
        {
          id: 1,
          title: 'Joker',
          release_date: '2019-01-01',
          vote_average: 8.19
        }
      ]
    });

    mock.onGet('https://api.themoviedb.org/3/movie/1/credits').reply(200, {
      crew: [
        {known_for_department: 'Editing', name: 'Jeff Groth'},
        {known_for_department: 'Editing', name: 'Jill Bogdanowicz'},
      ],
    });

    const response = await request(app).get('/movies/2019');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        title: 'Joker',
        release_date: '2019-01-01',
        vote_average: 8.19,
        editors: ['Jeff Groth', 'Jill Bogdanowicz']
      }
    ]);
  });

  it('should handle credit API failure', async () => {
    mock.onGet('https://api.themoviedb.org/3/discover/movie').reply(200, {
      results: [
        {
          id: 2,
          title: 'Another Movie',
          release_date: '2019-02-01',
          vote_average: 7.5
        }
      ]
    });

    mock.onGet('https://api.themoviedb.org/3/movie/2/credits').reply(500);

    const response = await request(app).get('/movies/2019');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        title: 'Another Movie',
        release_date: '2019-02-01',
        vote_average: 7.5,
        editors: []
      }
    ]);
  });
});
