import Vue from 'vue'
import Router from 'vue-router'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import Home from './pages/Home'
import ICPC from './pages/Icpc'
import Support from './pages/Support'
import Article from './pages/Article'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/',
      component: Home
    },
    {
      name: 'Chat',
      path: '/chat',
      component: Chat,
      beforeEnter: (to, from, next) => {
        if(!firebase.auth().currentUser) {
          next('/login')
        } else {
          next()
        }
      }
    },
    {
      path: '/icpc',
      component: ICPC
    },
    {
      path: '/support',
      component: Support
    },
    {
      name: 'Article',
      path: '/article/:id',
      component: Article
    }
  ]
})
