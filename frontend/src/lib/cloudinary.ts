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

// Simplified version using 'auto' resource type directly (cleaner)
export const uploadFile = async (file: File): Promise<string> => {
    const cloudName = "dehpzaqrd";
    const uploadPreset = "smaxiso";

    const formData = new FormData();
    formData.append("file", file);
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
