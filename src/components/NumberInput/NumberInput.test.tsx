import NumberInput from './NumberInput';
import React from 'react';
import { render } from '@testing-library/react';

test('renders one input', () => {
  const { container } = render(<NumberInput value={3} isDirty={true} onChange={() => {}} />);
  
  const linkElement = container.getElementsByTagName("input");

  expect(linkElement.length).toBe(1)
});


test('renders two buttons', () => {
  const { container } = render(<NumberInput value={3} isDirty={true} onChange={() => {}} />);
  
  const linkElement = container.getElementsByTagName("button");

  expect(linkElement.length).toBe(2)
})


test('renders the given value', () => {
  const { container } = render(<NumberInput value={3} isDirty={true} onChange={() => {}} />);
  
  const linkElement = container.getElementsByTagName("input");

  expect(linkElement[0].value).toBe("3")
})
