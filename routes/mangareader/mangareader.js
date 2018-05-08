const express = require( "express" );
const fs = require( "mz/fs" );
const path = require( "path" );
const uuid = require( "uuid/v4" );
const data = require( "../../lib/mangareader/manipulate-data" );
const has = require( "./has-param-middleware" );

const successMeta = id => ( { id, err: null } );

const router = express.Router();

data.checkFilesExist(); // One-time setup

router.post( "/create-id",
  ( req, res ) => {
    const id = uuid();
    data.addUser( id );

    return res.json( { meta: successMeta( id ) } );
  }
);

router.post( "/add-manga",
  has.validId,
  has.manga,
  has.provider,
  ( req, res ) => {
    const id = req.body.id;
    const manga = req.body.manga;
    const provider = req.body.provider;

    data.addManga( id, manga, provider );

    return res.json( { meta: successMeta( id ) } );
  },
);

router.post( "/remove-manga",
  has.validId,
  has.manga,
  has.provider,
  ( req, res ) => {
    const id = req.body.id;
    const manga = req.body.manga;
    const provider = req.body.provider;

    data.removeManga( id, manga, provider );

    return res.json( { meta: successMeta( id ) } );
  }
);

router.post( "/update-provider",
  has.validId,
  has.manga,
  has.provider,
  ( req, res ) => {
    const id = req.body.id;
    const manga = req.body.manga;
    const provider = req.body.provider;

    if ( !data.mangaExists( id, manga ) ) return res.status( 400 ).json( { meta: { id, err: "Manga hasnt been added yet. Please use /add-manga, before /update-provider" } } );
    if ( data.providerExists( id, manga, provider ) )
      return res.json( { meta: successMeta( id ) } );

    data.updateProvider( id, manga, provider );

    return res.json( { meta: successMeta( id ) } );
  }
);

router.post( "/updates",
  has.validId,
  has.mangaList,
  async ( req, res ) => {
    const id = req.body.id;
    const mangaList = req.body.mangaList;

    const response = await data.getUpdates( id, mangaList );

    if ( response.err ) return res.status( 400 ).json( { meta: { id, err: response.err }, data: null } );

    return res.json( { meta: successMeta( id ), data: response.data } );
  }
);

module.exports = router;

