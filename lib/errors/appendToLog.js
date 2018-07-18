const fs = require( "mz/fs" );
const path = require( "path" );

const logDir = path.resolve( __dirname, "..", "..", "errors" );

const appendToLog = async ( name, error ) => fs.appendFile( path.resolve( logDir, `${name}.log` ), `${JSON.stringify( error, null, 2 )}\n` );

module.exports = appendToLog;

