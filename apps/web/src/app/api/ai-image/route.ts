import { createReplicate } from "@ai-sdk/replicate";
import { experimental_generateImage as generateImage, RetryError } from "ai";
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
    .enum(["small", "medium", "large", "extra-large"])
    .optional()
    .default("medium"),
  numberOfImages: z.number().min(1).max(4).optional().default(1),
});

function getDimensionImage(size: string, aspect: string) {
  const aspectMap = {
    "1:1": { width: 1024, height: 1024 },
    "16:9": { width: 1024, height: 576 },
    "4:3": { width: 1024, height: 768 },
    "3:2": { width: 1024, height: 683 },
  };

  const sizeMap = {
    small: 0.5,
    medium: 1,
    large: 1.5,
    "extra-large": 2,
  };

  const baseSize = aspectMap[aspect as keyof typeof aspectMap];
  const scale = sizeMap[size as keyof typeof sizeMap];

  const width = Math.round(baseSize.width * scale);
  const height = Math.round(baseSize.height * scale);

  return `${width}x${height}` as const;
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

    const dimension = getDimensionImage(size, aspectRatio);

    const images = [];

    // const { images } = await generateImage({
    //   model: replicate.image(model, {
    //     maxImagesPerCall: numberOfImages,
    //   }),
    //   prompt,
    //   n: numberOfImages,
    //   size: dimension,
    //   aspectRatio,
    //   ...(negativePrompt && {
    //     negative_prompt: negativePrompt,
    //   }),
    // });

    // Prepare response
    const response = {
      images: images.map((img) => img.base64),
      metadata: {
        prompt,
        dimension,
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
        {
          error: "Invalid input",
          details: error?.errors?.map((err) => err?.message).join(" "),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
