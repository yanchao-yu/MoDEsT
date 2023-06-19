#!/bin/bash
FLASK_APP=http_bot_2.py flask run --host=0.0.0.0

#!/bin/bash
#

# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")
echo $SCRIPTPATH

SCRIPTPATH_DM=${SCRIPTPATH_DM:-${SCRIPTPATH}/src}
echo $SCRIPTPATH_DM

export PYTHONPATH=$PYTHONPATH:"${SCRIPTPATH_DM}"
export PYTHONPATH=$PYTHONPATH:"${SCRIPTPATH_DM}/nlu"

source ${SCRIPTPATH}/.venv/bin/activate
${SCRIPTPATH}/.venv/bin/python  ${SCRIPTPATH_DM}/bot.py