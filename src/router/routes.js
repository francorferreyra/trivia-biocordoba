const routes = [{
    path: '',
    component: () =>
        import('src/layouts/MainLayout.vue'),
    children: [
        {
            path: '',
            component: () =>
                import('pages/Index.vue')
        }, {
            path: '/login',
            component: () =>
                import('src/pages/preguntas/Login.vue')
        },
        {
        path: '/game',
        component: () =>
            import('src/pages/AuthSession.vue'),  
        children: [
        {
            path: '/game/searchroom',
            component: () =>
                import('src/pages/preguntas/SearchGame.vue')
        }, {
            path: '/game/waitingroom',
            component: () =>
                import('pages/preguntas/WaitingRoom.vue')
        },  {
            path: '/game/gamepreguntas',
            component: () =>
                import('pages/preguntas/Game.vue')
        }, {
            path: '/game/finalpreguntas',
            component: () =>
                import('pages/preguntas/Final.vue')
        },
        ]
    },
    {
        path: '/register',
        component: () =>
            import('src/pages/preguntas/Register.vue')
    }, {
        path: '/gameunir',
        component: () =>
            import('pages/unir/Game.vue')
    }, {
        path: '/finalunir',
        component: () =>
            import('pages/unir/Final.vue')
    }, {
        path: '/sorteo',
        component: () =>
            import('pages/sorteo/SorteoIndex.vue')
    }, {
        path: '/ranking',
        component: () =>
            import('pages/preguntas/Ranking.vue')
    }
]
},
{
    path: '/:catchAll(.*)*',
    component: () =>
        import('pages/Error404.vue')
}
]

export default routes