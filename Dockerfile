FROM node:20.8-alpine


WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build
RUN npm prune --omit=dev

#Considering we are using prisma, we need to generate the prisma client and migrate the database
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
RUN npx prisma migrate deploy

ENV NODE_ENV=production


EXPOSE $PORT

CMD ["npm", "start"]

# now just run docker build -t <name> . and docker run -p 8000:8000 <name>