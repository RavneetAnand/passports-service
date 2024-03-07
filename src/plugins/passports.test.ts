import request from 'supertest';

const app = 'http://localhost:3903';
const agent = request(app);

describe('GET: getpassports', () => {
  it('should return the passports from the teams', async () => {
    const response = await agent.post('/getpassports').send({
      teams: [1, 2],
    });

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(2);
  });

  it("should fail when the body doesn't has the right format", async () => {
    const response = await agent.post('/getpassports').send({
      teamsList: [1, 2],
    });

    expect(response.status).toEqual(400);
    expect(response.text).toEqual('Invalid request');
  });
});
