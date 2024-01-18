export const environment = {
    production: false,
    endpoint: 'http://localhost:3000/',
    googleMapsApiKey: process.env['GOOGLE_MAPS_KEY'],
    spacesEndpoint: process.env['DIGITAL_OCEAN_ENDPOINT'],
    accessKeyId: process.env['DIGITAL_OCEAN_KEY_ID'],
    secretAccessKey: process.env['DIGITAL_OCEAN_ACCESS_KEY'],
    bucketName: process.env['DIGITAL_OCEAN_BUCKET'],
    adminEmails: ['avila@ctfitalia.com'],
    operatorPhoneNumber: '+393343129952', //Operator Help desk
};
