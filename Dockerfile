# TODO: parameterize node.js version from "engines" in package.json
FROM node:latest

WORKDIR .
ADD . .

EXPOSE 5000
CMD ["node", "app.js"]