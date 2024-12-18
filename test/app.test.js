const request = require('supertest');
const app = require('../server'); // Import the app from server.js

describe('API Endpoint Tests', () => {
    // Test for public health check
    it('GET /healthz should return status OK', async () => {
        const res = await request(app).get('/healthz');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('OK');
    });

    // Test for root route
    it('GET / should return server running message', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('Server is running. Welcome!');
    });

    // Test for private route (unauthorized access)
    it('GET /private should return 401 Unauthorized without token', async () => {
        const res = await request(app).get('/private');
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'No token provided');
    });

    // Test for protected upload route (unauthorized access)
    it('POST /upload should return 401 Unauthorized without token', async () => {
        const res = await request(app).post('/upload').send({
            image: 'data:image/png;base64,examplebase64data'
        });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'No token provided');
    });


    // Test for uploads route (unauthorized access)
    it('GET /uploads/:filename should return 401 Unauthorized without token', async () => {
        const res = await request(app).get('/uploads/example.png');
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'No token provided');
    });


});
