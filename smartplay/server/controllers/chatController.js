const Video = require('../models/Video');
const { getAnswerFromAI } = require('../services/aiService');

exports.askQuestion = async (req, res) => {
    const { videoId } = req.params; // This is the DB _id of the Video document
    const { question } = req.body;
    const userId = req.user.id;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
        return res.status(400).json({ message: 'Question is required and must be a non-empty string' });
    }

    try {
        // 1. Find the video document ensuring it belongs to the user
        const video = await Video.findOne({ _id: videoId, userId });

        if (!video) {
            return res.status(404).json({ message: 'Video not found or you do not have permission to access it.' });
        }

        if (!video.transcript || video.transcript.length === 0) {
            return res.status(400).json({ message: 'Cannot ask questions: Transcript is missing or empty for this video.' });
        }

        // 2. Prepare transcript text for the AI
        const transcriptText = video.transcript.map(part => part.text).join(' ');

        // 3. Call the AI service
        console.log(`Asking AI about video ${videoId} for user ${userId}. Question: "${question}"`);
        const aiAnswer = await getAnswerFromAI(transcriptText, question.trim());

        if (!aiAnswer || aiAnswer.includes("AI service") || aiAnswer.includes("error")) {
             // Handle cases where AI service failed explicitly
             console.error(`AI service failed for video ${videoId}, question: "${question}". Response: ${aiAnswer}`);
             // Don't save the Q&A if AI failed, return the error message from AI service
             return res.status(503).json({ message: aiAnswer || "AI service failed to provide an answer." }); // 503 Service Unavailable
        }

        // 4. Save the question and the AI's answer to the video document
        video.questions.push({
            question: question.trim(),
            answer: aiAnswer,
            // askedAt will be set by default schema timestamp
        });

        await video.save();
        console.log(`Question and Answer saved for video ${videoId}`);

        // 5. Return the AI's answer
        res.status(200).json({ answer: aiAnswer });

    } catch (error) {
        console.error(`Error asking question for video ${videoId}:`, error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid video ID format' });
        }
        res.status(500).json({ message: 'Server error while processing the question' });
    }
};
