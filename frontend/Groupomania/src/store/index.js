import Vue from 'vue'
import Vuex from 'vuex'
import { ToastPlugin } from 'bootstrap-vue'
import UserRoutes from '../actions/user'
import axios from 'axios'
const jwt = require('jsonwebtoken');

Vue.use(ToastPlugin)
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: null,
      email: '',
      username: '',
      token: '',
      password: '',
      idAdmin:''
    },
    answer: {
      registration: [],
      login: []
    },

  },
  mutations: {
    SAVE_USER_DATA(state, [id, username, email, isAdmin]) {
        state.user.id = id,
        state.user.username = username,
        state.user.email = email,
        state.user.token = localStorage.getItem('token'),
        state.user.isAdmin = isAdmin
    },

    REGISTER_ANSWER (state, apiAnswer) {
      state.answer.registration = apiAnswer
    },
    LOGIN_ANSWER (state, apiAnswer) {
      state.answer.login = apiAnswer
    },

  },
  actions: {
    userRegister({commit}, userInfo) {
      return UserRoutes.userRegister(userInfo)
      .then((response) => {
        commit('REGISTER_ANSWER', response)
        return Promise.resolve(response)
      },
      (error) => {
        commit('REGISTER_ANSWER', error)
        return Promise.reject(error)
      })
    },
    userLogin({commit}, userLogInfo) {
      return UserRoutes.userLogin(userLogInfo)
      .then((response) => {
        commit('LOGIN_ANSWER', response)
        return Promise.resolve(response)
      },
      (error) => {
        commit('LOGIN_ANSWER', error)
        return Promise.reject(error)
      })
    },
    getUserData(context) {
      let authorization = localStorage.getItem("token")
      let token = localStorage.getItem("token")
      let decodedToken = jwt.verify(token, 'XyJ__L9_VU2qMq8E7r_d__428_JRz9_vv7Uz4wVX_V__5eqE__s6829_tzB' );
      let id = decodedToken.userId;      
      axios.get("http://localhost:3000/api/users/profile/" + id , {
          headers: {
            Authorization: "Bearer " + authorization
          }
        })
        .then(response => {
          console.log(response.data)
          context.commit('SAVE_USER_DATA', [
            response.data.id,
            response.data.username,
            response.data.email,
            response.data.isAdmin
          ])
        })
        .catch(error => {
          this.error = error.response.data.error;
        });
    }
  },
  modules: {
  }
})