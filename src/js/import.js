import * as POUCHDB from '../node_modules/pouchdb/dist/pouchdb.min.js';

let dbReady = new Event('dbReady');
dbReady.initEvent('dbReady', true, true);