import Vue from 'vue'
import Vuex from 'vuex'
import { ToastPlugin } from 'bootstrap-vue'
import UserRoutes from '../actions/user'
import axios from 'axios'
Vue.use(ToastPlugin)
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id:'',
      email: '',
      username: '',
      bio: '',
      password: '',
      idAdmin:''
    },
    answer: {
      registration: [],
      login: []
    },

  },
  getters: {
    getUser(state) {
      return state.users
    },
    getApiAnswer(state) {
      return state.answer
    }
  },
  mutations: {
    saveUserData(state, [id, username, email, isAdmin]) {
        state.user.id = id,
        state.user.username = username,
        state.user.email = email,
        state.user.token = Vue.$cookies.get('user_session'),
        state.user.isAdmin = isAdmin
    },
    UPDATE_EMAIL_INPUT (state, email) {state.users.email = email},
    UPDATE_USERNAME_INPUT (state, username) {state.users.username = username},
    UPDATE_BIO_INPUT (state, bio) {state.users.bio = bio},
    UPDATE_PWD_INPUT (state, password) {state.users.password = password},
    REGISTER_USER (state, userInfo) {
      userInfo.id = state.user.id,
      userInfo.email = state.user.email,
      userInfo.username = state.user.username,
      userInfo.bio = state.user.bio,
      userInfo.password = state.user.password
    },
    REGISTER_ANSWER (state, apiAnswer) {
      state.answer.registration = apiAnswer
    },
    LOGIN_ANSWER (state, apiAnswer) {
      state.answer.login = apiAnswer
    },
    GET_PROFILE (state, profileAccess) {
      state.getProfile = profileAccess
    },
    UPDATE_USER (state, userUpdate) {
      state.userUpdate = userUpdate
    },
    DELETE_USER (state, userDestroy) {
      state.userDelete = userDestroy
    },
    GET_ALL_USERS (state, usersList) {
      state.usersList = usersList
    },
    GET_ALL_MESSAGES (state, messagesList) {
      state.messagesList = messagesList
    }
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
      let authorization = Vue.$cookies.get('user_session')
      axios
        .get("http://localhost:3000/api/users/profile/", {
          headers: {
            Authorization: "Bearer " + authorization.token
          }
        })
        .then(response => {
          context.commit('saveUserData', [
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