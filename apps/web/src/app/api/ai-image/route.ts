import { createReplicate } from "@ai-sdk/replicate";
import { experimental_generateImage as generateImage } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const allowedModel = [
  "black-forest-labs/flux-pro",
  "black-forest-labs/flux-schnell",
] as const;
// Input validation schema
const GenerateImageSchema = z.object({
  prompt: z.string().min(1).max(1000),
  aspectRatio: z.enum(["1:1", "16:9", "4:3", "3:2"]).optional().default("16:9"),
  negativePrompt: z.string().optional(),
  model: z
    .enum(allowedModel)
    .optional()
    .default("black-forest-labs/flux-schnell"),
  size: z
    .enum(["512x512", "768x768", "1024x1024", "1536x1536"])
    .optional()
    .default("768x768"),
  numberOfImages: z.number().min(1).max(4).optional().default(1),
});

interface GenerateImageResponse {
  images: string[];
  metadata: {
    prompt: string;
    aspectRatio: string;
    model: string;
    generatedAt: string;
  };
}

export async function POST(request: Request) {
  try {
    // Input validation
    const body = await request.json();
    const { aspectRatio, numberOfImages, prompt, negativePrompt, size, model } =
      GenerateImageSchema.parse(body);

    // Check API token
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Replicate API token not configured" },
        { status: 500 },
      );
    }

    const replicate = createReplicate({
      apiToken: process.env.REPLICATE_API_TOKEN ?? "",
    });

    const { images } = await generateImage({
      model: replicate.image(model, {
        maxImagesPerCall: numberOfImages,
      }),
      prompt,
      n: numberOfImages,
      size,
      aspectRatio,
      ...(negativePrompt && {
        negative_prompt: negativePrompt,
      }),
    });

    // Prepare response
    const response: GenerateImageResponse = {
      images: images.map((img) => img.base64),
      metadata: {
        prompt,
        aspectRatio,
        model,
        generatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Image generation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
