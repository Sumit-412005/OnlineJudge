# Node 20 LTS on Alpine keeps the image small
FROM node:20-alpine

WORKDIR /backend

# Compilers / runtimes needed to execute user submissions (C++, Python, Java).
# build-base pulls g++ plus the musl/libc headers required to actually compile.
RUN apk add --no-cache build-base python3 openjdk17
ENV JAVA_HOME=/usr/lib/jvm/default-jvm
ENV PATH="$JAVA_HOME/bin:$PATH"

# Install dependencies first (better build caching). Uses the committed lockfile.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the source (.env and generated dirs are excluded via .dockerignore)
COPY . .

# Run as an unprivileged user – submitted code should NOT execute as root
RUN addgroup -S judge && adduser -S judge -G judge \
    && mkdir -p codes outputs testcases \
    && chown -R judge:judge /backend
USER judge

EXPOSE 4000

# Production start (node), not nodemon
CMD ["npm", "start"]
