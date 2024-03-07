import request from 'supertest';
import { readFileSync } from 'fs';
import { join } from 'path';

const app = 'http://localhost:3903';
const agent = request(app);

describe('GET: getPassportDetails', () => {
  it('should return the passport details', async () => {
    // Read the image file and convert it to base64
    const imagePath = join(__dirname, '../data/samplePassport.jpg');
    const imageBuffer = readFileSync(imagePath);

    const response = await agent
      .post('/getPassportDetails')
      .set('Content-Type', 'image/jpeg')
      .send(imageBuffer);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      dateOfBirth: '02 JUL 1985',
      dateOfExpiry: '15 APR 2024',
    });
  });

  it("should fail when the body doesn't has the right format", async () => {
    const response = await agent.post('/getPassportDetails').send({
      abc: [1, 2],
    });

    expect(response.status).toEqual(400);
    expect(response.text).toEqual('Could not fetch the passport details');
  });
});
