#!/bin/bash
#

# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")
echo $SCRIPTPATH
PROJECTROOTPATH="$(dirname "$SCRIPTPATH")"
echo $PROJECTROOTPATH

#pyenv install 3.7.9
pyenv local 3.7.9

python -m venv .venv

#make install-full

source ${SCRIPTPATH}/.venv/bin/activate
"${SCRIPTPATH}"/.venv/bin/pip3 install --upgrade setuptools pip

## upcoming issue with pip3 in Oct 2020
## Stick with rasa 1.10.14 -- using rasa2.0 wouldn't build in docker
"${SCRIPTPATH}"/.venv/bin/pip3 install rasa==2.0
#
## 30 Nov 2020 ConvERT model available from alternative source
## but not yet specified in pipeline (Jan 2021)
"${SCRIPTPATH}"/.venv/bin/pip3 install rasa[convert]

## As at Nov 2020 ConvERT model no longer available
"${SCRIPTPATH}"/.venv/bin/pip3 install rasa[spacy]
"${SCRIPTPATH}"/.venv/bin/python3 -m spacy download en_core_web_md
"${SCRIPTPATH}"/.venv/bin/python3 -m spacy link en_core_web_md en

#rasa data convert nlu -f yaml --data="${SCRIPTPATH}"/src/data --out="${SCRIPTPATH}"/src/data

cd "${SCRIPTPATH}"/src
#rasa train nlu --out /scratch/Alana2018/SPRING/main/spring-alana/rasa/saved_models
# by default, rasa will store latest trained model in sub-directory 'models'
rasa train nlu

