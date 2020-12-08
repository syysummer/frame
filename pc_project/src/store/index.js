import Vue from 'vue'
import Vuex from 'vuex'

import State from './state'
import Actions from './actions'
import Mutations from './mutations'

Vue.use(Vuex);

export default new Vuex.Store({
    state: State,
    actions: Actions,
    mutations: Mutations
})