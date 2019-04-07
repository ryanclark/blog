import React from 'react';
import Image from 'gatsby-image';

import { StaticQuery, graphql } from 'gatsby';

import { rhythm } from '../../utils/typography';

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`;

export function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata;
        return (
          <div
            style={{
              display: `flex`,
              alignItems: 'center',
              marginBottom: rhythm(2.5),
            }}
          >
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `100%`,
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />

            <div>
              A blog by me, <strong>{author}</strong>. <a target="_blank" href={`https://twitter.com/${social.twitter}`}>Follow me on Twitter!</a>
            </div>
          </div>
        );
      }}
    />
  );
}
