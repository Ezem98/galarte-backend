import { v2 as cloudinary } from 'cloudinary'

export class CloudinaryModel {
    static async uploadImage(imageUrl: string, publicName: string) {
        // Configuration
        const c = cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.SECRET,
        })

        // Upload an image
        const uploadResult = await c.uploader
            .upload(imageUrl, {
                public_id: publicName,
            })
            .catch((error: any) => {
                console.log(error)
            })

        console.log(uploadResult)
        return uploadResult.secure_url
    }
}
