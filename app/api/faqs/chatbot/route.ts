import { listFaqsForChatbot } from '@/lib/faqs/service';
import { jsonError, jsonOk } from '@/lib/http';

export async function GET() {
  try {
    const faqs = await listFaqsForChatbot();
    // Return only public fields
    const payload = faqs.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category,
      buttonLabel: f.button_label,
      buttonUrl: f.button_url,
    }));
    return jsonOk({ faqs: payload });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return jsonError('Failed to load FAQs.', 500);
  }
}
