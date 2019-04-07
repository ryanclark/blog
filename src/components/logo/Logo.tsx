import React from 'react';
import styled from '@emotion/styled';

const DollarSign = styled('div')`
  color: #56E386;
  margin-right: 14px;
`;

const Tilde = styled('div')`
  color: #93a1a1;
  margin-right: 10px;
  position: relative;
  top: -1px;
`;

const LogoText = styled('div')`
  display: inline-flex;
  align-items: center;
  font-family: menlo, monospace;
  font-weight: 600;
  color: #F36964;
  font-size: 28px;
  position: relative;
`;

export function Logo() {
  return (
    <LogoText>
      <DollarSign>➜</DollarSign>
      <Tilde>~</Tilde>
      ryan.clark
    </LogoText>
  );
}
