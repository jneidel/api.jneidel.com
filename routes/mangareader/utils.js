const data = require( "../../lib/mangareader/manipulate-data" );

function hasValidId( req, res, next ) {
  if ( req.query.id )
    req.body.id = req.query.id;

  // console.log( req.body );
  if ( !req.body.id ) return res.status( 400 ).json( { meta: { err: "Please include the 'id' parameter in your request." } } );

  if ( !data.userExists( req.body.id ) ) return res.status( 400 ).json( { meta: { err: "Please include a valid 'id' in your request." } } );

  return next();
}

function hasManga( req, res, next ) {
  if ( !req.body.manga ) return res.status( 400 ).json( { meta: { err: "Please include the 'manga' parameter in your request." } } );

  return next();
}

function hasChapter( req, res, next ) {
  if ( !req.body.chapter ) return res.status( 400 ).json( { meta: { err: "Please include the 'chapter' parameter in your request." } } );

  return next();
}

function hasProvider( req, res, next ) {
  if ( !req.body.provider ) return res.status( 400 ).json( { meta: { err: "Please include the 'provider' parameter in your request." } } );

  return next();
}

module.exports = {
  hasValidId,
  hasManga,
  hasChapter,
  hasProvider,
};
