module.exports = {
  siteMetadata: {
    title: 'ryanclark.me',
    author: `Ryan Clark`,
    siteUrl: `https://ryanclark.me`,
    social: {
      twitter: `rynclark`,
      github: `rynclark`,
    },
  },
  plugins: [
    'gatsby-plugin-emotion',
    'gatsby-plugin-typescript',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    'gatsby-plugin-sitemap',
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-49723822-1',
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'ryanclark.me',
        short_name: `ryanclark.me`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#2D3C3F`,
        display: `minimal-ui`,
        icon: `content/assets/icon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
  ],
}
