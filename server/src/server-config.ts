import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import useragent from 'express-useragent';
import fs from 'fs';
import routes from './modules';

import Logger from 'n23-logger';
import { IS_PRODUCTION, IS_WINDOWS, Path } from './config/const';
import { CustomError, ERRORS } from './errors';
import { RespondFile } from './utils/ExpressUtils';

const allowlist = [
	'http://localhost:5173',
	'http://localhost:3000',
	'https://keethjewels.com',
	'https://www.keethjewels.com',
	'https://admin.keethjewels.com',
];

const corsOptionsDelegate = (req: any, callback: any) => {
	let corsOptions;
	let isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;

	if (isDomainAllowed) {
		// Enable CORS for this request
		corsOptions = {
			origin: true,
			credentials: true,
			exposedHeaders: ['Content-Disposition'],
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
			optionsSuccessStatus: 204,
		};
	} else {
		// Disable CORS for this request
		corsOptions = { origin: false };
	}
	callback(null, corsOptions);
};

export default function (app: Express) {
	//Defines all global variables and constants
	let basedir = __dirname;
	basedir = basedir.slice(0, basedir.lastIndexOf(IS_WINDOWS ? '\\' : '/'));
	if (IS_PRODUCTION) {
		basedir = basedir.slice(0, basedir.lastIndexOf(IS_WINDOWS ? '\\' : '/'));
	}
	global.__basedir = basedir;

	//Initialize all the middleware
	app.use(cookieParser());
	app.use(useragent.express());
	app.use(express.urlencoded({ extended: true, limit: '2048mb' }));
	app.use(express.json({ limit: '2048mb' }));
	app.use(cors(corsOptionsDelegate));
	app.use(express.static(__basedir + 'static'));

	app.route('/api-status').get((req, res) => {
		res.status(200).json({
			success: true,
		});
	});

	app.use((req: Request, res: Response, next: NextFunction) => {
		req.locals = {
			...req.locals,
		};
		res.locals = {
			...res.locals,
		};
		const { headers, body, url } = req;

		Logger.http(url, {
			type: 'request',
			headers,
			body,
		});
		next();
	});

	app.use(routes);

	app.route('/media/:path/:filename').get((req, res, next) => {
		try {
			const path = __basedir + '/static/' + req.params.path + '/' + req.params.filename;
			return RespondFile({
				res,
				filename: req.params.filename,
				filepath: path,
			});
		} catch (err: unknown) {
			return next(new CustomError(ERRORS.NOT_FOUND));
		}
	});

	app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		if (err instanceof CustomError) {
			if (err.status === 500) {
				Logger.http(res.locals.url, {
					type: 'response-error',
					status: 500,
					response: err.error || err,
					headers: req.headers,
					body: req.body,
				});
			}

			return res.status(err.status).json({
				success: false,
				status: 'error',
				title: err.title,
				message: err.message,
			});
		}

		Logger.error(`Internal Server Error`, err, {
			type: 'error',
			request_id: res.locals.request_id,
		});
		res.status(500).json({
			success: false,
			status: 'error',
			title: 'Internal Server Error',
			message: err.message,
		});
		next();
	});

	createDir();
}

function createDir() {
	fs.mkdirSync(__basedir + Path.Misc, { recursive: true });
}
