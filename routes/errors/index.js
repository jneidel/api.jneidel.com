const express = require( "express" );
const fs = require( "mz/fs" );
const path = require( "path" );
const IncomingError = require( "../../models/errors/Error" );
const appendToLog = require("../../lib/errors/appendToLog")

const router = express.Router();

router.post( "/submit", ( req, res ) => {
  const error = IncomingError( req.body );

  // Filter out those that aren't in data/errors/ids
  if ( error.app.name !== "Missing app.name" ) {
    appendToLog( error.app.name, error ) 
  }

  res.status( 200 ).json( { success: "true" } );
} );

module.exports = router;

