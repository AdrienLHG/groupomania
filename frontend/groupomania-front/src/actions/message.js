import axios from 'axios'
import Vue from 'vue'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)

class MessageRoutes {
    getAllMessages() {
        let authorization = Vue.$cookies.get('user_session')
        return axios.get('http://localhost:3000/api/', {headers: {'Authorization' : 'Bearer ' + authorization.token}} )
        .catch((err) => {
            throw err
        })
    }
}


export default new MessageRoutes()