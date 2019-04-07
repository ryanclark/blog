import React from 'react';
import styled from '@emotion/styled';

import { Link } from 'gatsby';

import { rhythm, scale } from '../../utils/typography';
import { Logo } from '../logo';
import { GitHubIcon, TwitterIcon } from '../icons';

interface LayoutProps {
  location: Location;
  title: string;
  children: any;
}

const Container = styled('div')`
  max-width: 1200px;
  padding-top: 50px;
  margin: 0 auto;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  box-shadow: none;
  
  &:hover {
    text-decoration: none;
  }
`;

const SocialLink = styled('a')`
  margin-left: 15px;
  svg {
    fill: #262626;
  }
`;

const Header = styled('header')`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 800px) {
    padding: 0 15px;
  }
`;

const SocialIcons = styled('header')`
  display: flex;
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const Main = styled('main')`
  max-width: 800px;
  margin: 100px auto 0;
  
  @media (max-width: 800px) {
    margin: 20px auto 0;
    padding: 10px 15px;
  }
`;

export function Layout(props: LayoutProps) {
  const { location, title, children } = props;

  const rootPath = `${__PATH_PREFIX__}/`;
  let header;

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h1>
    );
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>
    );
  }
  return (
    <Container>
      <Header>
        <LogoLink to="/">
          <Logo />
        </LogoLink>

        <SocialIcons>
          <SocialLink href="https://github.com/rynclark" target="_blank"><GitHubIcon /></SocialLink>
          <SocialLink href="https://twitter.com/rynclark" target="_blank"><TwitterIcon /></SocialLink>
        </SocialIcons>
      </Header>
      <Main>{children}</Main>
    </Container>
  );
}
