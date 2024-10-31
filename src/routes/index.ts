import heathCheckHandler from "../controllers/healthcheck";

function appRouter(appRouter: any) {
    appRouter.get('/healthcheck', heathCheckHandler);
}

export default appRouter;