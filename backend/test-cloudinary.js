import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: 'dxaqd2cgh',
  api_key: '791684636136336',
  api_secret: 'MgUXHueE5p4_QDU8x40plMwXyVk',
});

cloudinary.uploader.upload('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=').then(console.log).catch(err => { console.error('Cloudinary Error Object:', err); });
