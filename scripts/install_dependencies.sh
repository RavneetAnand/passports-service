#!/bin/bash

# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load nvm
source ~/.bashrc

# Install the latest LTS version of Node.js
nvm install --lts

# Test that Node.js is installed and running correctly by typing the following at the command line.
node -e "console.log('Running Node.js ' + process.version)"

# Install the pm2
npm install pm2 -g