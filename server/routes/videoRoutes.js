// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const { Video } = require('../models/videoModel');

// Helper function to extract YouTube embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  
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
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&iv_load_policy=3`;
    }
  }
  return url;
};

// ─────────────────────────────────────────────────────────────
// GET /api/videos/tutorial/:tutorialId
// Get video for a specific tutorial
// ─────────────────────────────────────────────────────────────
router.get('/tutorial/:tutorialId', async (req, res) => {
  const { tutorialId } = req.params;

  try {
    const video = await Video.findOne({ tutorial_id: parseInt(tutorialId) });
    
    if (!video) {
      return res.status(404).json({ 
        success: false, 
        error: 'No video found for this tutorial' 
      });
    }

    // Generate embed_url if not present
    const embedUrl = video.embed_url || getYouTubeEmbedUrl(video.video_url);

    res.json({
      success: true,
      data: {
        id: video._id,
        tutorial_id: video.tutorial_id,
        tutorial_title: video.tutorial_title,
        video_url: video.video_url,
        embed_url: embedUrl,
        thumbnail_url: video.thumbnail_url,
        duration_minutes: video.duration_minutes,
        description: video.description,
        created_at: video.created_at
      }
    });
  } catch (err) {
    console.error('Error fetching video:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/videos/all
// Get all videos (for admin panel)
// ─────────────────────────────────────────────────────────────
router.get('/all', async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ tutorial_id: 1 });
    
    res.json({
      success: true,
      count: videos.length,
      data: videos.map(v => ({
        id: v._id,
        tutorial_id: v.tutorial_id,
        tutorial_title: v.tutorial_title,
        video_url: v.video_url,
        embed_url: v.embed_url || getYouTubeEmbedUrl(v.video_url),
        duration_minutes: v.duration_minutes
      }))
    });
  } catch (err) {
    console.error('Error fetching all videos:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/videos
// Add a new video (admin use)
// ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { tutorial_id, tutorial_title, video_url, duration_minutes, description } = req.body;

  if (!tutorial_id || !tutorial_title || !video_url) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: tutorial_id, tutorial_title, video_url' 
    });
  }

  try {
    // Check if video already exists
    const existing = await Video.findOne({ tutorial_id });
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        error: 'Video already exists for this tutorial. Use PUT to update.' 
      });
    }

    const embedUrl = getYouTubeEmbedUrl(video_url);
    const thumbnailUrl = embedUrl ? `https://img.youtube.com/vi/${embedUrl.match(/embed\/([^?]+)/)?.[1]}/maxresdefault.jpg` : null;

    const video = new Video({
      tutorial_id,
      tutorial_title,
      video_url,
      embed_url: embedUrl,
      thumbnail_url: thumbnailUrl,
      duration_minutes: duration_minutes || 0,
      description: description || ''
    });

    await video.save();
    
    res.status(201).json({
      success: true,
      message: 'Video added successfully',
      data: video
    });
  } catch (err) {
    console.error('Error creating video:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/videos/:tutorialId
// Update video for a tutorial
// ─────────────────────────────────────────────────────────────
router.put('/:tutorialId', async (req, res) => {
  const { tutorialId } = req.params;
  const { video_url, duration_minutes, description } = req.body;

  try {
    const video = await Video.findOne({ tutorial_id: parseInt(tutorialId) });
    
    if (!video) {
      return res.status(404).json({ 
        success: false, 
        error: 'Video not found for this tutorial' 
      });
    }

    if (video_url) {
      video.video_url = video_url;
      video.embed_url = getYouTubeEmbedUrl(video_url);
      video.thumbnail_url = `https://img.youtube.com/vi/${video.embed_url?.match(/embed\/([^?]+)/)?.[1]}/maxresdefault.jpg`;
    }
    if (duration_minutes !== undefined) video.duration_minutes = duration_minutes;
    if (description !== undefined) video.description = description;
    video.updated_at = Date.now();
    
    await video.save();

    res.json({
      success: true,
      message: 'Video updated successfully',
      data: video
    });
  } catch (err) {
    console.error('Error updating video:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/videos/:tutorialId
// Delete video for a tutorial
// ─────────────────────────────────────────────────────────────
router.delete('/:tutorialId', async (req, res) => {
  const { tutorialId } = req.params;

  try {
    const video = await Video.findOneAndDelete({ tutorial_id: parseInt(tutorialId) });
    
    if (!video) {
      return res.status(404).json({ 
        success: false, 
        error: 'Video not found for this tutorial' 
      });
    }

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting video:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;