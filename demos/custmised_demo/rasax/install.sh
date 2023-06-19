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
#pyenv local 3.7.9
#
#python -m venv .venv

source ${SCRIPTPATH}/.venv/bin/activate
${SCRIPTPATH}/.venv/bin/pip3 install -r requirements.txt
