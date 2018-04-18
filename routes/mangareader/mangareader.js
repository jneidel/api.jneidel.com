const express = require( "express" );
const fs = require( "mz/fs" );
const path = require( "path" );
const uuid = require( "uuid/v4" );
const data = require( "../../lib/mangareader/manipulate-data" );
const utils = require( "./utils" );

const router = express.Router();

data.checkFilesExist(); // One-time setup

router.post( "/create-id",
  ( req, res ) => {
    const id = uuid();
    data.addUser( id );

    return res.json( {
      meta: { id, err: null },
    } );
  }
);

router.post( "/add-manga",
  utils.hasValidId,
  utils.hasManga,
  utils.hasProvider,
  utils.hasChapter,
  ( req, res ) => {
    const id = req.body.id;
    const manga = req.body.manga;
    const provider = req.body.provider;
    const chapter = req.body.chapter;

    data.addManga( id, manga, provider, chapter );

    return res.json( {
      meta: { id, err: null },
    } );
  },
);

router.post( "/remove-manga",
  utils.hasValidId,
  utils.hasManga,
  utils.hasProvider,
  ( req, res ) => {
    const id = req.body.id;
    const manga = req.body.manga;
    const provider = req.body.provider;

    data.removeManga( id, manga, provider );

    return res.json( {
      meta: { id, err: null },
    } );
  }
);

router.post( "/update-manga",
  utils.hasValidId,
  utils.hasManga,
  utils.hasProvider,
  utils.hasChapter,
  ( req, res ) => {
    const id = req.body.id;
    const manga = req.body.manga;
    const provider = req.body.provider;
    const chapter = req.body.chapter;

    if ( !data.mangaExists( id, manga ) ) return res.status( 400 ).json( { meta: { id, err: "Manga hasnt been added yet. Please use /add-manga, before /update-manga" } } );
    // providerExists check, add new/remove old

    data.setUserChapter( id, manga, provider, chapter );

    return res.json( {
      meta: { id, err: null },
    } );
  }
);

router.post( "/updates",
  utils.hasValidId,
  utils.hasMangaList,
  async ( req, res ) => {
    const id = req.body.id;
    const mangaList = req.body.mangaList;

    const response = await data.getUpdates( id, mangaList );

    if ( response.err ) return res.status( 400 ).json( { meta: { id, err: response.err }, data: null } );

    return res.json( { meta: { id, err: null }, data: response.data } );
  }
);

module.exports = router;

