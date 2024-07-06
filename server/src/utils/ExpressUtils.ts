import crypto from 'crypto';
import { Request, Response } from 'express';
import fs from 'fs';
import { Types } from 'mongoose';
import { z } from 'zod';
import { IS_PRODUCTION } from '../config/const';
import { IDType } from '../types';
import DateUtils from './DateUtils';

type ResponseData = {
	res: Response;
	status: 200 | 201 | 400 | 401 | 403 | 404 | 500;
	data?: object;
};
type CSVResponseData = Omit<ResponseData, 'status' | 'data'> & {
	filename: string;
	data: string;
};
type FileResponseData = Omit<ResponseData, 'status' | 'data'> & {
	filename: string;
	filepath: string;
};

export const Respond = ({ res, status, data = {} }: ResponseData) => {
	if (status === 200 || status === 201) {
		return res.status(status).json({ ...data, success: true });
	}
	return res.status(status).json({ ...data, success: false });
};

export const RespondCSV = ({ res, filename, data }: CSVResponseData) => {
	res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
	res.set('Content-Type', 'text/csv');
	res.status(200).send(data);
};

export const RespondFile = ({ res, filename, filepath }: FileResponseData) => {
	const stat = fs.statSync(filepath);
	res.set('content-length', stat.size.toString());
	res.set('content-disposition', `attachment; filename="${filename}"`);
	res.status(200).sendFile(filepath);
};

export const Delay = async (seconds: number) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(null);
		}, seconds * 1000);
	});
};

export const parseAmount = (amount: number) => {
	return Number(amount.toFixed(2));
};

export const setCookie = (
	res: Response,
	{ key, expires, value }: { key: string; value: string; expires: number }
) => {
	res.cookie(key, value, {
		sameSite: 'strict',
		expires: new Date(Date.now() + expires),
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
	});
};

export const getRequestIP = (req: Request) => {
	return (req.headers['x-real-ip'] ?? req.socket.remoteAddress)?.toString();
};

export function generateRandomID() {
	return crypto.randomUUID();
}

export function generateNewPassword() {
	return crypto.randomBytes(4).toString('hex');
}

export function generateInvoiceID(id: string) {
	// 23-24/Saas/000001
	const moment_now = DateUtils.getMomentNow();

	const startYear = moment_now.month() >= 3 ? moment_now.year() : moment_now.year() - 1;
	const year = startYear.toString().slice(2) + '-' + (startYear + 1).toString().slice(2);

	let invoice_id = year;
	invoice_id += '/Saas/';
	invoice_id += id
		.substring(id.length > 6 ? id.length - 6 : 0)
		.toString()
		.padStart(8, '0');
	return invoice_id;
}

type IDValidatorResult = [true, IDType] | [false, undefined];
export function idValidator(id: string): IDValidatorResult {
	const validator = z
		.string()
		.refine((value) => Types.ObjectId.isValid(value))
		.transform((value) => new Types.ObjectId(value));

	const result = validator.safeParse(id);
	if (result.success === false) {
		return [false, undefined];
	} else {
		return [true, result.data];
	}
}

export function getRandomNumber(min: number, max: number) {
	return min + Math.random() * (max - min);
}

export function validatePhoneNumber(num: string) {
	var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

	return re.test(num);
}

export function filterUndefinedKeys<T extends object>(opt: T): T {
	const entries = Object.entries(opt);
	const filteredEntries = entries.filter(([key, value]) => value !== undefined);
	const filteredOpt = Object.fromEntries(filteredEntries);
	return filteredOpt as T;
}

export function intersection<T>(arr1: T[], arr2: T[]) {
	const set = new Set(arr2.map((e) => String(e)));

	// Use the built-in Set method `has` to check for common elements
	const res = arr1.map((e) => String(e)).filter((item) => set.has(String(item)));
	return [...new Set(res)];
}
