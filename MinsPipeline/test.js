// import * as _MP from './test2.js';

// _MP.AlertT();

var _MP;
async function tLoad() {
    alert("load!");
    _MP = await import('./test2');
    _MP.AlertT();
}

