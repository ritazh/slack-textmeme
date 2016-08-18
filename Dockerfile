# TODO: parameterize node.js version from "engines" in package.json
FROM node

WORKDIR /src
ADD . .

EXPOSE 5000
RUN npm install
CMD ["node", "app.js"]