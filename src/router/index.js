import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Table from '../views/Table.vue'
import Dialog from '../components/Dialog.vue'
import CrudTable from '../components/CrudTable.vue'
import JoinDialog from '../components/JoinDialog.vue'
import JoinList from '../components/JoinableTable.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {path: 'table', name: 'table', component: Table},
      {path: 'dialog', name: 'dialog', component: Dialog},
      {path: 'crud', name: 'admin', component: CrudTable},
      {path: 'detail', name: 'detail', component: JoinDialog},
      {path: 'join', name: 'join', component: JoinList }
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
