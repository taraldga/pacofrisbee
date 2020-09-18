import NumberInput from './NumberInput';
import React from 'react';
import { render } from '@testing-library/react';


describe("NumberInput", () => {

  it('renders one input', () => {
    const { container } = render(<NumberInput value={3} isDirty={true} onChange={() => {}} />);
    
    const linkElement = container.getElementsByTagName("p");
    
    expect(linkElement.length).toBe(1)
  });
  
  
  it('renders two buttons', () => {
    const { container } = render(<NumberInput value={3} isDirty={true} onChange={() => {}} />);
    
    const linkElement = container.getElementsByTagName("button");
    
    expect(linkElement.length).toBe(2)
  })
  
  
  it('renders the given value', () => {
    const { container } = render(<NumberInput value={3} isDirty={true} onChange={() => {}} />);
    
    const linkElement = container.getElementsByTagName("p");
    
    expect(linkElement[0].innerHTML).toEqual("3")
  })

  it('calls the onchange function with decremented value on increment button press', async () => {
    const spy = jest.fn(() => {})
    const { findAllByRole } = render(<NumberInput value={3} isDirty={true} onChange={spy} />);

   let buttons =  await findAllByRole("button");

   // Increment button should be last of the buttons
   buttons[0].click();

   expect(spy).toHaveBeenCalledTimes(1);
   expect(spy.mock.calls[0]).toEqual([2]);
  })

  it('calls the onchange function with incremented value on increment button press', async () => {
    const spy = jest.fn(() => {})
    const { findAllByRole } = render(<NumberInput value={3} isDirty={true} onChange={spy} />);

   let buttons =  await findAllByRole("button");

   // Increment button should be last of the buttons
   buttons[1].click();

   expect(spy).toHaveBeenCalledTimes(1);
   expect(spy.mock.calls[0]).toEqual([4]);
  })

  it('does not increment below 1', async () => {
    const spy = jest.fn(() => {})
    const { findAllByRole } = render(<NumberInput value={1} isDirty={true} onChange={spy} />);

   let buttons =  await findAllByRole("button");

   // Increment button should be last of the buttons
   buttons[0].click();

   expect(spy).toHaveBeenCalledTimes(1);
   expect(spy.mock.calls[0]).toEqual([1]);
  })

  it('does not get incremented beyond 30', async () => {
    const spy = jest.fn(() => {})
    const { findAllByRole } = render(<NumberInput value={30} isDirty={true} onChange={spy} />);

   let buttons =  await findAllByRole("button");

   // Increment button should be last of the buttons
   buttons[1].click();

   expect(spy).toHaveBeenCalledTimes(1);
   expect(spy.mock.calls[0]).toEqual([30]);
  })

})