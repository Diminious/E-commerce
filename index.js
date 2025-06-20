import express  from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
// import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import './strategies/local-strategy.js'; // Import local strategy for Passport.js
import connectPgSimple from 'connect-pg-simple';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;
const pgStore = connectPgSimple(session);

//loads document swagger.yml
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
const swaggerDocument = yaml.load(fs.readFileSync(path.resolve(__dirname, './swagger.yml'), 'utf8'));

const swaggerDefinition = {
    info: {
        title: "Node Swagger API",
        version: "1.0.0",
        description: "How to use the E-Commerce RESTful API"
    },
    host: "localhost:3000",
    basePath: "/"
}

const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: {
        servers: [
            {
                url: 'http://localhost:3000/'
            }
        ],
        info: {
            title: "E-Commerce API Documentation",
            version: "0.9.0",
            description: "Simple E-Commerce API application made with Express and PostgreSQL."
        }
    },
    apis: ['./routes/*.js']
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
// bodyParser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(express.json());
app.use(session({
    secret: 'secret-key',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hour in milliseconds
    }
}))
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(routes);

app.get('/', (req, res) => {
    req.session.visited = true;
    res.send(`Welcome to the E-commerce server: ${req.sessionID}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});