import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt } = options;
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          You will receive a question and your task is to give an answer with pros and cons,
          the answer should be in markdown format.
          Pros and Cons have to be in a list.
        `,
      },
      {
        role: 'user', content: prompt,
      },
    ],
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
    max_tokens: 500
  });

  return chatCompletion.choices[0].message;
};