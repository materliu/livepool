USER=$(./auth/Authenticate.app/Contents/MacOS/Authenticate -get username)
PASS=$(./auth/Authenticate.app/Contents/MacOS/Authenticate -get password)

function setProxy(){
    echo $PASS | sudo -S sh -c "networksetup -setwebproxy WI-FI 127.0.0.1 $2"
    echo $PASS | sudo -S sh -c "networksetup -setsecurewebproxy WI-FI 127.0.0.1 $2"

    echo $PASS | sudo -S sh -c "networksetup -setwebproxystate WI-FI on"
    echo $PASS | sudo -S sh -c "networksetup -setsecurewebproxystate WI-FI on"
}

function initProxy(){
    echo $PASS | sudo -S sh -c "networksetup -setwebproxystate WI-FI off"
    echo $PASS | sudo -S sh -c "networksetup -setsecurewebproxystate WI-FI off"
}

function run(){
    if [ $1 = 'on' ]; then
        setProxy $*
    else
        initProxy $*
    fi
}

if [ -n $USER ] || [ -n $PASS ]; then
    ./auth/Authenticate.app/Contents/MacOS/Authenticate
    USER=$(./auth/Authenticate.app/Contents/MacOS/Authenticate -get username)
    PASS=$(./auth/Authenticate.app/Contents/MacOS/Authenticate -get password)
fi

run $*

