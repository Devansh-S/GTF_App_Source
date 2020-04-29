import { extendObservable } from 'mobx';

/* USER STORE */

class UserStore {
    constructor() {
        extendObservable(this, {

            loading: true,
            isLoggedIn: false,
            username: ''
        })
    }
}

export default new UserStore();