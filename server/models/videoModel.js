// models/videoModel.js
const mongoose = require('mongoose');

// Helper function to extract YouTube video ID and generate embed URL
function extractYouTubeInfo(url) {
  if (!url) return { videoId: null, embedUrl: null, thumbnailUrl: null };
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/v\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      return {
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      };
    }
  }
  return { videoId: null, embedUrl: url, thumbnailUrl: null };
}

// ── Video schema for storing YouTube tutorial videos ──
const videoSchema = new mongoose.Schema({
  tutorial_id:       { type: Number, required: true, unique: true, index: true },
  tutorial_title:    { type: String, required: true },
  video_url:         { type: String, required: true },
  embed_url:         { type: String, default: null },
  duration_minutes:  { type: Number, default: 0 },
  thumbnail_url:     { type: String, default: null },
  description:       { type: String, default: '' },
  created_at:        { type: Date, default: Date.now },
  updated_at:        { type: Date, default: Date.now },
});

// Pre-save middleware to generate embed URL and thumbnail
videoSchema.pre('save', function(next) {
  const info = extractYouTubeInfo(this.video_url);
  if (info.embedUrl) {
    this.embed_url = info.embedUrl;
    this.thumbnail_url = info.thumbnailUrl;
  } else {
    this.embed_url = this.video_url;
  }
  this.updated_at = Date.now();
  next();
});

// Pre-update middleware
videoSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.video_url) {
    const info = extractYouTubeInfo(update.video_url);
    if (info.embedUrl) {
      update.embed_url = info.embedUrl;
      update.thumbnail_url = info.thumbnailUrl;
    } else {
      update.embed_url = update.video_url;
    }
    update.updated_at = Date.now();
  }
  next();
});

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };