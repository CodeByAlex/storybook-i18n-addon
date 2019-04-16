import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { SelectorItem } from './SelectorItem';

const Select = styled.select`
  margin-top: 2px;
  margin-left: 7px;
  margin-right: 7px;
  margin-bottom: 7px;
  border: 0;
  background: #ffffff;
  font-size: 13px;
  color: #333333;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 0 1px inset;
  line-height: 20px;
  flex: 1;
  height: 32px;
  user-select: none;
  min-width: 100px;
`;

const Title = styled.div`
  margin-left: 10px;
  font-weight: 600;
`;

const SelectorWrapper = styled.div`
  margin-top: 4px;
`;

export default function TooltipSelector({ id, links, indexSelected, title, selectCallback }) {
  return (
    <SelectorWrapper>
      <Title>{title}</Title>
      <Select id={id}
        onChange={() => {
          selectCallback(document.getElementById(id));
        }}
      >
        {links.map(({ title, value }, index) => (
          <option key={index} value={value} selected={index === indexSelected}>
            {title}
          </option>
        ))}
      </Select>
    </SelectorWrapper>
  );
}

TooltipSelector.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node.isRequired,
      onClick: PropTypes.func,
    }).isRequired
  ).isRequired,
};
