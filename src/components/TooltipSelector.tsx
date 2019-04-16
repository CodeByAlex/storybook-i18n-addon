import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { SelectorItem } from './SelectorItem';

const Select = styled.select`
  margin: 7px;
  border: 0;
  background: #ffffff;
  font-size: 13px;
  color: #333333;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 0 1px inset;
  line-height: 20px;
  flex: 1;
  height: 32px;
  user-select: none;
`;

export default function TooltipSelector({ id, links, indexSelected, selectCallback }) {
  return (
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
