const GROK_API_KEY = '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';
const GROK_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

class LegalAIService {
  async chatWithAI(messages) {
    try {
      const response = await fetch(GROK_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: messages,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Legal AI Error:', error);
      // Return fallback response for demo
      return this.getFallbackResponse(messages[messages.length - 1]?.content || '');
    }
  }

  async translateText(text, targetLanguage) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are a professional translator. Translate given text to ${targetLanguage}. Only return translation, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ];

      const response = await fetch(GROK_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: messages,
          temperature: 0.3,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Translation Error:', error);
      // Return demo translation
      return `[${targetLanguage}] ${text}`;
    }
  }

  async readDocument(text) {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a document analysis assistant. Analyze the given document text and provide a comprehensive summary including key points and insights.'
        },
        {
          role: 'user',
          content: text
        }
      ];

      const response = await fetch(GROK_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: messages,
          temperature: 0.5,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Document Reading Error:', error);
      return this.getDocumentAnalysisFallback(text);
    }
  }

  getFallbackResponse(input) {
    const responses = [
      "I understand your query. Let me help you with that! This is a demonstration response from Legal AI assistant.",
      "That's an interesting question! Based on the context, I'd suggest exploring this topic further.",
      "I can assist you with document analysis, translations, and general queries. How else can I help?",
      "Thanks for reaching out! The AI is processing your request and this is a demo response.",
      "Great question! The Legal AI integration provides intelligent responses to help with your tasks."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getDocumentAnalysisFallback(text) {
    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).length - 1;
    const paragraphCount = text.split(/\n\n+/).length;

    return `## Document Analysis

**Document Statistics:**
- Word Count: ${wordCount}
- Sentence Count: ${sentenceCount}
- Paragraph Count: ${paragraphCount}

**Summary:**
This document contains approximately ${wordCount} words across ${paragraphCount} paragraphs. The text appears to be a ${wordCount > 500 ? 'detailed document with comprehensive information' : 'brief document with concise information'}.

**Key Observations:**
- Document structure suggests ${paragraphCount > 3 ? 'organized content with multiple sections' : 'focused content on a specific topic'}
- Average sentence length indicates ${sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 'N/A'} words per sentence
- The content appears to be ${text.includes('?') ? 'interactive or questioning in nature' : 'informative and declarative'}

**Note:** This is a demo analysis. With full API connectivity, you'll get more detailed AI-powered insights about your document's content, themes, and key points.`;
  }
}

export default new LegalAIService();
