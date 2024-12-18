FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY server.js ./
COPY auth.js ./

# Copy test files (assuming tests are in the 'test' directory)
COPY test/ ./app.test.js/

# Run the tests before starting the server
RUN npm test  # This will execute tests

EXPOSE 5000

CMD ["node", "server.js"]

