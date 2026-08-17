<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** Database username */
define( 'DB_USER', 'wordpress' );

/** Database password */
define( 'DB_PASSWORD', 'OpalWPDB12!@' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'LABJ9G%a@grFv{?+OHXSKpt&*FIr]_k~rsig`ZH-:K>3l>nUnWOtD$Sr:20cA$ls');
define('SECURE_AUTH_KEY',  'z,#=<+G7MJM<+.+|WF^.h<+l14Jsb|~t{|z:t9Qw-D>+3+pElld`NhHbB5-af!W^');
define('LOGGED_IN_KEY',    '#jH3,X.LCL#{/czoeaBw*z(G-+|.7XA~npV1MuL5H$ZHh-|g8Ly~Y|IoZ+s4hx4G');
define('NONCE_KEY',        'ibOfEUT{0=&Hv|~v0`.;mu;T-[agfyb.{,.Z =qv:q=:L6gEKpIe**nHXPB85Qqc');
define('AUTH_SALT',        'Fez>8b|#qy)Lz?S]rb~$}=oae6oZe[1qKRmVa-1#53Y[&` 49}:!{t3v w0_$oi}');
define('SECURE_AUTH_SALT', 't-3z[+1-EH:*.+:MY48;Db`;]#]@s`C_[:>.{?Bej`eRru-#}C`5#J+pu>!YOMA}');
define('LOGGED_IN_SALT',   '9dTXT*SH5.-!/>3[3-}tRD3c>$HH-xd6Ooq-QV=+HeUXW|79p4Cy9.l5:tkQ>!>1');
define('NONCE_SALT',       '-E;GwPqU,)Y7HFC?X.8N~2/4QRoN<nVE/ob.4||h`s{$w(-pUL^M$(tp,T@(g (t');

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
