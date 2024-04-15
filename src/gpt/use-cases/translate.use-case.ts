import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, lang } = options;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          Your role will be that of a professional and efficient translator. 
          You will be provided with a text in a specific 
          language and asked to translate it into another specified language.
        `,
      },
      {
        role: 'user',
        content: `Translate the following text: ${prompt}
                  to the language: ${lang}
                `,
      },
    ],
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
    max_tokens: 500,
  });

  return completion.choices[0].message;
};