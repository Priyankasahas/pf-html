class Profarmer {
    constructor() {
        this.items = {};
        this.silo = null;

        // send CSRF tokens for all ajax requests
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
            }
        });
    }

    components() {
        return this.items;
    }

    set currentSilo(silo) {
        this.silo = silo;
    }

    get currentSilo() {
        return this.silo;
    }
}

export default new Profarmer();
