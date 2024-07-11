FROM node:20
WORKDIR /app-telemetry

COPY package.json package-lock.json app.js config.js swagger.js .env ./
COPY mongodb ./mongodb
COPY mqtt ./mqtt
COPY routes ./routes

RUN npm install
RUN npm install -g pm2

ARG PORT_BUILD=3000
ENV PORT=$PORT_BUILD
EXPOSE $PORT_BUILD

CMD ["pm2-runtime", "start", "app.js"]

# c6i.xlarge
# m6i.xlarge