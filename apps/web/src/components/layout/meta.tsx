import Head from "next/head";

const DOMAIN = "https://evergreendocs.ai";

type MetaProps = {
  title?: string;
  description?: string;
  image?: string;
};

function Meta({
  title = "Evergreen Docs",
  description = "Evergreen Docs is a Github App designed to keep your documentation up-to-date, accurate, and comprehensive, using the context of your repository and the advanced language capabilities of Chat GPT. With its integration with Github, Evergreen Docs has access to all relevant information in your repository, including code, issues, and pull requests, allowing it to automatically update your documentation as your code evolves.",
}: // image,
MetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* <meta itemProp="image" content={image} /> */}
      <meta property="og:logo" content={`${DOMAIN}/logo.png`}></meta>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* <meta property="og:image" content={image} /> */}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vercel" />
      <meta name="twitter:creator" content="@EvergreenDocs" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* <meta name="twitter:image" content={image} /> */}
    </Head>
  );
}

export default Meta;
