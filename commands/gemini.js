import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function fileToGenerativePart(attachment) {
    const response = await fetch(attachment.url);
    const buffer = await response.arrayBuffer();
    return {
        inlineData: {
            data: Buffer.from(buffer).toString('base64'),
            mimeType: attachment.contentType
        },
    };
}

export async function handleGeminiCommand(interaction) {
    await interaction.deferReply();

    const question = interaction.options.getString('question');
    const imageAttachment = interaction.options.getAttachment('image');

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-pro",
            generationConfig,
        });

        let responseText;

        if (imageAttachment) {
            if (!imageAttachment.contentType?.startsWith('image/')) {
                await interaction.editReply('Please provide a valid image file.');
                return;
            }

            const imagePart = await fileToGenerativePart(imageAttachment);
            const result = await model.generateContent([question, imagePart]);
            responseText = result.response.text();
        } else {
            const result = await model.generateContent(question);
            responseText = result.response.text();
        }

        if (responseText.length <= 1999) {
            await interaction.editReply(responseText);
            return;
        }

        const chunks = [];
        let remainingText = responseText;
        
        while (remainingText.length > 0) {
            let splitIndex = 1999;
            if (remainingText.length > 1999) {
                splitIndex = remainingText.lastIndexOf('.', 1999);
                splitIndex = splitIndex === -1 ? remainingText.lastIndexOf('\n', 1999) : splitIndex;
                splitIndex = splitIndex === -1 ? 1999 : splitIndex + 1;
            }

            chunks.push(remainingText.substring(0, splitIndex));
            remainingText = remainingText.substring(splitIndex).trim();
        }

        await interaction.editReply(chunks[0]);

        for (let i = 1; i < chunks.length; i++) {
            await interaction.followUp(chunks[i]);
        }

    } catch (error) {
        console.error('Error with Gemini AI:', error);
        await interaction.editReply('Sorry, there was an error processing your request.');
    }
} 