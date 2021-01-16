#!/bin/bash

source .data


script=$(basename ${0%.sh})
cmd=${script%_*}
what=${script#*_}
#echo "cmd=$cmd  what=$what"

case $what in
    all) SUBDIR="";; 
    *) exit 1;;
esac

REMOTEFOLDER="webapps/bt/$SUBDIR"
LOCALFOLDER="$(pwd)/../build/$SUBDIR"
#MIRROR_OPTS="--parallel=10 --verbose --use-cache --only-newer"
#MIRROR_OPTS="--parallel=10 --verbose --use-cache --continue --delete"
MIRROR_OPTS="--parallel=10 --verbose --use-cache --only-newer --delete "

case $cmd in
    upload) MIRROR_ARGS="--reverse $LOCALFOLDER $REMOTEFOLDER";;
    download) MIRROR_ARGS="$REMOTEFOLDER $LOCALFOLDER";;
    *) exit 2;;
esac

lftp_cmd="
open $HOST
set ssl:verify-certificate no
user $USER $PASS
lcd $LOCALFOLDER
mirror $MIRROR_OPTS $MIRROR_ARGS
bye
"

lftp -f "$lftp_cmd"
exit 1
