import fs from 'fs';
import mime from 'mime-types';

const moveFile = (from: string, to: string) => {
	try {
		fs.renameSync(from, to);
		return true;
	} catch (err) {
		return false;
	}
};
const deleteFile = (path: string) => {
	try {
		fs.unlinkSync(path);
	} catch (err) {
		/* empty */
	}
};
const exists = (path: string) => {
	return fs.existsSync(path);
};

const base64removeHeader = (base64: string) => {
	return base64
		.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')
		.replace(/^data:application\/pdf;base64,/, '');
};

const base64ToPDF = async (base64: string, path: string) => {
	const base64Data = base64removeHeader(base64);
	fs.writeFileSync(path, base64Data, 'base64');
};

const base64ToJPG = async (base64: string, path: string) => {
	const base64Data = base64removeHeader(base64);
	fs.writeFileSync(path, base64Data, 'base64');
};

async function readFile(path: string) {
	return new Promise<string>((resolve, reject) => {
		fs.readFile(path, 'utf8', function (err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

async function generateJSONFile(path: string, data: any) {
	return new Promise<void>((resolve, reject) => {
		fs.writeFile(path, JSON.stringify(data), 'utf8', function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

function getMimeType(path: string) {
	return mime.lookup(path);
}
function getExt(mime_type: string) {
	return mime.extension(mime_type);
}
function createFile({
	base_path,
	file_name,
	data,
	mime_type,
}: {
	base_path: string;
	file_name: string;
	data: string;
	mime_type: string;
}) {
	const path = `${base_path}/${file_name}.${getExt(mime_type)}`;
	fs.writeFileSync(path, data, 'base64');
	return path;
}

export default {
	moveFile,
	deleteFile,
	exists,
	base64ToJPG,
	base64ToPDF,
	readFile,
	generateJSONFile,
	getMimeType,
	getExt,
	createFile,
};
