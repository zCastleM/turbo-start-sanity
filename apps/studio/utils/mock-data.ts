import { faker } from "@faker-js/faker";
import type { SanityClient } from "sanity";
import { createFakeBlockContent, parseHTML } from "./parse-body";
import slugify from "slugify";
import {
  BADGES,
  BUTTON_TEXT,
  generatePageTitle,
  MOCK_SVGS,
  QUESTIONS,
  TITLE_EYEBROW_PAIRS,
} from "./const-mock-data";

function generateButtons() {
  const url = "https://robotostudio.com?ref=template-sanity";
  return [
    {
      _key: faker.string.uuid(),
      _type: "button",
      text: faker.helpers.arrayElement(BUTTON_TEXT),
      url: {
        _type: "customUrl",
        type: "external",
        href: url,
        openInNewTab: faker.datatype.boolean(),
        external: url,
      },
      variant: "default",
    },
    {
      _key: faker.string.uuid(),
      _type: "button",
      text: faker.helpers.arrayElement(BUTTON_TEXT),
      url: {
        _type: "customUrl",
        type: "external",
        href: url,
        openInNewTab: faker.datatype.boolean(),
        external: url,
      },
      variant: "secondary",
    },
  ];
}

async function generateImage(
  client: SanityClient,
  {
    width,
    height,
    category,
  }: { width?: number; height?: number; category?: string } = {}
) {
  const imageUrl =
    category === "author"
      ? faker.image.avatar()
      : faker.image.urlPicsumPhotos({
          width: width ?? 800,
          height: height ?? 600,
          blur: 0,
          grayscale: false,
        });
  const imageBuffer = await fetch(imageUrl).then((res) =>
    res.arrayBuffer()
  );
  const imageAsset = await client.assets.upload(
    "image",
    Buffer.from(imageBuffer),
    {
      title: faker.lorem.words(3),
    }
  );
  return imageAsset._id;
}

async function generateHeroBlock(
  client: SanityClient,
  { title }: { title?: string } = {}
) {
  const imageId = await generateImage(client, {
    width: 1200,
    height: 1200,
  });
  return {
    _key: faker.string.uuid(),
    _type: "hero" as const,
    title: title ?? generatePageTitle(),
    badge: faker.helpers.arrayElement(BADGES),
    image: {
      _type: "image",
      asset: {
        _ref: imageId,
        _type: "reference",
      },
    },
    richText: createFakeBlockContent({
      maxParagraphs: 2,
      minParagraphs: 1,
    }),
    buttons: generateButtons(),
  };
}

async function generateCTABlock(client: SanityClient) {
  return {
    _key: faker.string.uuid(),
    _type: "cta" as const,
    title: generatePageTitle(),
    richText: createFakeBlockContent({
      maxParagraphs: 1,
      minParagraphs: 1,
    }),
    buttons: generateButtons(),
  };
}

function generateFeatureIconsCard() {
  return Array.from({ length: 4 }).map(() => ({
    _key: faker.string.uuid(),
    _type: "featureCardIcon" as const,
    title: faker.company.catchPhrase(),
    icon: {
      _type: "iconPicker",
      svg: faker.helpers.arrayElement(MOCK_SVGS),
      name: faker.company.buzzVerb(),
      provider: "fi",
    },
    richText: createFakeBlockContent({
      maxParagraphs: 1,
      minParagraphs: 1,
    }),
  }));
}
function generateFeatureCardsIconBlock() {
  const selectedPair = faker.helpers.arrayElement(
    TITLE_EYEBROW_PAIRS
  );
  return {
    _key: faker.string.uuid(),
    _type: "featureCardsIcon" as const,
    title: selectedPair.title,
    eyebrow: selectedPair.eyebrow,
    richText: createFakeBlockContent({
      maxParagraphs: 2,
      minParagraphs: 1,
    }),
    cards: generateFeatureIconsCard(),
  };
}

async function generateFAQs(
  client: SanityClient,
  {
    min = 1,
    max = 2,
  }: {
    min?: number;
    max?: number;
    minParagraphs?: number;
    maxParagraphs?: number;
  } = {}
) {
  const length = faker.number.int({ min, max });

  const transaction = client.transaction();

  for (let i = 0; i < length; i++) {
    const len = faker.number.int({ min: 20, max: 50 });
    const faqsBuffer = Array.from({ length: len }, () =>
      faker.helpers.arrayElement(QUESTIONS)
    );
    const faq = faker.helpers.arrayElement(faqsBuffer);
    transaction.create({
      _type: "faq",
      _id: faker.string.uuid(),
      title: faq.value,
      richText: parseHTML(faq.answer),
    });
  }
  const result = await transaction.commit();
  return result.documentIds;
}

async function generateFAQBlock(client: SanityClient) {
  const faqs = await generateFAQs(client, { min: 4, max: 7 });
  return {
    _key: faker.string.uuid(),
    _type: "faqAccordion" as const,
    title: "Frequently Asked Questions",
    subtitle:
      "Find out all the essential details about our platform and how it can serve your needs.",
    faqs: faqs.map((faq) => ({
      _key: faker.string.uuid(),
      _type: "reference",
      _ref: faq,
    })),
  };
}

export async function checkIfDataExists(client: SanityClient) {
  const data = await client.fetch(`{
    "homePage": defined(*[_type == 'homePage'][0]._id),
  }`);
  if (data.homePage) {
    return true;
  }
  return false;
}

export async function getMockHomePageData(client: SanityClient) {
  const blocks = await Promise.all([
    generateHeroBlock(client, { title: "Welcome to our website" }),
    generateCTABlock(client),
    generateFeatureCardsIconBlock(),
    generateFAQBlock(client),
  ]);
  const homePage = {
    _id: faker.string.uuid(),
    _type: "homePage" as const,
    title: "Home Page",
    description: faker.lorem.paragraph(),
    slug: {
      type: "slug" as const,
      current: "/",
    },
    pageBuilder: blocks,
  };
  return homePage;
}

export async function generateMockSlugPageData(client: SanityClient) {
  const blocks = await Promise.all([
    generateHeroBlock(client),
    generateCTABlock(client),
    generateFeatureCardsIconBlock(),
    generateFAQBlock(client),
  ]);

  const imageId = await generateImage(client, {
    width: 2560,
    height: 1440,
  });

  const title = generatePageTitle();

  return {
    _id: faker.string.uuid(),
    _type: "page" as const,
    title,
    description: faker.lorem.paragraph(),
    image: {
      _type: "image",
      asset: {
        _ref: imageId,
        _type: "reference",
      },
    },
    slug: {
      type: "slug",
      current: `/${slugify(title, {
        lower: true,
        remove: /[^a-zA-Z0-9 ]/g,
      })}`,
    },
    pageBuilder: blocks,
  };
}

async function generateMockAuthor(client: SanityClient) {
  const createNewAuthor = faker.datatype.boolean();

  if (!createNewAuthor) {
    return await fetchAuthor(client);
  }

  const imageId = await generateImage(client, {
    category: "author",
  });

  const transaction = client.transaction();
  const authorId = faker.string.uuid();

  transaction.create({
    _id: authorId,
    _type: "author",
    name: faker.person.fullName(),
    position: faker.person.jobTitle(),
    bio: faker.person.bio(),
    image: {
      _type: "image",
      asset: {
        _ref: imageId,
        _type: "reference",
      },
    },
  });

  await transaction.commit();
  return authorId;
}

async function fetchAuthor(client: SanityClient) {
  const authors = await client.fetch(`*[_type == 'author']._id`);
  return faker.helpers.arrayElement(authors);
}

export async function generateMockBlogPage(client: SanityClient) {
  const title = generatePageTitle();

  const imageId = await generateImage(client, {
    width: 2560,
    height: 1440,
  });
  const authorId = await generateMockAuthor(client);

  return {
    _id: faker.string.uuid(),
    _type: "blog" as const,
    title,
    image: {
      _type: "image",
      asset: {
        _ref: imageId,
        _type: "reference",
      },
    },
    publishedAt: new Date(faker.date.past())
      .toISOString()
      .split("T")[0],
    description: faker.lorem.paragraph(),
    slug: {
      type: "slug",
      current: `/blog/${slugify(title, {
        lower: true,
        remove: /[^a-zA-Z0-9 ]/g,
      })}`,
    },
    richText: createFakeBlockContent({
      minParagraphs: 7,
      maxParagraphs: 12,
      rich: true,
    }),
    authors: [
      {
        _key: faker.string.uuid(),
        _type: "reference",
        _ref: authorId,
      },
    ],
  };
}

export async function generateMockPages(
  client: SanityClient,
  {
    min = 5,
    max = 10,
  }: {
    min?: number;
    max?: number;
  } = {}
) {
  const length = faker.number.int({ min, max });
  const pages = await Promise.all(
    Array.from({ length }, () => generateMockSlugPageData(client))
  );
  return pages;
}

export async function generateMockBlogPages(
  client: SanityClient,
  {
    min = 5,
    max = 10,
  }: {
    min?: number;
    max?: number;
  } = {}
) {
  const count = faker.number.int({ min, max });
  const pages = await Promise.all(
    Array.from({ length: count }, () => generateMockBlogPage(client))
  );
  return pages;
}
