#!/bin/bash
set -e

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


# Create a directory for the Node.js application
mkdir -p /home/ec2-user/passports-service
cd /home/ec2-user/passports-service

# Assuming Node.js and npm are already installed, install the npm packages
npm install

npm run start
