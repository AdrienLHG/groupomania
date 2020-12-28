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
    getProfile: '',
    userUpdate: {},
    userDelete: '',
    usersList: [],
    messagesList: [],
    websiteName: "Groupomania",
    // eslint-disable-next-line no-useless-escape
    regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  getters: {
    copyright: (state) => {
			const currentYear = new Date().getFullYear()

			return `© Copyright ${currentYear} : ${state.websiteName}`
    },
    emailValidation(state) {
      return state.regex.test(state.users.email)
    },
    usernameValidation(state) {
      return state.users.username.length > 4 && state.users.username.length < 13
    },
    passwordValidation(state) {
      return state.users.password.length > 4
    },
    getUser(state) {
      return state.users
    },
    getApiAnswer(state) {
      return state.answer
    }
  },
  mutations: {
    saveUserData(state, [id, username, email, moderator]) {
      state.user.id = id,
        state.user.username = username,
        state.user.email = email,
        state.user.token = Vue.$cookies.get('user_session'),
        state.user.moderator = moderator
    },
    UPDATE_EMAIL_INPUT (state, email) {state.users.email = email},
    UPDATE_USERNAME_INPUT (state, username) {state.users.username = username},
    UPDATE_BIO_INPUT (state, bio) {state.users.bio = bio},
    UPDATE_PWD_INPUT (state, password) {state.users.password = password},
    REGISTER_USER (state, userInfo) {
      userInfo.email = state.users.email,
      userInfo.username = state.users.username,
      userInfo.bio = state.users.bio,
      userInfo.password = state.users.password
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
      .then((userLogInfo) => {
        console.log(userLogInfo)
        commit('LOGIN_ANSWER', userLogInfo)
        return Promise.resolve(userLogInfo)
      },
      (error) => {
        commit('LOGIN_ANSWER', error)
        return Promise.reject(error)
      })
    },
    getUserData(context) {
      let authorization = Vue.$cookies.get('user_session')
      axios
        .get("users/profile/", {
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