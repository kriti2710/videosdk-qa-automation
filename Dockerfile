FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npx playwright install --with-deps

COPY . .

# Build React app
RUN npm run build

# Serve React app during tests
RUN npm install -g serve

CMD ["sh", "-c", "serve -s build -l 3000 & npx playwright test"]
