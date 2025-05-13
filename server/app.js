const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

const petRouter = require('./routes/petRoutes');
const donationRouter = require('./routes/donationRoutes');
const strayAnimalReportRouter = require('./routes/strayAnimalReportRoutes')
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const app = express();

dotenv.config({ path: './config.env' }); // <- connecting the enviroment variables
// MIDLEWARES ->>
app.enable('trust proxy');

console.log('REMOTE: ', process.env.REMOTE);

const allowedOrigins = [process.env.REMOTE, 'http://localhost:3000'];   //have made changes here

app.use(cors({                                                
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.options('*', cors());// i have made changes here 


console.log((`ENV = ${process.env.NODE_ENV}`));
app.use(morgan('dev')); // <- Logs res status code and time taken

const limiter = rateLimit({	// <- Limits the number of api calls that can be made per IP address
	max: 1000, // max number of times per windowMS
	windowMs: 60 * 60 * 1000,
	message:
        '!!! Too many requests from this IP, Please try again in 1 hour !!!',
});

app.use('/api/v1', limiter);

app.use((req, res, next) => {	// <- Serves req time and cookies
	
	req.requestTime = new Date().toISOString();
	console.log(`[${req.method}] ${req.originalUrl} at ${req.requestTime}`);//i have made changes onit 
	if (req.cookies) console.log(req.cookies);
	next();
});

app.use((req, res, next) => {
	res.setHeader('Content-Type', 'application/json');
	next();
});

app.use(express.json({ limit: '100mb' })); // <- Parses Json data
app.use(express.urlencoded({ extended: true, limit: '100mb' })); // <- Parses URLencoded data

app.use(mongoSanitize()); // <- Data Sanitization aganist NoSQL query Injection.
app.use(xss()); // <- Data Sanitization against xss

app.use(compression());

// routs for images
app.use('/api/v1/AnimalReportImage',express.static('public/Images/RportedAnimals'))

app.use('/api/v1/pet', petRouter); // <- Calling the router
app.use('/api/v1/donation', donationRouter);
app.use('/api/v1/reportAnimal', strayAnimalReportRouter);

app.all('*', (req, res, next) => {	// <- Middleware to handle Non-existing Routes
	next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(errorController); // <- Error Handling Middleware

module.exports = app;
