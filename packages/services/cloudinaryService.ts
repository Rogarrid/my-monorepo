import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  url: process.env.CLOUDINARY_URL,
});

/**
 * Uploads an image to Cloudinary.
 * @param imageUrl - The URL of the image to upload.
 * @param publicId - The public ID for the image (optional).
 * @returns The result of the upload.
 */
export const uploadImage = async (imageUrl: string, publicId?: string) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
    });
    return uploadResult;
  } catch (error) {
    throw new Error(`Error uploading the image`);
  }
};

/**
 * Generates the optimized URL for the image.
 * @param publicId - The public ID of the image.
 * @returns The optimized URL.
 */
export const getOptimizedImageUrl = (publicId: string) => {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
  });
};

/**
 * Generates the transformed URL for the image.
 * @param publicId - The public ID of the image.
 * @param width - The width to transform the image to.
 * @param height - The height to transform the image to.
 * @returns The transformed URL.
 */
export const getTransformedImageUrl = (
  publicId: string,
  width: number,
  height: number
) => {
  return cloudinary.url(publicId, {
    crop: "auto",
    gravity: "auto",
    width,
    height,
  });
};
