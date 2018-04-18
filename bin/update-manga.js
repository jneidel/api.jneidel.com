#!/usr/bin/env node

const { updateLastChapter, openJson } = require( "../lib/mangareader/manipulate-data" );

/**
 * Update all manga in latest.json
 * Indended to be frequently run as cron job
 */

function updateLatestManga() {
  const latest = openJson( "latest" );

  const mangareader = Object.keys( latest.get( "mangareader" ) );
  const readmng = Object.keys( latest.get( "readmng" ) );

  mangareader.forEach( manga => updateLastChapter( manga, "mangareader" ) );
  readmng.forEach( manga => updateLastChapter( manga, "readmng" ) );
}

updateLatestManga();

module.exports = updateLatestManga;
