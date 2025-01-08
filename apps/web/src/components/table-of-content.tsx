import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { type FC, useMemo } from "react";
import slugify from "slugify";
import { cn } from "@workspace/ui/lib/utils";
import type {
  SanityRichTextBlock,
  SanityRichTextProps,
} from "@/types";
import type { RichText } from "@/lib/sanity/sanity.types";

export interface TableProps {
  richText?: SanityRichTextProps | null;
}

interface Heading {
  style: keyof typeof headings;
  children: Array<{ text: string }>;
}

interface ProcessedHeading {
  href: string;
  text: string;
}

const headings = {
  h2: "pl-0",
  h3: "pl-4",
  h4: "pl-8",
  h5: "pl-12",
  h6: "pl-16",
};

function extractTextFromBlock(
  block: Array<{ text: string }>
): string {
  return block?.[0]?.text ?? "";
}

function styleToNumber(style: string): number {
  return Number(style.replace("h", ""));
}

function filterHeadings(richText?: SanityRichTextBlock[] | null) {
  if (!Array.isArray(richText)) return [];

  const headings: ProcessedHeading[] = [];

  for (const block of richText) {
    if (block._type !== "block") continue;
    if (block.style?.startsWith("h")) {
      const text = block.children
        ?.map((child) => child.text)
        .join("");
      if (!text) continue;
      headings.push({
        href: `#${slugify(text, {
          lower: true,
          strict: true,
        })}`,
        text,
      });
    }
  }

  return headings;
}

const Anchor: FC<{ heading: ProcessedHeading }> = ({ heading }) => {
  const { href, text } = heading;
  return (
    <li>
      <Link href={href}>{text}</Link>
    </li>
  );
};

export function TableOfContent({ richText }: TableProps) {
  const { showTableOfContent, headings } = useMemo(() => {
    const exist = filterHeadings(richText as SanityRichTextBlock[]);

    return { showTableOfContent: exist.length > 0, headings: exist };
  }, [richText]);

  if (!showTableOfContent) return null;

  return (
    <div className="sticky left-0 top-8 flex flex-col">
      <details className="group mb-4 rounded-xl bg-zinc-100 p-8">
        <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold">
          Table of Contents
          <ChevronDown className="h-5 w-5 transform transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="mt-4 prose prose-sm prose-links:underline prose-links:decoration-dotted prose-links:underline-offset-4">
          <ul className="flex flex-col">
            {headings.map((heading, index) => (
              <Anchor
                heading={heading}
                key={`${index.toString()}-${heading.text}`}
              />
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
}
