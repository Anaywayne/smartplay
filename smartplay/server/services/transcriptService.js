const { YoutubeTranscript } = require('youtube-transcript');
// Keep this import but we won't use its getInfo function
const { getInfo } = require('@distube/ytdl-core');

const getTranscriptAndTitle = async (youtubeVideoId) => {
  try {
    console.log(`Fetching transcript for video ID: ${youtubeVideoId}`);
    // Fetch transcript
    const transcript = await YoutubeTranscript.fetchTranscript(youtubeVideoId);
    console.log(`Transcript fetched successfully. Length: ${transcript.length}`);

    // Use a placeholder title instead of trying to fetch from YouTube
    const title = `YouTube Video: ${youtubeVideoId}`;
    
    // Format transcript slightly if needed
    const formattedTranscript = transcript.map(item => ({
        text: item.text,
        start: item.offset / 1000, // Convert ms to seconds
        duration: item.duration / 1000 // Convert ms to seconds
    }));

    // Make sure transcript exists before returning
    if (!formattedTranscript || formattedTranscript.length === 0) {
      console.warn(`No transcript content found for ${youtubeVideoId} even after fetch.`);
      return null;
    }

    return { transcript: formattedTranscript, title };
  } catch (error) {
    console.error(`Error fetching transcript or title for video ${youtubeVideoId}:`, error.message);
    console.error(`[transcriptService Error] Video ID: ${youtubeVideoId}, Raw Error:`, error);
    
    // Handle specific transcript errors
    if (error.message.includes('Transcript is disabled')) {
      console.warn(`Transcript is disabled for video ${youtubeVideoId}`);
      // Return a user-friendly message
      return { 
        transcript: [], 
        title: `YouTube Video: ${youtubeVideoId}`,
        error: "This video doesn't have available transcripts. Try another video with captions enabled."
      };
    }
    
    return null;
  }
};

module.exports = {
  getTranscriptAndTitle,
};
