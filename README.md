# Storybook I18n Addon
A framework/library/implementation agnostic I18n addon for storybook

## Configuration

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-i18n/register';
```

## Usage

Then write your stories like this:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module)
  .addParameters({
    i18n: {
        languages: [
            { name: 'English', value: 'en', default: true },
            { name: 'Spanish', value: 'es' },
            { name: 'German', value: 'de' },
        ],
        countries: [
            { name: 'USA', value: 'us', default: true },
            { name: 'Canada', value: 'ca' },
            { name: 'United Kingdom', value: 'uk' },
        ],
        callback: (language, country) => {
            // In the callback you can use the language and country values
            // however you would like and it will be triggered on both
            // country and language changes
            console.log('Callback:', language, country);
        },
    },
  })
  .add('with text', () => <button>Click me</button>);
```

You can add the I18n countries and languages to all stories with `addParameters` in `.storybook/config.js`:

```js
import { addParameters } from '@storybook/react'; // <- or your storybook framework

addParameters({
   i18n: {
        languages: [
            { name: 'English', value: 'en', default: true },
            { name: 'Spanish', value: 'es' },
            { name: 'German', value: 'de' },
        ],
        countries: [
            { name: 'USA', value: 'us', default: true },
            { name: 'Canada', value: 'ca' },
            { name: 'United Kingdom', value: 'uk' },
        ],
        callback: (language, country) => {
            console.log('Callback:', language, country);
        },
    },
});
```

If you want to override I18n for a single story or group of stories, pass the `i18n` parameter:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module)
  .add('with text', () => <button>Click me</button>, {
        languages: [
            { name: 'English', value: 'en', default: true },
        ],
        countries: [
            { name: 'USA', value: 'us', default: true },
        ],
  });
```

If you don't want to use I18n for a story, you can set the `i18n` parameter to `{}`:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module)
  .add('example 1', () => <button>Click me</button>, {
    i18n: {},
  });

```
