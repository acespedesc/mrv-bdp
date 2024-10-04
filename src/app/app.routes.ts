import { Routes } from '@angular/router';

export const routes: Routes = [
    

    {
        path: 'pagina-ini',
        loadComponent: () => import('./pages/pagina-ini/pagina-ini.component'),
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component'),
    },
    {
        path: 'layout',
        loadComponent: () => import('./components/layout/layout.component'),
        children:[
            {
                path:'body',
                loadComponent: () => import('./components/body/body.component')
            },
            {
                path:'usuario',
                loadComponent: () => import('./pages/usuario/usuario.component')
            },
            {
                path:'caedec',
                loadComponent: () => import('./pages/caedec/caedec.component')
            },
            {
                path:'subcategoria',
                loadComponent: () => import('./pages/subcategoria/subcategoria.component')
            },
            {
                path:'inicio-datos',
                loadComponent: () => import('./pages/inicio-datos/inicio-datos.component')
            },
            {
                path:'regiones-instalacion',
                loadComponent: () => import('./pages/regiones-instalacion/regiones-instalacion.component')
            },
            {
                path:'linea-base',
                loadComponent: () => import('./pages/linea-base/linea-base.component')
            },
            {
                path:'precio-factor-tasa',
                loadComponent: () => import('./pages/precio-factor-tasa/precio-factor-tasa.component')
            },
            {
                path:'region',
                loadComponent: () => import('./pages/region/region.component')
            },
            {
                path:'eco-circular',
                loadComponent: () => import('./pages/eco-circular/eco-circular.component')
            },
            {
                path:'residuo',
                loadComponent: () => import('./pages/residuo/residuo.component')
            },
            {
                path:'',
                redirectTo:'body',
                pathMatch:'full'
            }
        ]
    },
    
    
    { path: '', redirectTo: 'pagina-ini', pathMatch: 'full' },
    { path: '**', redirectTo: 'pagina-ini', pathMatch: 'full' },
];
