import React from 'react';
import ReactDOM from 'react-dom';
import TextInput from '../../../src/Components/Input/TextInput';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextInput value={1} />, div);
});
