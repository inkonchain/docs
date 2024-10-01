FROM node:20.11.0
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build
RUN adduser --system --uid 1001 docs-user
USER docs-user
EXPOSE 3000
CMD ["pnpm", "start"]
