import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import Panel from './panel/panel';
import * as constants from './addon-constants';

console.log('REGISTERING!');

addons.register(constants.addonKey, api => {
  api.setQueryParams({
    foo: 'bar',
  });
  addons.add(constants.panelKey, {
    type: types.PANEL,
    title: constants.panelTitle,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Panel />
      </AddonPanel>
    ),
    paramKey: constants.paramKey,
  });
});