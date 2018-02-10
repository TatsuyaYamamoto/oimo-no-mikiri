abstract class EventEmitter {
    private _callbacks: { [eventType: string]: Function[] } = {};

    public on(eventType: string, callback) {
        this._callbacks[eventType] = this._callbacks[eventType] || [];
        this._callbacks[eventType].push(callback);
    }

    public off(eventType: string, callback?) {
        if (!this._callbacks[eventType]) {
            return;
        }

        if (callback) {
            const targetIndex = this._callbacks[eventType].findIndex((registered) => registered === callback);
            this._callbacks[eventType].slice(targetIndex, 1);
        } else {
            delete this._callbacks[eventType];
        }
    }

    public dispatch(eventType: string, params?: any) {
        if (!this._callbacks[eventType]) {
            return;
        }

        this._callbacks[eventType].forEach(function (callback) {
            callback(params);
        })
    }
}

export default EventEmitter;
