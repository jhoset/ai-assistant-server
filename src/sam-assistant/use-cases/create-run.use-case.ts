import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId = 'asst_IpbFA8N2OfaZC9YbDJeSWdyj' } = options;

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  })

  return run;
};