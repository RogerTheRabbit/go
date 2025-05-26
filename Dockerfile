FROM node:latest

# Force check for changes so know when to rebuild
ADD "https://api.github.com/repos/RogerTheRabbit/go/commits?per_page=1" latest_commit
RUN rm ./latest_commit

RUN git clone https://github.com/RogerTheRabbit/go.git /src
WORKDIR /src
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]
