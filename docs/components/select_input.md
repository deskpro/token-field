SelectInput
=========

Render a select input

```jsx
<SelectInput
    dataSource={{ getOptions: options }}
    className="test"
    renderHeader={<h4>Countries</h4>}
/>
```

### Props

**className={string}**
Class to pass to the field

**dateSource={object}**
Where your options come from
```javascript
{
  getOptions:  options // array or function,
  findOptions: () => {} // optionnal filtering function
}
```

Options format : 
* JS array with:
  * id or value as identifier
  * optionnaly label, name or time to be displayed (if not provided the identifier will be used)


**isMultiple={boolean}**
Specify if multiple options can be select, default = false

**renderItem={function}**
Optional function to render each option

**renderHeader={function | node}**
Specify if a header need to be added to the menu

**renderFooter={function | node}**
Specify if a footer need to be added to the menu

**showSearch={boolean}**
Specify if a search input should be provided

**selectionTranslation={string}**
Translations of the 'selections' word used to display number of options checked in multiple mode

The value is pass through the token property (string or number)

```javascript
{
  type:  'user-message',
  value: 'help upgrading'
}
```
value will be either an identifier of your options or an array if isMultiple is _true_