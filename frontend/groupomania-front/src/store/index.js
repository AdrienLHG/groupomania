import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: null,
      username: '',
      email: '',
      token: '',
      moderator: ''
    }
  },

  mutations: {
    saveUserData(state, [id, username, email, moderator]) {
      state.user.id = id,
        state.user.username = username,
        state.user.email = email,
        state.user.token = localStorage.getItem('token'),
        state.user.moderator = moderator
    }
  },

  actions: {
    getUserData(context) {
      axios
        .get("http://localhost:3000/api/profile", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(response => {
          context.commit('saveUserData', [
            response.data.id,
            response.data.username,
            response.data.email,
            response.data.moderator
          ])
        })
        .catch(error => {
          this.error = error.response.data.error;
        });
    }
  }
})