
const assert = require( "assert" );
const nchunk = require( "./nchunk.js" );

assert.equal( nchunk( "react", "mjml" ).length, 4, "should be equal to 4" );

console.log( "ok" );
