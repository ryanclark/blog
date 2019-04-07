import React from 'react';

import { graphql } from 'gatsby';

import { Layout } from '../components/layout';
import { SEO } from '../components/seo';

interface NotFoundPageProps {
  location: Location;
  data: any;
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

function NotFoundPage(props: NotFoundPageProps) {
  const { data } = props;

  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title="404: Not Found" />
      <h1>Not Found</h1>
      <p>Oh, that page does not exist. Sorry about that.</p>
    </Layout>
  );
}

export default NotFoundPage;
