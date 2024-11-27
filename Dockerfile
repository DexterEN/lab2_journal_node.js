FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY server.js ./

EXPOSE 5000

CMD ["node", "server.js"]

