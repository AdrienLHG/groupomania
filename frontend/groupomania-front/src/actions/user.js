import axios from 'axios'
import Vue from 'vue'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)

class UserRoutes {
    userRegister(userInfo) {
        return axios.post('http://localhost:3000/api/users/signup', userInfo)
        .catch((err) => {
            throw err
        })
    }
    userLogin(userLogInfo) {
        return axios.post('http://localhost:3000/api/users/login', userLogInfo)
        .then((response) => {
            console.log(response)
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("UserId", response.data.userId)
            Vue.$cookies.set('user_session', response.data, '1d')
        })
        .catch((err) => {
            throw err
        })
    }
}
export default new UserRoutes()