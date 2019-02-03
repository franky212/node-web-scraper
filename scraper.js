const rp = require( 'request-promise' );
const $ = require( 'cheerio' );
const fs = require( 'fs' );
const https = require( 'https' );
const path = require( 'path' );

// URL of website you want to scrape
const options = {
    uri: '',
    rejectUnauthorized: false
};

rp( options )
    .then( function ( html ) {
        const images = $( '.image > img', html );
        const imgUrls = [];

        //console.log( images.length );

        for ( let i = 0; i < images.length; i++ ) {
            imgUrls.push( {
                url: images[i].attribs.src,
                filename: images[i].attribs.alt.replace( /\s+/g, '_' ).toLowerCase()
            } );
            downloadImages( imgUrls[i] );
        }
    } )
    .catch( function ( err ) {
        console.log( err );
    } );

function downloadImages ( {url, filename} ) {

    const file = fs.createWriteStream( `assets/${filename}` );
    https.get( `${url}`, ( resp ) => {
        resp.pipe( file );
    } );

    file.on( 'finish', () => {
        file.close();
    } ).on( 'error', ( err ) => {
        console.log( err );
    } );
}