FROM node:21-alpine
WORKDIR /Frontend
ENV ESLINT_NO_DEV_ERRORS=true
# COPY package*.json ./
# RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build 