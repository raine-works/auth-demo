FROM node:18-alpine3.17 AS builder 

ARG DATABASE_URL
ARG PORT
ARG SECRET
ARG SALT
ARG MAIL_USER
ARG MAIL_PASS
ARG NODE_ENV
ARG VITE_NODE_ENV

COPY . .
RUN npm install && npm run build

FROM node:18-alpine3.17

COPY --from=builder /.dist /.dist
COPY --from=builder /.server /.server
COPY --from=builder /prisma /prisma
COPY --from=builder /node_modules /node_modules

EXPOSE $PORT

CMD npx prisma migrate deploy; npx prisma generate; node .server/server.js