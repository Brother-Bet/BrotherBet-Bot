# Use the official image as a parent image.
FROM juloko/futsal

# Set the working directory.
WORKDIR /usr/src/

# Run the command inside your image filesystem.
RUN echo headless | sudo -S git clone https://github.com/Brother-Bet/Bot.git app

WORKDIR /usr/src/app/

RUN echo headless | sudo -S yarn

RUN echo headless | sudo -S yarn global add pm2

RUN echo headless | sudo -S apt-get install xvfb

RUN echo headless | sudo -S chmod +x /usr/src/app/*

RUN echo headless | sudo -S mkdir archive

RUN echo headless | sudo -S rm -rf ~/.config/google-chrome/Singleton*

EXPOSE 3333 6901

# RUN  bash /usr/src/app/scripts/openCloseChromeHidden.sh & echo headless | sudo -S node src/server.js

# RUN yarn serve

# CMD [ "yarn", "serve" ]
