import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import MailSettingModal from '../../../src/components/MailSettingModal';

describe('MailSettingModal', () => {
  test('shows required error when event type is empty', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(<MailSettingModal mode="add" onSave={onSave} onClose={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    expect(screen.getByText('Event Type is required')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('allows only alphanumeric template id input', async () => {
    render(<MailSettingModal mode="add" onSave={vi.fn().mockResolvedValue(undefined)} onClose={vi.fn()} />);

    const templateInput = screen.getByPlaceholderText('Alphanumeric only') as HTMLInputElement;
    await userEvent.type(templateInput, 'ABC');
    await userEvent.type(templateInput, '!');

    expect(templateInput.value).toBe('ABC');
  });

  test('submits full payload including addresses and message', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(<MailSettingModal mode="add" onSave={onSave} onClose={onClose} />);

    await userEvent.selectOptions(screen.getByRole('combobox'), 'OTCCross');
    await userEvent.type(screen.getByPlaceholderText('Alphanumeric only'), 'TMP001');
    await userEvent.type(screen.getByPlaceholderText('Description'), 'desc');

    await userEvent.click(screen.getByRole('button', { name: '+ Add Row' }));
    const addressInput = screen.getByPlaceholderText('user@example.com');
    await userEvent.type(addressInput, 'u@example.com');

    await userEvent.click(screen.getByRole('button', { name: 'Message' }));
    await userEvent.type(screen.getByPlaceholderText('Email message template...'), 'hello template');

    await userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        eventType: 'OTCCross',
        templateId: 'TMP001',
        description: 'desc',
        addresses: JSON.stringify([{ kind: 'To', address: 'u@example.com' }]),
        message: 'hello template',
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  test('view mode hides submit button', () => {
    render(
      <MailSettingModal
        mode="view"
        onSave={vi.fn().mockResolvedValue(undefined)}
        onClose={vi.fn()}
        item={{
          id: 1,
          eventType: 'OTCCross',
          templateId: 'TMP001',
          description: 'desc',
          addresses: JSON.stringify([{ kind: 'To', address: 'u@example.com' }]),
          message: 'msg',
          updateUser: 'tester',
          updateTime: '2026-04-19T00:00:00Z',
        }}
      />
    );

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
  });
});