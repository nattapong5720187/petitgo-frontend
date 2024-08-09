import Vue from 'vue'
import VueRouter from 'vue-router'
import ImportExcel from '../views/ImportExcel.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'importExcel',
    component: ImportExcel
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
