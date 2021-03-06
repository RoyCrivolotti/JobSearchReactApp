const path = require('path');
const fs = require('fs');

const firestoreBackupService = require('firestore-export-import');
const serviceAccount = require('../src/database/serviceAccountKey.json');

// Initiate Firebase App
firestoreBackupService.initializeApp(serviceAccount, `https://${serviceAccount.project_id}.firebaseio.com`);

// Start exporting your data
const exportFirestore = async () => {
	await firestoreBackupService.backups()
		.then(collections => {
			// console.log(JSON.stringify(collections));

			const data = JSON.stringify(collections, null, 4);
			fs.writeFileSync(path.resolve(__dirname, 'collections.json'), data);
		});
};

// JSON To Firestore
const importFirestore = async () => {
	try {
		console.log('Initialzing Firebase');
		await firestoreBackupService.initializeApp(serviceAccount, process.env.DATABASE_URL);
		console.log('Firebase Initialized');

		const backupData = fs.readFileSync(path.resolve(__dirname, 'collections.json'));

		// Start importing your data
		await firestoreBackupService.restore(JSON.parse(backupData));

		// await firestoreBackupService.restore('collections.json');
		console.log('Upload Success');
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	exportFirestore,
	importFirestore,
};
