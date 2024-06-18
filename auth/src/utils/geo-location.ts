const getPosition = function (options?: PositionOptions) {
	return new Promise(function (resolve, reject) {
		navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
};

export default getPosition;
