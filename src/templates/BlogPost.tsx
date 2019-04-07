import React from 'react';
import styled from '@emotion/styled';

import { graphql } from 'gatsby';
import { DiscussionEmbed } from 'disqus-react';

import { Bio } from '../components/bio';
import { Layout } from '../components/layout';
import { SEO } from '../components/seo';
import { rhythm, scale } from '../utils/typography';
import { Warning } from '../components/warning/Warning';

interface BlogPostTemplateProps {
  location: Location;
  data: any;
  pageContext: any;
  pathContext: {
    slug: string;
  };
}

const Title = styled('h1')`
  font-family: Oswald, sans-serif;
  text-transform: uppercase;
  font-size: 100px;
  max-width: 660px;
  line-height: 110px;
  color: #282A36;
  margin-bottom: 35px;
  
  @media (max-width: 800px) {
    font-size: 42px;
    line-height: 48px;
  }
`;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        warning
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;

function BlogPostTemplate(props: BlogPostTemplateProps) {
  const post = props.data.markdownRemark;
  const siteTitle = props.data.site.siteMetadata.title;

  const warning = post.frontmatter.warning && <Warning>{ post.frontmatter.warning }</Warning>;

  const disqusConfig = {
    url: `http://ryanclark.me/${props.pathContext.slug}`,
    title: post.frontmatter.title,
  };

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <Title>{post.frontmatter.title}</Title>
      <p
        style={{
          ...scale(-1 / 5),
          display: `block`,
          marginBottom: rhythm(1),
          marginTop: rhythm(-1),
        }}
      >
        {post.frontmatter.date}
      </p>
      { warning }
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <Bio />

      <DiscussionEmbed shortname="rynclark" config={disqusConfig} />
    </Layout>
  );
}

export default BlogPostTemplate;
