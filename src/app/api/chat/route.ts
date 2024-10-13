import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let history : any[] = [];

export const config = {
  api: {
    bodyParser: true,
  },
}

export async function POST(req: Request){
  if (req.method === 'POST') {
    const body = await req.json();
    const { message } = body;
    if (!message) {
      return NextResponse.json({ error: 'Message is required.' });
    }

    try {
      history.push({ role: 'user', content: message });

      const response = await openai.chat.completions.create({
        // model: 'gpt-4o-mini',
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'assistant', content: 'You are a personal wellness companion focused on quick \
            check-ins for people who need someone to be with them when no one else can be, \
            helping them through critical emotional or mental periods of stress.' },
          ...history,
        ],
      });

      const assistantMessage = response.choices[0].message.content;
      
      console.log('Assistant (new) message:', assistantMessage);

      history.push({ role: 'assistant', content: assistantMessage });

      return NextResponse.json({ reply: assistantMessage });

    } catch (error: any) {
      console.error('Error with OpenAI API:', error.error);

      // return NextResponse.json({ error: 'An error occurred while communicating with the AI.' });
      history.push({ role: 'assistant', content: 'Sorry, I am having trouble. Please try again later.' });
      return NextResponse.json({ reply: 'Sorry, I am having trouble. Please try again later.' });
    }
  } else {
    console.log('Method not allowed. Use POST.');
    return NextResponse.json({ error: 'Method not allowed. Use POST.' });
  }
}
