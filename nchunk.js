"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "nchunk",
			"path": "nchunk/nchunk.js",
			"file": "nchunk.js",
			"module": "nchunk",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/nchunk.git",
			"test": "nchunk-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Pre-configure CommonsChunkPlugin of Webpack based on name.
	@end-module-documentation

	@include:
		{
			"detr": "detr",
			"leveld": "leveld",
			"plough": "plough",
			"pyck": "pyck",
			"rgxv": "rgxv",
			"webpack": "webpack"
		}
	@end-include
*/

const detr = require( "detr" );
const leveld = require( "leveld" );
const plough = require( "plough" );
const pyck = require( "pyck" );
const rgxv = require( "rgxv" );
const webpack = require( "webpack" );

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

const NODE_MODULES_PATTERN = /node_modules/;
const BOWER_COMPONENTS_PATTERN = /bower_components/;

const nchunk = function nchunk( name, option ){
	/*;
		@meta-configuration:
			{
				"name:required": [
					"[string]",
					"string",
					"..."
				],
				"option": "object"
			}
		@end-meta-configuration
	*/

	let parameter = plough( arguments );

	name = pyck( parameter, STRING );

	option = detr( parameter, {
		"base": "dependency",
		"extension": "support.js",
		"dependencyDirectory": [ ]
	} );

	return leveld( [
		new CommonsChunkPlugin( {
			"name": option.base,
			"filename": `${ option.base }.${ option.extension }`,
			"minChunks": ( module ) => {
				let context = module.context;

				return [ NODE_MODULES_PATTERN, BOWER_COMPONENTS_PATTERN ]
					.concat( option.dependencyDirectory )
					.some( ( directory ) => rgxv( directory, context ) );
			}
		} ),

		name.map( ( list ) => {
			let [ name, ...dependency ] = list.split( /\s*\,\s*/ );

			return new CommonsChunkPlugin( {
				"name": `${ option.base }-${ name }`,
				"filename": `${ option.base }-${ name }.${ option.extension }`,
				"chunks": [ option.base ].concat( dependency.map( ( dependency ) => {
					return `${ option.base }-${ dependency }`;
				} ) ),
				"minChunks": ( ( module ) => rgxv( name, module.context ) )
			} )
		} ),

		new CommonsChunkPlugin( {
			"name": "manifest",
			"filename": `manifest.${ option.extension }`,
			"minChunks": Infinity
		} )
	] );
};

module.exports = nchunk;
