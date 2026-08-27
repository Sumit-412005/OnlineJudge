# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies using the committed lockfile
COPY package*.json ./
RUN npm ci

# Build the production bundle. REACT_APP_API_URL is baked in at build time.
COPY . .
ARG REACT_APP_API_URL=http://localhost:4000
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# SPA fallback so client-side routes (e.g. /userDashboard) work on refresh
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
