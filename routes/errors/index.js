const express = require( "express" );
const fs = require( "mz/fs" );
const path = require( "path" );
const IncomingError = require("../../models/errors/Error");

const router = express.Router();

router.post( "/submit", ( req, res)=>{
  const error = IncomingError(req.body)

  res.status(200).json({"success":"true"})
})

module.exports = router;

