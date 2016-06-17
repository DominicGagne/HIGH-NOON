<?php


function validateAuthenticationToken() {
    $validUserObject = getSingleArgument("validUserObject");

    if(validateToken($validUserObject->UserEmail, $validUserObject->Token) == 0) {
        return 0;
    } else {
        return -1;
    }
}

//YOU SHOULD ONLY OPEN THE CONNECTION TO THE DATABASE ONCE.
//WHY DO IT MULTIPLE TIMES?  PASS THE CONNECTION BETWEEN FUNCTIONS.


//validateAuthenticationToken
//validateToken
//


function validateToken($emailLogin, $userToken) {
    $sql = "SELECT `Token`,`TokenExpiry` FROM Users WHERE UserEmail = '$emailLogin'";
    
    $conn = databaseLogin();
    $retval = performQuery($sql, $conn);

    $data = mysqli_fetch_array($retval, MYSQL_NUM);
    
    $databaseToken = $data[0];
    $databaseExpiryTime = $data[1];

    if(strcmp($userToken, $databaseToken) == 0) {
        if(time() < intval($databaseExpiryTime)) {
            //token is valid.
            return 0;
        } else {
            echo "token good, time not.";
            return -2;
        }
    } else {
        echo "bad token.";
        return -1;
    }
}


function renewTokenExpiryTime($emailLogin) {
    //set ten minute expiry time for token
    $newExpiry = time() + 2000;

    $sql = "UPDATE Users SET `TokenExpiry` = '$newExpiry' WHERE `UserEmail` = '$emailLogin'";

    $conn = databaseLogin();

    $retval = $conn->query($sql);

    $conn->close();
}



function renewTokenInfo($emailLogin) {
    //remove this 'getsingleargument', this function should only ever be called from local
    //theres a few more like this, do your homework

    $newToken = createToken();
    //ten minute expiry for tokens
    $newExpiry = time() + 600;

    $sql = "UPDATE Users SET `Token` = '$newToken', `TokenExpiry` = '$newExpiry' WHERE `UserEmail` = '$emailLogin'";
    $conn = databaseLogin();
    $retval = performQuery($sql, $conn);

    if($requestFromLocal == 1) {
        echo $newToken;
    } else {
        return $newToken;
    }
}

 

function getTokenExpiryTime() {
    $emailLogin = getSingleArgument("emailLogin");
    $sql = "SELECT Token, TokenExpiry FROM Users WHERE UserEmail = '$emailLogin'";

    $conn = databaseLogin();
    $retval = $conn->query($sql);

    echo json_encode(mysqli_fetch_array($retval, MYSQL_NUM));
}



function createToken() {
    return bin2hex(openssl_random_pseudo_bytes(16));
}





