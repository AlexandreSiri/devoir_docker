FROM node:18.19.1-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++ build-base

COPY package*.json ./

RUN npm ci --build-from-source

COPY . .

EXPOSE 3001

ENV DATABASE_URL=${DATABASE_URL}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}
ENV PORT=${PORT}
ENV NODE_ENV=${NODE_ENV}
ENV JWT_KEY=${JWT_KEY}
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

CMD ["npm", "start"]