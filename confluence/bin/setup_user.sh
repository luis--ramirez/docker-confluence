#!/bin/bash

# creates a user and configures Confluence to execute with that user.
# must be run as root

. `dirname $0`/user.sh #readin the username

if [ -z "$CONF_USER" ]; then
        username="confluence"
else
        username=$CONF_USER
fi

usage()
{
cat << EOF
usage: $0 options

Creates a user and sets up the permissions.

OPTIONS:
   -h      Show this message
   -d      Confluence home directory
   -i      application install directory
   -u      uninstall
EOF
}

createUsernameSuffix()
{
if id confluence>/dev/null 2>&1
then
    : #echo user 'confluence' exists
else
    exit 0;
fi

for (( i=1; i<=25; i++ )); do
    if id confluence$i>/dev/null 2>&1
    then
        : #echo confluence$i exists
    else
        exit $i
    fi
done
}


confluence_home=
install_dir=
uninstall=0
while getopts "hd:i:us" OPTION
do
     case $OPTION in
         h)
             usage
             exit 0
             ;;
         d)
             confluence_home=$OPTARG
             ;;
         i)
             install_dir=$OPTARG
             ;;
         u)
             uninstall=1
             ;;
         s)
             createUsernameSuffix
             ;;
     esac
done
if [[ (-z "$confluence_home" || -z "$username" || -z "$install_dir") && $uninstall -eq 0 ]]
then
    usage
    exit 1
elif [[ -z "$username" && $uninstall -eq 1 ]]
then
    usage
    exit 1
fi

# ensure the given directory exists, and that it is private to the created user
set_dir_perms()
{
    mkdir -p "$1"
    chown -R "$username" "$1"
    chmod -R og-rwx "$1"
}

# useradd is in /usr/sbin in redhat
PATH=$PATH:/usr/sbin

if [[ $uninstall -eq 1 ]]
then
    userdel "$username"
else
    # create user
    useradd "$username" -c "Atlassian Confluence" -K UMASK=0077

    set_dir_perms "$confluence_home"
    set_dir_perms "$install_dir/work"
    set_dir_perms "$install_dir/temp"
    set_dir_perms "$install_dir/logs"
    chmod +x "$install_dir"/bin/*.sh
fi

