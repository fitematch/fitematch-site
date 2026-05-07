import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from './file-upload';
import { FlashMessage } from './flash-message';
import { renderWithProviders } from '@/tests/utils/render-with-providers';

describe('FileUpload', () => {
  beforeEach(() => {
    URL.createObjectURL = jest.fn(() => 'blob:preview');
    URL.revokeObjectURL = jest.fn();
  });

  it('render', () => {
    renderWithProviders(
      <>
        <FileUpload label="Currículo" accept=".pdf" onUpload={jest.fn()} />
        <FlashMessage />
      </>
    );

    expect(screen.getByText('Currículo')).toBeInTheDocument();
    expect(screen.getByText('Selecionar')).toBeInTheDocument();
  });

  it('upload callback', async () => {
    const user = userEvent.setup();
    const onUpload = jest.fn().mockResolvedValue('/uploads/file.pdf');

    renderWithProviders(
      <>
        <FileUpload label="Currículo" accept=".pdf" onUpload={onUpload} />
        <FlashMessage />
      </>
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['pdf-content'], 'curriculo.pdf', {
      type: 'application/pdf',
    });

    await user.upload(input, file);

    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it('loading', async () => {
    let resolveUpload: (() => void) | undefined;
    const user = userEvent.setup();
    const onUpload = jest.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveUpload = () => resolve('/uploads/file.pdf');
        })
    );

    renderWithProviders(
      <>
        <FileUpload label="Currículo" accept=".pdf" onUpload={onUpload} />
        <FlashMessage />
      </>
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['pdf-content'], 'curriculo.pdf', {
      type: 'application/pdf',
    });

    await user.upload(input, file);

    expect(screen.getByText('Enviando arquivo...')).toBeInTheDocument();
    expect(input).toBeDisabled();

    resolveUpload?.();

    await waitFor(() => {
      expect(screen.getByText('Selecione um arquivo para upload.')).toBeInTheDocument();
    });
  });

  it('preview de imagem', async () => {
    const user = userEvent.setup();
    const onUpload = jest.fn().mockResolvedValue('/uploads/photo.png');

    renderWithProviders(
      <>
        <FileUpload label="Imagem" accept="image/*" onUpload={onUpload} />
        <FlashMessage />
      </>
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['image-content'], 'foto.png', {
      type: 'image/png',
    });

    await user.upload(input, file);

    expect(screen.getByText('Confirmar imagem')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Preview' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Preview' }));

    expect(screen.getByAltText('foto.png')).toBeInTheDocument();
  });

  it('preview pdf', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <FileUpload
          label="Currículo"
          accept=".pdf"
          value="/uploads/curriculo.pdf"
          onUpload={jest.fn()}
        />
        <FlashMessage />
      </>
    );

    await user.click(screen.getByRole('button', { name: 'Preview' }));

    expect(screen.getByText('curriculo.pdf')).toBeInTheDocument();
  });

  it('erro', async () => {
    const user = userEvent.setup();
    const onUpload = jest.fn().mockRejectedValue(new Error('Falha'));

    renderWithProviders(
      <>
        <FileUpload label="Currículo" accept=".pdf" onUpload={onUpload} />
        <FlashMessage />
      </>
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['pdf-content'], 'curriculo.pdf', {
      type: 'application/pdf',
    });

    await user.upload(input, file);

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível enviar o arquivo.')
      ).toBeInTheDocument();
    });
  });
});
