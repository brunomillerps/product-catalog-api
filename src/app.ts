import express from 'express';
import * as http from 'http';
import helmet from 'helmet';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors'

import CommonRoutesConfig from './framework/routes/common.routes';
import ListAllProductRoutes from './framework/routes/all-products.routes';
import RateLimiterMiddleware from './framework/middleware/rate-limiter-inmemory';

import debug from 'debug';
import { errorHandler } from './framework/middleware/exceptions/error.middleware';
import { notFoundHandler } from './framework/middleware/exceptions/not-found.middleware';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 3000;
const routes: Array<CommonRoutesConfig> = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(new RateLimiterMiddleware().handle)
// app.use(errorHandler)
// app.use(notFoundHandler)

//automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

/**
 * Application Routes configuration
 */
routes.push(new ListAllProductRoutes(app));

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server running at http://localhost:${port}`)
});
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    routes.forEach((route: CommonRoutesConfig) => {
        console.log(`Routes configured for ${route.getName()}`);
    });
});