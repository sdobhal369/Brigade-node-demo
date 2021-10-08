From node:9-slim
WORKDIR /app
COPY package.json /app
RUN npm update
COPY . /app
CMD ["npm", "start"]
