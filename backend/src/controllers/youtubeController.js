/**
 * YouTube Search Controller
 * Searches YouTube for videos matching the query
 */

const searchYouTube = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    
    // If no API key, return a message suggesting to add one
    if (!YOUTUBE_API_KEY) {
      return res.status(200).json({
        videos: [],
        message: "YouTube API key not configured. Add YOUTUBE_API_KEY to .env file to enable YouTube search.",
      });
    }

    // Search query with "nel ngabo" prefix
    const searchQuery = `nel ngabo ${q}`;
    const maxResults = 10;
    
    // YouTube Data API v3 search endpoint
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(searchQuery)}&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform YouTube API response to our format
    const videos = (data.items || []).map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));
    
    res.json({ videos });
  } catch (error) {
    console.error("YouTube search error:", error);
    next(error);
  }
};

module.exports = {
  searchYouTube,
};

