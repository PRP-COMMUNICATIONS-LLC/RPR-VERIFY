# Stage 1: Build the Angular application
FROM node:20 as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# ARG and ENV for Firebase secrets
ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_PROJECT_ID

ENV FIREBASE_API_KEY=$FIREBASE_API_KEY
ENV FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID

# Replace placeholders in environment.prod.ts
RUN sed -i "s|__FIREBASE_API_KEY__|${FIREBASE_API_KEY}|g" src/environments/environment.prod.ts && \
    sed -i "s|__FIREBASE_AUTH_DOMAIN__|${FIREBASE_AUTH_DOMAIN}|g" src/environments/environment.prod.ts && \
    sed -i "s|__FIREBASE_PROJECT_ID__|${FIREBASE_PROJECT_ID}|g" src/environments/environment.prod.ts

RUN npm run build -- --configuration production

# Stage 2: Serve the application from a lightweight server
FROM nginx:alpine

COPY --from=build /app/dist/rpr-verify /usr/share/nginx/html

EXPOSE 80
