export const environment = {
    production: true,
    endpoint: 'https://www.ctfitalia.cloud/',
    googleMapsApiKey: process.env['GOOGLE_MAPS_KEY'],
    spacesEndpoint: process.env['DIGITAL_OCEAN_ENDPOINT'], 
    accessKeyId: process.env['DIGITAL_OCEAN_KEY_ID'],
    secretAccessKey: process.env['DIGITAL_OCEAN_ACCESS_KEY'],
    bucketName:  process.env['DIGITAL_OCEAN_BUCKET'],
};
