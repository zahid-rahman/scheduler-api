import express from 'express';
import { UserRoutes } from '../modules/users/user.route.js';
const router = express.Router();
const routes = [
    {
        path: '/users',
        route: UserRoutes
    }
]

routes.forEach(route => router.use(route.path, route.route))
export default router;