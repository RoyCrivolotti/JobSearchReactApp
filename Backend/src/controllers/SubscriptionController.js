async function listSubscriptions(req, res, next) {
	await fetch('google.com');
	throw new Error('Method not implemented.');
}

async function checkOut(req, res, next) {
	await fetch('google.com');
	throw new Error('Method not implemented.');
}

async function unsubscribe(req, res, next) {
	await fetch('google.com');
	throw new Error('Method not implemented.');
}

module.exports = {
	listSubscriptions,
	checkOut,
	unsubscribe,
};
