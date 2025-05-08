const { YoutubeTranscript } = require('youtube-transcript');
const { getInfo } = require('ytdl-core'); // Use ytdl-core to get video title

/**
 * Fetches the transcript and basic info for a YouTube video.
 * @param {string} youtubeVideoId - The ID of the YouTube video.
 * @returns {Promise<{transcript: Array<object>, title: string}|null>} - An object containing the transcript array and title, or null if fetching fails.
 */
const getTranscriptAndTitle = async (youtubeVideoId) => {
  try {
    console.log(`Fetching transcript for video ID: ${youtubeVideoId}`);
    // Fetch transcript
    const transcript = await YoutubeTranscript.fetchTranscript(youtubeVideoId);
    console.log(`Transcript fetched successfully. Length: ${transcript.length}`);

    // Fetch basic video info (including title)
    console.log(`Fetching video info for video ID: ${youtubeVideoId}`);
    const info = await getInfo(youtubeVideoId);
    const title = info.videoDetails.title;
    console.log(`Video title fetched: ${title}`);

    // Format transcript slightly if needed (the library format is good)
    const formattedTranscript = transcript.map(item => ({
        text: item.text,
        start: item.offset / 1000, // Convert ms to seconds
        duration: item.duration / 1000 // Convert ms to seconds
    }));


    return { transcript: formattedTranscript, title };

  } catch (error) {
    console.error(`Error fetching transcript or title for video ${youtubeVideoId}:`, error.message);
    console.error(`[transcriptService Error] Video ID: ${youtubeVideoId}, Raw Error:`, error); 
    // Handle common errors specifically if needed
    if (error.message.includes('Could not retrieve transcript') || error.message.includes('No transcripts were found')) {
      console.warn(`No transcript available for video ${youtubeVideoId}`);
    } else if (error.message.includes('Video unavailable')) {
        console.warn(`Video ${youtubeVideoId} is unavailable`);
    }
    // ytdl-core might throw different errors for info fetching
    
    return null; // Indicate failure
  }
};

module.exports = {
  getTranscriptAndTitle,
};
