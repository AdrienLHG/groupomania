import axios from 'axios'
import Vue from 'vue'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)

class UserRoutes {
    userRegister(userInfo) {
        return axios.post('http://localhost:3000/api/user/signup', userInfo)
        .catch((err) => {
            throw err
        })
    }
    userLogin(userLogInfo) {
        return axios.post('http://localhost:3000/api/users/login', userLogInfo)
        .then((response) => {
            Vue.$cookies.set('user_session', response.data, '1d')
        })
        .catch((err) => {
            throw err
        })
    }
    getUserLogin(urlId) {
        let authorization = Vue.$cookies.get('user_session')
        return axios.get('http://localhost:3000/api/auth/account/'+ urlId, { headers: {'Authorization' : 'Bearer ' + authorization.token}} )
        .catch((err) => {
            throw err
        })
    }
    updateUser(payload) {
        console.log(payload[0])
        console.log(payload[1])
        let authorization = Vue.$cookies.get('user_session')
        return axios.put('http://localhost:3000/api/auth/account/' + payload[0], payload[1], { headers: {'Authorization' : 'Bearer ' + authorization.token}} )
          .catch((err) => {
            throw err
          })
    }
    deleteUser(urlId) {
        let authorization = Vue.$cookies.get('user_session')
        return axios.delete('http://localhost:3000/api/auth/account/' + urlId, {headers: {'Authorization' : 'Bearer ' + authorization.token}} )
        .catch((err) => {
            throw err
        })
    }
    getAllUsers() {
        let authorization = Vue.$cookies.get('user_session')
        return axios.get('http://localhost:3000/api/auth/', {headers: {'Authorization' : 'Bearer ' + authorization.token}} )
        .catch((err) => {
            throw err
        })
    }
}
export default new UserRoutes()