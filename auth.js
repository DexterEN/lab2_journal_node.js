const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const keycloakUrl = 'https://journal-keycloak.app.cloud.cbh.kth.se/realms/journal'; // Replace with your Keycloak URL
const client = jwksClient({
    jwksUri: `${keycloakUrl}/protocol/openid-connect/certs`, // Keycloak public keys endpoint
});

// Function to get the signing key from Keycloak
function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err);
        }
        callback(null, key.publicKey || key.rsaPublicKey);
    });
}

// Middleware to validate JWT token
function validateJWT(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Attach decoded information (user info) to the request object
        req.user = decoded;
        next(); // Proceed to next middleware or route handler
    });
}

module.exports = validateJWT;
