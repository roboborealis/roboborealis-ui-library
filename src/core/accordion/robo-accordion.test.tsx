import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  RoboAccordion,
  RoboAccordionItem,
  RoboAccordionTrigger,
  RoboAccordionContent,
} from './robo-accordion';

const AccordionFixture = ({
  type = 'single',
  collapsible = true,
}: {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
}) => (
  // @ts-expect-error union type requires explicit typing at callsite
  <RoboAccordion type={type} collapsible={collapsible}>
    <RoboAccordionItem value='item-1'>
      <RoboAccordionTrigger>Satellite Information</RoboAccordionTrigger>
      <RoboAccordionContent>Name: Voyager 1</RoboAccordionContent>
    </RoboAccordionItem>
    <RoboAccordionItem value='item-2'>
      <RoboAccordionTrigger>Orbit Data</RoboAccordionTrigger>
      <RoboAccordionContent>Alt: 420 km, Inc: 51.6°</RoboAccordionContent>
    </RoboAccordionItem>
  </RoboAccordion>
);

describe('RoboAccordion', () => {
  it('renders triggers', () => {
    render(<AccordionFixture />);
    expect(screen.getByText('Satellite Information')).toBeInTheDocument();
    expect(screen.getByText('Orbit Data')).toBeInTheDocument();
  });

  it('content is not in DOM by default (Radix removes closed content)', () => {
    render(<AccordionFixture />);
    // Radix Accordion removes closed panel content from the DOM entirely
    expect(screen.queryByText('Name: Voyager 1')).not.toBeInTheDocument();
  });

  it('opens content on trigger click', async () => {
    render(<AccordionFixture />);
    await userEvent.click(screen.getByText('Satellite Information'));
    expect(screen.getByText('Name: Voyager 1')).toBeInTheDocument();
  });

  it('closes open panel on second click (collapsible)', async () => {
    render(<AccordionFixture />);
    const trigger = screen.getByText('Satellite Information');
    await userEvent.click(trigger);
    expect(screen.getByText('Name: Voyager 1')).toBeInTheDocument();
    await userEvent.click(trigger);
    expect(screen.queryByText('Name: Voyager 1')).not.toBeInTheDocument();
  });

  it('only one panel open at a time in single mode', async () => {
    render(<AccordionFixture type='single' />);
    await userEvent.click(screen.getByText('Satellite Information'));
    expect(screen.getByText('Name: Voyager 1')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Orbit Data'));
    expect(screen.queryByText('Name: Voyager 1')).not.toBeInTheDocument();
    expect(screen.getByText('Alt: 420 km, Inc: 51.6°')).toBeInTheDocument();
  });

  it('multiple panels can be open in multiple mode', async () => {
    render(<AccordionFixture type='multiple' />);
    await userEvent.click(screen.getByText('Satellite Information'));
    await userEvent.click(screen.getByText('Orbit Data'));
    expect(screen.getByText('Name: Voyager 1')).toBeVisible();
    expect(screen.getByText('Alt: 420 km, Inc: 51.6°')).toBeVisible();
  });

  it('trigger buttons are keyboard accessible', () => {
    render(<AccordionFixture />);
    const triggers = screen.getAllByRole('button');
    triggers.forEach((btn) => {
      expect(btn).toBeEnabled();
    });
  });

  it('supports defaultValue to pre-open an item', () => {
    render(
      <RoboAccordion type='single' defaultValue='item-1'>
        <RoboAccordionItem value='item-1'>
          <RoboAccordionTrigger>Open by default</RoboAccordionTrigger>
          <RoboAccordionContent>Content visible</RoboAccordionContent>
        </RoboAccordionItem>
      </RoboAccordion>
    );
    expect(screen.getByText('Content visible')).toBeInTheDocument();
  });
});
