// Change this to your repository name
var GHPATH = '/ValleyOfMasks';
 
// Choose a different app prefix name
var APP_PREFIX = 'vom_';
 
// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…). 
// If you don't change the version, the service worker will give your
// users the old files!
var VERSION = 'version_00';
 
// The files to make available for offline use. make sure to add 
// others to this list
var URLS = [    
  `${GHPATH}/`,
  `${GHPATH}/Default.html`,
  `${GHPATH}/lib/main.js`,
  `${GHPATH}/lib/models.js`,
  `${GHPATH}/lib/support.js`,
  `${GHPATH}/lib/three/models.js`,
  `${GHPATH}/lib/three/support.js`,
  `${GHPATH}/lib/three/three.js`,
  `${GHPATH}/lib/content/default.png`
]
