From node:9-slim

WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
COPY brigade.js /app/brigade.js
RUN npm install
CMD ["npm", "start"]
