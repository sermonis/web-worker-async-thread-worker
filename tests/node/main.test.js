const path = require('path');

const libName = 'async-thread-worker';
const outDir = path.join(__dirname, '../../target');
const modPath = `${outDir}/${libName}.min.js`;
// const modPath = `${outDir}/${libName}.js`; // dev
const Mod = require(modPath);

test('load', () => {
    expect(Mod.hasOwnProperty('Thread')).toBe(true);
    expect(Mod.hasOwnProperty('ThreadWorker')).toBe(true);
});

// Skip if v10.x which requires `--experimental-worker` for 'worker_threads'
if (process.version > 'v12.') {
    const test00 = () => {}; // just for easy toggling on/off tests

    // kludge: make sure `global.require` inside `Mod` is available
    global.require = require;

    test('raw ping', async () => {
        const contents = `
const { parentPort } = require('worker_threads');
parentPort.once('message', msg => parentPort.postMessage({ pong: msg }));
        `;
        const { Worker } = require('worker_threads');
        const wk = new Worker(contents, { eval: true });
        const ping = () => new Promise((res, rej) => {
            wk.on('message', msg => res(msg));
            wk.postMessage('ping');
        });

        const msg = await ping();
        wk.terminate();

        expect(msg['pong']).toBe('ping');
    });

    //

    test('simple', async () => {
        const contents = `
const { parentPort } = require('worker_threads');
Object.assign(global, { parentPort });
const Mod = require('${modPath}');

class MyThreadWorker extends Mod.ThreadWorker {
    onRequest(id, payload) { // impl
        // throw [id, payload]; // debug
        this.sendResponse(id, payload.toUpperCase());
    }
}
const _thw = new MyThreadWorker(this, { isNode: true });
// throw [typeof _thw]; // debug
        `;

        const th = new Mod.Thread(contents, {
            isNode: true,
            optsNode: { eval: true }, // https://nodejs.org/api/worker_threads.html#worker_threads_new_worker_filename_options
        });

        const result = [];
        for (let payload of ['a', 'b', 'c', 'd']) {
            result.push(await th.sendRequest(payload));
        }

        // !! Do call this BEFORE any `expect()`s, or the test could hang !!
        th.terminate();

        expect(result.toString()).toBe('A,B,C,D');
    });

    //

    test00('-', async () => {
    });
    test00('-', async () => {
    });
}