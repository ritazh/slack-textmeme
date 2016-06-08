#!/bin/bash
git init
git config user.name "Travis CI"
git config user.email "ritazh@microsoft.com"

echo 'Adding files to local repo'
ls -ltr
git add .
git commit -m "Deploy"
openssl aes-256-cbc -d -k password -in deis.enc -out deis.key -a

cat ./deis.key

# deis login http://deis.deisdemo.40.78.99.3.xip.io
# send "deis\r"
# send "deis\r"
# deis apps

# write the trusted host to the known hosts file
# to avoid a prompt when connecting to it via ssh
DEIS_HOST="[deis.deisdemo.40.78.99.3.xip.io]:2222,[40.78.99.3]:2222"
DEIS_VM="40.78.99.3"
echo $DEIS_HOST > ~/.ssh/known_hosts
cat ~/.ssh/known_hosts

GIT_TARGET_URL="ssh://git@deis.deisdemo.40.78.99.3.xip.io:2222/zydeco-gatepost.git "

eval "$(ssh-agent -s)"
ssh-agent -s

chmod 600 ./deis.key
ssh-add ./deis.key

echo 'Private keys added. Starting Deis Deployment'
git remote add deis $GIT_TARGET_URL
send "yes\r"

git push -f deis master

echo 'Deployed Latest Version to Deis'