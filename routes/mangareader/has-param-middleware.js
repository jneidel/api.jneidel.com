const data = require( "../../lib/mangareader/manipulate-data" );

function validId( req, res, next ) {
  if ( !req.body.id ) return res.status( 400 ).json( { meta: { err: "Please include the 'id' parameter in your request." } } );

  if ( !data.userExists( req.body.id ) ) return res.status( 400 ).json( { meta: { err: "Please include a valid 'id' in your request." } } );

  return next();
}

function manga( req, res, next ) {
  if ( !req.body.manga ) return res.status( 400 ).json( { meta: { err: "Please include the 'manga' parameter in your request." } } );

  return next();
}

function provider( req, res, next ) {
  if ( !req.body.provider ) return res.status( 400 ).json( { meta: { err: "Please include the 'provider' parameter in your request." } } );

  return next();
}

function mangaList( req, res, next ) {
  if ( !req.body.mangaList ) return res.status( 400 ).json( { meta: { err: "Please include the 'mangaList' parameter in your request." } } );

  for ( const manga of req.body.mangaList ) {
    if ( !manga.name ) return res.status( 400 ).json( { meta: { err: "Please include a 'name' in each object of 'mangaList' (refer to the documentation for a schema of 'mangaList')." } } );
    if ( !manga.provider ) return res.status( 400 ).json( { meta: { err: "Please include a 'provider' in each object of 'mangaList' (refer to the documentation for a schema of 'mangaList')." } } );
    if ( !manga.chapter ) return res.status( 400 ).json( { meta: { err: "Please include a 'chapter' in each object of 'mangaList' (refer to the documentation for a schema of 'mangaList')." } } );
  }

  return next();
}

module.exports = {
  validId,
  manga,
  provider,
  mangaList,
};
