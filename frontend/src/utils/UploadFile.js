// const url = `https://api.cloudinary.com/v1_1/process.env.CLOUDINARY_CLOUD_NAME/auto/upload`;
const url = "https://api.cloudinary.com/v1_1/dhrfkiikj/image/upload"


const Uploadfile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append("upload_preset", "BlogNest");

    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    
    const responseData = await response.json();
    console.log(responseData);
    
    return responseData;
};

export default Uploadfile;