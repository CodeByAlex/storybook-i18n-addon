import React from 'react';
import { addons, types } from '@storybook/addons';

import { ADDON_ID } from './constants';
import { I18nSelector } from './containers/I18nSelector';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'i18n',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <I18nSelector />,
  });
});
