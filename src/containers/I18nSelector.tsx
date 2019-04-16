import React, { Component, Fragment } from 'react';
import memoize from 'memoizerific';
import { Combo, Consumer } from '@storybook/api';
import { styled, Global, Theme } from '@storybook/theming';
import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { PARAM_KEY } from '../constants';
import TooltipSelector from '../components/TooltipSelector';

const IconButtonWithLabel = styled(IconButton)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

const IconButtonLabel = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  marginLeft: '10px',
}));

const SelectorWrapper = styled.div`
  min-width: 180px;
  display: flex;
  justify-content: center;
`;

interface Item {
  id: string;
  title: string;
  value: string;
}

interface Input {
  name: string;
  value: string;
  default?: boolean;
}

const createI18nSelectorItem = memoize(1000)(
  (id: string, name: string, value: string): Item => ({
    id: id || name,
    title: name,
    value,
  })
);

const getSelectedI18nValue = (list: Input[], currentSelectedValue: string): string => {
  if (!list.length) {
    return null;
  }

  let defaultIndex = -1;
  for (let index = 0; index < list.length; index++) {
    if (list[index].value === currentSelectedValue) {
      return currentSelectedValue;
    }
    if (list[index].default) {
      defaultIndex = index;
    }
  }

  if (defaultIndex > -1) {
    const defaultValue = list[defaultIndex].value;
    return defaultValue;
  }

  return null;
};

const getSelectedI18nIndex = (list: Input[], currentSelectedValue: string): string => {
  if (!list.length) {
    return -1;
  }

  let defaultIndex = -1;
  for (let index = 0; index < list.length; index++) {
    if (list[index].value === currentSelectedValue) {
      return index;
    }
    if (list[index].default) {
      defaultIndex = index;
    }
  }

  if (defaultIndex > -1) {
    return defaultIndex;
  }

  return -1;
};

const mapper = ({
  api,
  state,
}: Combo): { languageItems: Input[]; countryItems: Input[]; i18nCallback: () => {} } => {
  const story = state.storiesHash[state.storyId];
  const list = story ? api.getParameters(story.id, PARAM_KEY) : [];
  const languageList = list.languages;
  const counrtyList = list.countries;
  const i18nCallback = list.callback;
  return { languageItems: languageList || [], countryItems: counrtyList || [], i18nCallback };
};

const getDisplayedItems = memoize(10)((list: Input[], selected: string) => {
  let availableI18nSelectorItems: Item[] = [];
  for (let item of list) {
    availableI18nSelectorItems.push(createI18nSelectorItem(null, item.name, item.value));
  }

  return availableI18nSelectorItems;
});

interface State {
  languageSelected: string;
  countrySelected: string;
  expanded: boolean;
}

export class I18nSelector extends Component<{}, State> {
  state: State = {
    languageSelected: null,
    countrySelected: null,
    expanded: false,
  };

  change = (args: State) => {
    this.setState(args);
  };

  onVisibilityChange = (isExpanded: boolean) => {
    if (this.state.expanded !== isExpanded) {
      this.setState({ expanded: isExpanded });
    }
  };

  render() {
    const { expanded, languageSelected, countrySelected } = this.state;
    return (
      <Consumer filter={mapper}>
        {({ languageItems, countryItems, i18nCallback }) => {
          const selectedLanguageValue = getSelectedI18nValue(languageItems, languageSelected);
          const selectedCountryValue = getSelectedI18nValue(countryItems, countrySelected);
          const selectedLanguageIndex = getSelectedI18nIndex(languageItems, languageSelected);
          const selectedCountryIndex = getSelectedI18nIndex(countryItems, countrySelected);

          if (i18nCallback) {
            i18nCallback(selectedLanguageValue, selectedCountryValue);
          }

          const languageLinks = getDisplayedItems(languageItems, selectedLanguageValue, args => {
            this.change(args);
          });

          const countryLinks = getDisplayedItems(countryItems, selectedCountryValue, args => {
            this.change(args);
          });

          return countryItems.length || languageItems ? (
            <Fragment>
              <WithTooltip
                placement="top"
                trigger="click"
                tooltipShown={expanded}
                onVisibilityChange={this.onVisibilityChange}
                tooltip={
                  <SelectorWrapper>
                    <TooltipSelector
                      id="i18n-language-selector"
                      links={languageLinks}
                      indexSelected={selectedLanguageIndex}
                      selectCallback={selectObject => {
                        if (selectObject) {
                          i18nCallback(selectObject.value, this.state.countrySelected);
                          this.change({
                            languageSelected: selectObject.value,
                            countrySelected: this.state.countrySelected,
                            expanded: false,
                          });
                        }
                      }}
                    />
                    <TooltipSelector
                      id="i18n-country-selector"
                      links={countryLinks}
                      indexSelected={selectedCountryIndex}
                      selectCallback={selectObject => {
                        if (selectObject) {
                          i18nCallback(this.state.languageSelected, selectObject.value);
                          this.change({
                            languageSelected: this.state.languageSelected,
                            countrySelected: selectObject.value,
                            expanded: false,
                          });
                        }
                      }}
                    />
                  </SelectorWrapper>
                }
                closeOnClick
              >
                <IconButtonWithLabel
                  key="i18n"
                  active={selectedLanguageValue !== null || selectedLanguageValue != null}
                  title="Change the i18n country and language of the preview"
                >
                  <Icons icon="globe" />
                  <IconButtonLabel>
                    {selectedLanguageValue ? selectedLanguageValue : ''}
                    {selectedLanguageValue && selectedCountryValue ? '-' : ''}
                    {selectedCountryValue ? selectedCountryValue : ''}
                  </IconButtonLabel>
                </IconButtonWithLabel>
              </WithTooltip>
            </Fragment>
          ) : null;
        }}
      </Consumer>
    );
  }
}
