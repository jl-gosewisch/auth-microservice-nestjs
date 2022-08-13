FROM node:18 AS builder

# Create auth directory
WORKDIR /auth

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:18

COPY --from=builder /auth/node_modules ./node_modules
COPY --from=builder /auth/package*.json ./
COPY --from=builder /auth/dist ./dist

EXPOSE 3000
CMD [  "npm", "run", "start:migrate:prod" ]
