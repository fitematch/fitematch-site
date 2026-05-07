import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogoUploadCropper } from './logo-upload-cropper';

const originalImage = global.Image;
const createObjectURLMock = URL.createObjectURL as jest.Mock;
const revokeObjectURLMock = URL.revokeObjectURL as jest.Mock;
const nativeCreateElement = document.createElement.bind(document);

class MockImage {
  onload: null | (() => void) = null;
  width = 400;
  height = 200;

  set src(_value: string) {
    if (this.onload) {
      this.onload();
    }
  }
}

function mockCanvas(getContextImpl?: () => CanvasRenderingContext2D | null) {
  const drawImage = jest.fn();
  const clearRect = jest.fn();
  const toDataURL = jest.fn(() => 'data:image/png;base64,mock');

  jest
    .spyOn(document, 'createElement')
    .mockImplementation(((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext:
            getContextImpl ||
            jest.fn(() => ({
              drawImage,
              clearRect,
            })),
          toDataURL,
        } as unknown as HTMLCanvasElement;
      }

      return nativeCreateElement(tagName);
    }) as typeof document.createElement);
}

describe('LogoUploadCropper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global, 'Image', {
      value: MockImage,
      configurable: true,
    });
    mockCanvas();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Object.defineProperty(global, 'Image', {
      value: originalImage,
      configurable: true,
    });
  });

  it('renderiza estado inicial', () => {
    render(<LogoUploadCropper onCroppedImageChange={jest.fn()} />);

    expect(screen.getByText('Logo da empresa')).toBeInTheDocument();
    expect(screen.getByText('Nenhum arquivo selecionado')).toBeInTheDocument();
  });

  it('abre modal ao selecionar arquivo e confirma crop', async () => {
    const user = userEvent.setup();
    const onCroppedImageChange = jest.fn();

    render(<LogoUploadCropper onCroppedImageChange={onCroppedImageChange} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['logo'], 'logo.png', { type: 'image/png' });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(await screen.findByText('Ajustar logo')).toBeInTheDocument();
    expect(screen.getByText('logo.png')).toBeInTheDocument();
    expect(screen.getByText('4 B')).toBeInTheDocument();

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '2' } });

    await user.click(screen.getByRole('button', { name: 'Usar imagem' }));

    await waitFor(() => {
      expect(onCroppedImageChange).toHaveBeenCalledWith('data:image/png;base64,mock');
    });
    expect(screen.queryByText('Ajustar logo')).not.toBeInTheDocument();
  });

  it('cancela modal sem arquivo aplicado e limpa estado', async () => {
    const user = userEvent.setup();
    const onCroppedImageChange = jest.fn();

    render(<LogoUploadCropper onCroppedImageChange={onCroppedImageChange} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['logo'], 'logo.png', { type: 'image/png' });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    await screen.findByText('Ajustar logo');
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onCroppedImageChange).toHaveBeenCalledWith(null);
    expect(screen.getByText('Nenhum arquivo selecionado')).toBeInTheDocument();
  });

  it('remove preview ao limpar arquivo', () => {
    render(<LogoUploadCropper onCroppedImageChange={jest.fn()} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [] },
    });

    expect(createObjectURLMock).not.toHaveBeenCalled();
    expect(revokeObjectURLMock).not.toHaveBeenCalled();
  });

  it('formata arquivo maior que 1MB e permite arrastar a área de crop', async () => {
    const user = userEvent.setup();

    render(<LogoUploadCropper onCroppedImageChange={jest.fn()} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File([new Uint8Array(1024 * 1024 + 512)], 'logo-big.png', {
      type: 'image/png',
    });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(await screen.findByText('1.0 MB')).toBeInTheDocument();

    const cropArea = screen
      .getByAltText('Preview do logo da empresa')
      .parentElement as HTMLDivElement;

    fireEvent.mouseDown(cropArea, { clientX: 100, clientY: 100 });
    expect(cropArea).toHaveClass('cursor-grabbing');
    fireEvent.mouseMove(window, { clientX: 140, clientY: 130 });
    fireEvent.mouseUp(window);

    await waitFor(() => {
      expect(cropArea).toHaveClass('cursor-grab');
    });

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
  });

  it('formata arquivo em KB', async () => {
    render(<LogoUploadCropper onCroppedImageChange={jest.fn()} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File([new Uint8Array(1536)], 'logo-kb.png', {
      type: 'image/png',
    });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(await screen.findByText('1.5 KB')).toBeInTheDocument();
  });

  it('retorna null quando canvas não possui contexto', async () => {
    const onCroppedImageChange = jest.fn();
    mockCanvas(() => null);

    render(<LogoUploadCropper onCroppedImageChange={onCroppedImageChange} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['logo'], 'logo.png', { type: 'image/png' });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    await screen.findByText('Ajustar logo');
    await waitFor(() => {
      expect(onCroppedImageChange).toHaveBeenCalledWith(null);
    });
  });

  it('ignora mouse down quando ainda não existe preview', () => {
    render(<LogoUploadCropper onCroppedImageChange={jest.fn()} />);

    const placeholders = screen.getAllByText('Nenhum arquivo selecionado');
    fireEvent.mouseDown(placeholders[0].closest('label') as HTMLElement, {
      clientX: 10,
      clientY: 10,
    });

    expect(screen.queryByText('Ajustar logo')).not.toBeInTheDocument();
  });
});
