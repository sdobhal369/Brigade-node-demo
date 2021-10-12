From node:9-slim

WORKDIR /app
COPY . /app
RUN npm install
CMD ["npm", "build"]
