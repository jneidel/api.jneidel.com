const express = require( "express" );
const fs = require( "mz/fs" );
const path = require( "path" );
const bodyParser = require( "body-parser" );

require( "dotenv" ).config( { path: "vars.env" } );

const port = process.env.PORT;
const app = express();

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

app.use( "/errors", require( "./routes/errors" ) );

app.use( "/", ( req, res ) => res.sendFile( path.resolve( __dirname, "index.html" ) ) );

app.listen( port, () => {
  console.log( `Server running on port ${port}.` ); // eslint-disable-line no-console
} );

process.on( "unhandledRejection", ( err ) => { throw err; } );
