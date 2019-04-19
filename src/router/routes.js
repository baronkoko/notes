export default [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "index" */ '@/views/notes/Index.vue')
  },
  {
    path: '/create',
    name: 'create',
    component: () => import(/* webpackChunkName: "create" */ '@/views/notes/Create.vue')
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: () => import(/* webpackChunkName: "edit" */ '@/views/notes/Edit.vue')
  },
  {
    path: '/note/:id',
    name: 'show',
    component: () => import(/* webpackChunkName: "show" */ '@/views/notes/Show.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '@/views/settings/Index.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error/404.vue')
  },
  {
    path: '*',
    redirect: '404'
  }
]
