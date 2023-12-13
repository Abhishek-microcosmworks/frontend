import AWS from 'aws-sdk';
import path from 'path';
import fs from 'fs';
import axios from 'axios'; // You may need to install this package
import 'dotenv/config';
import { v4 } from 'uuid';

// Replace with your AWS S3 bucket name
const bucketName = process.env.AWS_BUCKET;

// Set your AWS credentials
const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
};

const s3 = new AWS.S3(awsConfig);

// Function to handle image uploads
export async function uploadImage(imageUrl) {
  try {
    if (!imageUrl) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const file_name = v4();
    const file_ext = 'png';
    // Extract the filename from the URL
    const fileName = `${file_name}.${file_ext}`;

    // Download the image locally with the SAS token
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'image/png' // Adjust content type based on the actual image type
      }
    });

    const fileBuffer = Buffer.from(response.data);

    // Upload the file to S3
    const params = {
      Bucket: bucketName,
      Key: `blog-ai-images/${fileName}`,
      Body: fileBuffer,
      ContentType: 'image/png', // You may need to adjust the content type based on the actual image type
      ACL: 'public-read' // Make the uploaded file public
    };

    const uploadResult = await s3.upload(params).promise();
    const s3Url = uploadResult.Location;

    // Now you have both the userId and the imageUrl
    return s3Url;
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
}