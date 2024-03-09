#!/bin/bash
set -e

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Change to the directory where the code is located
cd /var/www/html

# Assuming Node.js and npm are already installed, install the npm packages
npm install

~/.nvm/versions/node/v20.11.1/bin/pm2 start npm --name "image scanner server" -- start
