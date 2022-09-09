# FROM nginx:1.17.1-alpine
# COPY /dist/ /usr/share/nginx/html

# stage 1
FROM node:12 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

#stage 2
FROM nginx:1.17.1-alpine
COPY --from=node /app/dist/ /usr/share/nginx/html