export default class EventEmitter {

    // constructor(parent, events) {
    //     if(parent)
    //         this.parentEventTarget = parent
    //     // this.initEvents(events)
    // }

    // initEvents(events = this) {
    //     for(const e in events) {
    //         if((typeof events[e] === 'function') && (/^on[A-Z]/).test(e))
    //             this.addEventListener(e.substring(2).toLowerCase(), events[e])
    //     }
    // }

    addEventListener(eventName, handler) {
        if(!this.hasOwnProperty('listeners'))
            this.listeners = {}
        if(!this.listeners.hasOwnProperty(eventName))
            this.listeners[eventName] = new Set()

        this.listeners[eventName].add(handler)
    }

    /*
      once(eventName, handler) {
        const onceFn = (...args) => {
          this.off(eventName, onceFn);
          handler.apply(self, args);
        }
        this.on(eventName, onceFn)
      }
    */

    dispatchEvent(event) {
        console.debug(`Event emitted ${event} on ${this}`)

        // TODO : Remove optionnal chaining
        this.listeners?.[event]?.forEach(handler => handler.call(this, event))
        // this.parentEventTarget?.dispatchEvent(event)
        return true
    }

    removeEventListener(eventName, handler) {
        if(this.hasOwnProperty('listeners')) {
            if(!eventName)
                delete this.listeners
            else if(!handler)
                delete this.listeners[eventName]
            else
                this.listeners[eventName]?.delete(handler);
        }
    }
}