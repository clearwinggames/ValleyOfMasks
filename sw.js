// Change this to your repository name
var GHPATH = '/ValleyOfMasks';

var IGFPATH = '/ValleyOfMasks/lib/ghtml/igf';
 
// Choose a different app prefix name
var APP_PREFIX = 'vom_';
 
// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…). 
// If you don't change the version, the service worker will give your
// users the old files!
var VERSION = 'version_0_0_0_1';
 
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
  `${GHPATH}/lib/content/default.png`,
 
  `${IGFPATH}/dirt32.png`,
  `${IGFPATH}/grass32.png`,
  `${IGFPATH}/ivanGreatForest.192.dirt32.png`,
  `${IGFPATH}/ivanGreatForest.192.grass32.png`,
  `${IGFPATH}/ivanGreatForest.192.ivanGreatForest192_cc_testStairs0.png`,
  `${IGFPATH}/ivanGreatForest.192.ivanGreatForest192_cc_testStairsDown0.png`,
  `${IGFPATH}/ivanGreatForest.192.ivanGreatForest192_cc_tile60.png`,
  `${IGFPATH}/ivanGreatForest.192.stone32.png`,
  `${IGFPATH}/ivanGreatForest.192.stoneWall32.png`,
  `${IGFPATH}/ivanGreatForest.192.water1.png`,
  `${IGFPATH}/ivanGreatForest.192.water10.png`,
  `${IGFPATH}/ivanGreatForest.192.water11.png`,
  `${IGFPATH}/ivanGreatForest.192.water12.png`,
  `${IGFPATH}/ivanGreatForest.192.water14.png`,
  `${IGFPATH}/ivanGreatForest.192.water15.png`,
  `${IGFPATH}/ivanGreatForest.192.water13.png`,
  `${IGFPATH}/ivanGreatForest.192.water2.png`,
  `${IGFPATH}/ivanGreatForest.192.water3.png`,  
  `${IGFPATH}/ivanGreatForest.192.water4.png`,
  `${IGFPATH}/ivanGreatForest.192.water5.png`,
  `${IGFPATH}/ivanGreatForest.192.water6.png`,
  `${IGFPATH}/ivanGreatForest.192.water7.png`,
  `${IGFPATH}/ivanGreatForest.192.water8.png`,
  `${IGFPATH}/ivanGreatForest.192.water9.png`,
  `${IGFPATH}/ivanGreatForest.205.htm`,
  `${IGFPATH}/ivanGreatForest.205.html`,
  `${IGFPATH}/ivanGreatForest.205.xmlr`,
  `${IGFPATH}/ivanGreatForest205_cc_testStairs0.png`,
  `${IGFPATH}/ivanGreatForest205_cc_testStairsDown0.png`,
  `${IGFPATH}/ivanGreatForest205_cc_tile60.png`,
  `${IGFPATH}/stone32.png`,
  `${IGFPATH}/stoneWall32.png`,
  `${IGFPATH}/water1.png`,
  `${IGFPATH}/water10.png`,
  `${IGFPATH}/water11.png`,
  `${IGFPATH}/water12.png`,
  `${IGFPATH}/water13.png`,
 `${IGFPATH}/water14.png`,
  `${IGFPATH}/water15.png`,
  `${IGFPATH}/water2.png`,
  `${IGFPATH}/water3.png`,
  `${IGFPATH}/water4.png`,
  `${IGFPATH}/water5.png`,
  `${IGFPATH}/water6.png`,
  `${IGFPATH}/water7.png`,
  `${IGFPATH}/water8.png`,
  `${IGFPATH}/water9.png`,

]



