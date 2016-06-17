<?php

function LDAPauthenticate($user, $password) {
	$queryResult = array();

    $ldap = ldap_connect("ldap://directory.uoguelph.ca");
	ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);

    $ldaprdn = "uid=".$user.",ou=People,o=uoguelph.ca";
    if ($bind = ldap_bind($ldap, $ldaprdn, $password)) {
        // log them in!

        $sr = ldap_search($ldap, "ou=People,o=uoguelph.ca", "uid=".$user);
        $entry = ldap_get_entries($ldap, $sr);

        $queryResult[] = 0;
        $queryResult [] = $entry;

        //var_dump($entry);
    	
    	//renewTokenExpiryTime($user);
        renewTokenInfo($user);

    	ldap_unbind($ldap);
        return $queryResult;
    } else {
      //not authenticated
    	$queryResult[] = -1;
        return $queryResult;
    }
}
