import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt } = options;
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system', content: `
        You will receive many texts, which may have spelling, grammatical or typographical errors,
        You have to respond in JSON format, and your task is to correct those errors ( if they exist ) to finally return that information to with solutions. 
        finally return that information to you with solutions, you also have to provide in percentage the level of accuracy that the user has, that is, how well he did the job of writing without errors.
       
        Example of output:
        {
          userScore: number,
          errors: string[] //['error -> solution'],
          message: string // Use Emojis and text to congrats user (or report that he have mistakes)
        }
        
        
        If no errors, you have to return a congrats message.
      `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
    max_tokens: 150,
  });
  return JSON.parse(chatCompletion.choices[0].message.content);
};