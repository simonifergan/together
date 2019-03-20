import axios from 'axios';

export default {
    uploadImage,
}

const CLOUD_NAME = 'dcv2jyqvl';

async function uploadImage(file) {
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const UPLOAD_PRESET = 'user_imgs';
    let formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    try {
        const {data} = await axios.post(UPLOAD_URL, formData);
        return data.url;
    } catch {
        throw ('Image upload failed, please try again.');
    }

}