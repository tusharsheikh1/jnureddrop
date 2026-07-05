// The APK is served from public/ so the website can offer it as a download,
// but it must not be bundled into the Android app's own web assets
// (the app would ship a copy of itself). Run between `vite build` and
// `cap sync android` when building the app.
const fs = require('fs');
const path = require('path');

const apk = path.join(__dirname, '..', 'dist', 'ReddropJNU.apk');
fs.rmSync(apk, { force: true });
console.log('Removed ReddropJNU.apk from dist (app build only)');
