import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { FormField } from './form-field';

describe('FormField', () => {
  it('associa erro ao campo de maneira acessível', async () => {
    const { container, getByLabelText } = render(
      <FormField name="nome" label="Nome" error="Nome inválido" />,
    );
    expect(getByLabelText('Nome')).toHaveAccessibleDescription('Nome inválido');
    expect((await axe(container)).violations).toEqual([]);
  });
});
