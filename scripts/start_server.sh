#!/bin/bash
set -e

# Create a directory for the Node.js application
mkdir -p /home/ec2-user/imageServerApp
cd /home/ec2-user/imageServerApp

# Assuming Node.js and npm are already installed, install the npm packages
npm install

npm run start
