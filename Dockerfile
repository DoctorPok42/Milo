FROM node:24-alpine

ARG GROQ_API_KEY

ENV GROQ_API_KEY=$GROQ_API_KEY
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
COPY build.js ./
COPY src/ ./src/
COPY tsconfig.json ./

RUN npm install && npm run build

CMD ["sh"]
