FROM node:16.4.2-alpine3.14
RUN addgroup app && adduser -S -G app app
WORKDIR /home/app
RUN mkdir data
COPY package*.json .
RUN npm install
USER app
COPY . .
ENV REACT_APP_API_URL=http://localhost:4000
EXPOSE 3000
CMD [ "npm", "start" ]




