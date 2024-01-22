export const environment = {
    production: true,
    endpoint: 'https://ctfitalia.cloud/',
    googleMapsApiKey: process.env['GOOGLE_MAPS_KEY'],
    spacesEndpoint: process.env['DIGITAL_OCEAN_ENDPOINT'],
    accessKeyId: process.env['DIGITAL_OCEAN_KEY_ID'],
    secretAccessKey: process.env['DIGITAL_OCEAN_ACCESS_KEY'],
    bucketName: process.env['DIGITAL_OCEAN_BUCKET'],
    adminEmails: ['avila@ctfitalia.com', 'avirrueta@ctfitalia.con', ''],
    operatorPhoneNumber: '+393343129952', //Operator Help desk
};
