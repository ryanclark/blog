import React from 'react';
import styled from '@emotion/styled';

import { Link, graphql } from 'gatsby';

import { Bio } from '../components/bio';
import { Layout } from '../components/layout';
import { SEO } from '../components/seo';
import { rhythm } from '../utils/typography';

interface BlogIndexProps {
  location: Location;
  data: any;
}

const Title = styled('h3')`
  font-family: Oswald, sans-serif;
  text-transform: uppercase;
  font-size: 42px;
`;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`;

function BlogIndex(props: BlogIndexProps) {
  const { data } = props;

  const siteTitle = data.site.siteMetadata.title;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        title="Home"
        keywords={['blog', 'typescript', 'angular', 'development', 'javascript', 'react']}
      />
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug;
        return (
          <div key={node.fields.slug}>
            <Title
              style={{
                marginBottom: rhythm(1 / 4),
              }}
            >
              <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                {title}
              </Link>
            </Title>
            <small>{node.frontmatter.date}</small>
            <p
              dangerouslySetInnerHTML={{
                __html: node.frontmatter.description || node.excerpt,
              }}
            />
          </div>
        );
      })}
    </Layout>
  );
}

export default BlogIndex;
