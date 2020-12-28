import axios from 'axios'
import Vue from 'vue'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)

class UserRoutes {
    userRegister(userInfo) {
        return axios.post('users/signup', userInfo)
        .catch((err) => {
            throw err
        })
    }
    userLogin(userLogInfo) {
        return axios.post('users/login', userLogInfo)
        .then((response) => {
            //localStorage.setItem("token", response.data.token)
            Vue.$cookies.set('user_session', response.data, '1d')
        })
        .catch((err) => {
            throw err
        })
    }
}
export default new UserRoutes()