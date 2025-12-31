# Stage 1: Build the Angular application
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_STORAGE_BUCKET
ARG FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_APP_ID
ARG FIREBASE_DATABASE_URL

RUN sed -i "s|PLACEHOLDER_API_KEY|$FIREBASE_API_KEY|g" src/environments/environment.prod.ts && \
    sed -i "s|PLACEHOLDER_AUTH_DOMAIN|$FIREBASE_AUTH_DOMAIN|g" src/environments/environment.prod.ts && \
    sed -i "s|PLACEHOLDER_PROJECT_ID|$FIREBASE_PROJECT_ID|g" src/environments/environment.prod.ts && \
    sed -i "s|PLACEHOLDER_STORAGE_BUCKET|$FIREBASE_STORAGE_BUCKET|g" src/environments/environment.prod.ts && \
    sed -i "s|PLACEHOLDER_MESSAGING_SENDER_ID|$FIREBASE_MESSAGING_SENDER_ID|g" src/environments/environment.prod.ts && \
    sed -i "s|PLACEHOLDER_APP_ID|$FIREBASE_APP_ID|g" src/environments/environment.prod.ts && \
    sed -i "s|PLACEHOLDER_DATABASE_URL|$FIREBASE_DATABASE_URL|g" src/environments/environment.prod.ts

RUN npm run build -- --configuration production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
