import { type Decorator } from '@storybook/react';
import { Suspense } from 'react';

export const PageDecorator: Decorator = (Story) => {
  return (
    <Suspense>
      <Story />
    </Suspense>
  );
};
