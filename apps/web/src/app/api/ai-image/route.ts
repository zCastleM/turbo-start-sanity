import { openai } from "@ai-sdk/openai";
import type { Message } from "ai";
import {
  experimental_generateImage as generateImage,
  streamText,
  tool,
} from "ai";
import { z } from "zod";

export async function POST(request: Request) {
  //   const { messages }: { messages: Message[] } = await request.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages: [
      {
        role: "user",
        content: "Generate an image of a cat",
      },
    ],
    tools: {
      generateImage: tool({
        description: "Generate an image",
        parameters: z.object({
          prompt: z.string().describe("The prompt to generate the image from"),
        }),
        execute: async ({ prompt }) => {
          const { image } = await generateImage({
            model: openai.image("dall-e-3"),
            prompt,
          });
          // in production, save this image to blob storage and return a URL
          return { image: image.base64, prompt };
        },
      }),
    },
  });
  return result.toDataStreamResponse();
}
