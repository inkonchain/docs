FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
RUN adduser --system --uid 1001 docs-user
USER docs-user
EXPOSE 3000
CMD ["pnpm", "start"]
