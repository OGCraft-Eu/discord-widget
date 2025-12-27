FROM oven/bun:latest

WORKDIR /app/next-app

COPY bun.lock ./
COPY package.json ./

RUN bun install

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN bun next build

CMD ["bun", "next", "start"]