const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadAudio = (filename, bucketname, file) => {

    return new Promise((resolve, reject) => {
        const params = {
            Key: filename,
            Bucket: bucketname,
            Body: file,
            ContentType: 'audio/mpeg', //mp3 used to be mpeg
            ACL: 'public-read'
        }

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data.Location)
            }
        });
    });
}

module.exports = uploadAudio