import multer from "multer";

const storage = multer.memoryStorage(); // keep file in memory as buffer

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for videos
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only images (JPEG/PNG/WEBP) and videos (MP4/WEBM) are allowed."));
        }
    },
});

export default upload;