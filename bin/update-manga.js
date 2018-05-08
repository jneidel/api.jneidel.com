#!/usr/bin/env node

const { updateLastChapter, openJson } = require( "../lib/mangareader/manipulate-data" );

/**
 * Update all manga in latest.json
 * Indended to be frequently run as cron job
 */

async function updateLatestManga() {
  const latest = openJson( "latest" );

  const mangareader = Object.keys( latest.get( "mangareader" ) );
  const readmng = Object.keys( latest.get( "readmng" ) );

  await mangareader.forEach( manga => updateLastChapter( manga, "mangareader" ) );
  await readmng.forEach( manga => updateLastChapter( manga, "readmng" ) );
}

updateLatestManga();

module.exports = updateLatestManga;
