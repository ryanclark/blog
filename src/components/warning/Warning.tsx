import React from 'react';
import styled from '@emotion/styled';

export const Warning = styled('div')`
  background: #FEEFB3;
  border: 1px solid rgba(0,0,0,.05);
  color: rgba(0,0,0,.8);
  border-radius: 3px;
  margin: 10px 0 20px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  
  svg {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    fill: rgba(0, 0, 0, 0.8);
  }
`;
