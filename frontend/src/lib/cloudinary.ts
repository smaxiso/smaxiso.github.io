export const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = "dehpzaqrd"; // Your cloud name
    const uploadPreset = "smaxiso"; // Your unsigned preset

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "smaxiso_portfolio"); // Optional: organize in a folder

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, // Generic endpoint works for images & pdfs usually, but 'auto' is safer
            // actually better endpoint is /auto/upload to handle pdfs too
            {
                method: "POST",
                body: formData,
            }
        );

        // Fallback for PDF if image endpoint fails, or use 'auto' resource type
        if (!response.ok) {
            // Try 'auto' resource type which handles everything
            const responseAuto = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            if (!responseAuto.ok) throw new Error("Cloudinary upload failed");
            const data = await responseAuto.json();
            return data.secure_url;
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
};

// Helper to compress image
const compressImage = async (file: File): Promise<File> => {
    // Threshold: 1MB. If smaller, return original
    if (file.size <= 1024 * 1024) return file;

    // Only compress images
    if (!file.type.startsWith('image/')) return file;

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Max dimension: 1920px
            const MAX_DIM = 1920;
            if (width > MAX_DIM || height > MAX_DIM) {
                if (width > height) {
                    height = Math.round((height * MAX_DIM) / width);
                    width = MAX_DIM;
                } else {
                    width = Math.round((width * MAX_DIM) / height);
                    height = MAX_DIM;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(file); // Fail safe
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Compress to JPEG with 0.8 quality
            canvas.toBlob((blob) => {
                if (!blob) {
                    resolve(file);
                    return;
                }
                // Convert blob to File
                const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                });

                // If compressed is somehow larger (rare), use original
                if (compressedFile.size > file.size) {
                    resolve(file);
                } else {
                    resolve(compressedFile);
                }

                URL.revokeObjectURL(img.src);
            }, 'image/jpeg', 0.8);
        };
        img.onerror = (err) => {
            console.error("Compression error:", err);
            resolve(file); // Fail safe
        };
    });
};

// Simplified version using 'auto' resource type directly (cleaner)
export const uploadFile = async (file: File): Promise<string> => {
    const cloudName = "dehpzaqrd";
    const uploadPreset = "smaxiso";

    // Compress before upload
    const fileToUpload = await compressImage(file);

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("upload_preset", uploadPreset);

    // Use 'auto' to support images, pdfs, raw files
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Upload failed");
    }

    const data = await res.json();
    return data.secure_url;
}

// Specifically for PDFs/Docs to treat them as raw downloadable files
export const uploadRaw = async (file: File): Promise<string> => {
    const cloudName = "dehpzaqrd";
    const uploadPreset = "smaxiso";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    // Force 'raw' resource type
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
        method: "POST",
        body: formData
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Upload failed");
    }

    const data = await res.json();
    return data.secure_url;
}
