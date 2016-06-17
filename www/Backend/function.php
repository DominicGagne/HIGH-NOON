<?php

include_once "ldapAuth.php";
include_once "token.php";


header("Content-type: application/jason");

define('HOST', 'localhost');
define('USER', 'DominicGagne');
define('PASS', 'quixotic3405');
define('DBNAME', 'TwentyFiveHundred');


if(function_exists($_GET['f'])) {     
    // get function name and parameter  
    $_GET['f']($_GET["p"]); 
} 
else { 
    //invalid request
    echo -5;
    errorHandler();
} 


