// async-thread-worker - https://github.com/w3reality/async-thread-worker
// async/await abstraction for Web Workers (MIT License)

class ThreadWorker {
    constructor(self, opts={}) {
        // https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/self
        this._worker = self;
        self.onmessage = e => this._onMessage(e);

        this.onCreate(opts);
    }
    onCreate(opts) {}

    _onMessage(e) {
        const { id, data } = e.data;
        this.onRequest(id, data);
    }

    // abstract
    onRequest(id, payload) {}

    _sendResponse(id, data, opts={}) {
        const defaults = {
            transferables: [],
            error: undefined,
        };
        const actual = Object.assign({}, defaults, opts);
        const error = actual.error;
        this._worker.postMessage({
            id: id,
            result: { data, error },
        }, actual.transferables.length > 0 ? actual.transferables : undefined);
    }
    sendResponse(id, payload=undefined, transferables=[]) {
        this._sendResponse(id, payload, { transferables });
    }
    sendError(id, error) {
        this._sendResponse(id, undefined, { error });
    }
}

class Thread {
    constructor(path) {
        const _worker = new Worker(path);
        this._worker = _worker;

        this._rrRequest = {};
        _worker.onmessage = (e) => {
            if (0 && e.data.debug) {
                console.log('debug:', e.data.debug);
                return;
            }

            const { id, result } = e.data;
            console.log('result for id:', id);

            const { data, error } = result;
            if (id in this._rrRequest) {
                const { res, rej } = this._rrRequest[id];
                delete this._rrRequest[id];
                error ? rej(error) : res(data);
            } else {
                console.log('nop; invalid request id:', id);
            }
        };
    }
    _sendRequest(data, opts={}) { // returns a Promise object
        const defaults = {
            transferables: [],
        };
        const actual = Object.assign({}, defaults, opts);
        return new Promise((res, rej) => {
            let id;
            do {
                id = `req-id-${Math.random()}`;
            } while (id in this._rrRequest);

            console.log('_sendRequest(): id:', id);
            this._rrRequest[id] = { res, rej };

            if (this._worker) {
                this._worker.postMessage({ id, data },
                    actual.transferables.length > 0 ? actual.transferables : undefined);
            } else {
                console.log('_sendRequest(): nop (worker already terminated?)');
            }
        });
    }
    sendRequest(payload=undefined, transferables=[]) {
        return this._sendRequest(payload, { transferables });
    }
    getWorker() {
        return this._worker;
    }
    terminate() {
        this._worker.terminate();
        this._worker = null;
    }
}

const AsyncThreadWorker = { ThreadWorker, Thread };
export default AsyncThreadWorker;