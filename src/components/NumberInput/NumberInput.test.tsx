import React from 'react';
import { render } from '@testing-library/react';
import NumberInput from './NumberInput';


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

test('is black when no change is done', () => {
  const { container } = render(<NumberInput value={3} isDirty={false} onChange={() => {}} />);
  
  const linkElement = container.getElementsByTagName("input");

  expect(linkElement[0].style.color).toBe("black")
})