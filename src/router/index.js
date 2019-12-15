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
import AdminTable from '../components/AdminTable.vue'
import SingleDetail from '../views/detail.vue'


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
      {path: 'table', name: 'Table', component: Table},
      {path: 'dialog', name: 'Tialog', component: Dialog},
      {path: 'crud', name: 'Crud', component: CrudTable},
      {path: 'detail', name: 'Detail', component: JoinDialog},
      {path: 'join', name: 'Join', component: JoinList },
      {path: 'admin', name: 'Admin', component: AdminTable },
      {path: 'qr', name: 'QR', component: SingleDetail},
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
