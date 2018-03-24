const express = require( "express" );
const fs = require( "mz/fs" );
const path = require( "path" );

require( "dotenv" ).config( { path: "vars.env" } );

const port = process.env.PORT;
const app = express();

app.use( "/mangareader", require( "./routes/mangareader" ) );

app.use( "/", ( req, res ) => res.sendFile( path.resolve( __dirname, "index.html" ) ) );

app.listen( port, () => {
  console.log( `Server running on port ${port}.` ); // eslint-disable-line no-console
} );

