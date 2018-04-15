function hasId( req, res, next ) {
  if ( req.query.id ) return res.status( 400 ).send( "Usage of query parameters is no longer supported." );

  // console.log( req.body );
  if ( !req.body.id ) return res.status( 400 ).json( { meta: { err: "Please include the 'id' parameter in your request." } } );

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

module.exports = {
  hasId,
  hasManga,
  hasChapter,
};
