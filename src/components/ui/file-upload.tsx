'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { FaCheck, FaEye, FaTimes } from 'react-icons/fa';
import { FaFilePdf, FaImage } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { Modal } from '@/components/ui/modal';
import { resolveFileUrl } from '@/utils/file-url';

interface FileUploadProps {
  label: string;
  accept: string;
  value?: string;
  onUpload: (file: File) => Promise<string>;
  fullWidthImagePreview?: boolean;
  cropAspectRatio?: number;
}

function getFileNameFromUrl(url?: string) {
  if (!url) {
    return '';
  }

  const cleanUrl = url.split('?')[0];
  const segments = cleanUrl.split('/');

  return decodeURIComponent(segments[segments.length - 1] || cleanUrl);
}

function isImageFile(file?: File | null, url?: string) {
  if (file?.type.startsWith('image/')) {
    return true;
  }

  return Boolean(url && /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url));
}

function isPdfFile(file?: File | null, url?: string) {
  if (file?.type === 'application/pdf') {
    return true;
  }

  return Boolean(url && /\.pdf$/i.test(url));
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  label,
  accept,
  value,
  onUpload,
  fullWidthImagePreview = false,
  cropAspectRatio = 1,
}: FileUploadProps) {
  const { showError } = useFlashMessage();
  const [isUploading, setIsUploading] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }

      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }
    };
  }, [localPreviewUrl, pendingPreviewUrl]);

  const previewUrl = localPreviewUrl || value;
  const fileName = uploadedFile?.name || getFileNameFromUrl(value);
  const resolvedPreviewUrl = resolveFileUrl(previewUrl);
  const hasImagePreview = isImageFile(uploadedFile, previewUrl);
  const hasPdfPreview = isPdfFile(uploadedFile, previewUrl);
  const hasPreview = Boolean(previewUrl);
  const buttonLabel = 'Selecionar';
  const helperText = useMemo(() => {
    if (fileName) {
      return `File: ${fileName}`;
    }

    return 'File: Nenhum arquivo selecionado';
  }, [fileName]);

  function resetPendingState() {
    if (pendingPreviewUrl) {
      URL.revokeObjectURL(pendingPreviewUrl);
    }

    setPendingFile(null);
    setPendingPreviewUrl(null);
    setIsConfirmModalOpen(false);
  }

  async function uploadSelectedFile(file: File, previewObjectUrl?: string) {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    const objectUrl = previewObjectUrl || URL.createObjectURL(file);

    setLocalPreviewUrl(objectUrl);
    setUploadedFile(file);
    setIsUploading(true);

    try {
      await onUpload(file);
    } catch {
      showError('Não foi possível enviar o arquivo.');
      URL.revokeObjectURL(objectUrl);
      setLocalPreviewUrl(null);
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleConfirmUpload() {
    if (!pendingFile) {
      return;
    }

    const previewObjectUrl = URL.createObjectURL(pendingFile);
    setIsConfirmModalOpen(false);
    await uploadSelectedFile(pendingFile, previewObjectUrl);
    setPendingFile(null);
    setPendingPreviewUrl(null);
  }

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type.startsWith('image/')) {
      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }

      const objectUrl = URL.createObjectURL(file);

      setPendingFile(file);
      setPendingPreviewUrl(objectUrl);
      setIsConfirmModalOpen(true);
      event.target.value = '';
      return;
    }

    await uploadSelectedFile(file);
    event.target.value = '';
  }

  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-gray-300">
        {label}
      </label>

      <div className="rounded-2xl border border-gray-500 bg-black p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-100">{helperText}</p>
            <p className="mt-1 text-xs text-gray-300">
              {isUploading ? 'Enviando arquivo...' : 'Selecione um arquivo para upload.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasPreview && (
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-500 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5"
              >
                <FaEye className="h-4 w-4" />
                Preview
              </button>
            )}

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-black transition hover:bg-gray-300">
              <IoCloudUploadOutline className="h-4 w-4" />
              <span>{buttonLabel}</span>
              <input
                type="file"
                accept={accept}
                onChange={handleChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isConfirmModalOpen && !!pendingPreviewUrl}
        onClose={resetPendingState}
        contentClassName={cropAspectRatio > 1 ? 'max-w-5xl' : 'max-w-lg'}
        showDefaultClose={false}
      >
        <div className="flex flex-col items-center gap-5">
          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={resetPendingState}
              className="text-gray-300 transition hover:text-gray-100"
              aria-label="Fechar modal"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <div>
            <h3 className="text-center text-lg font-semibold uppercase text-gray-100">
              Confirmar imagem
            </h3>
            <p className="mt-2 text-center text-sm text-gray-300">
              {`Confirme o envio da imagem. Deseja confirmar o upload da imagem ${pendingFile?.name || ''} com ${pendingFile ? formatFileSize(pendingFile.size) : ''}?`}
            </p>
          </div>

          {pendingPreviewUrl && (
            <div
              className="relative w-full overflow-hidden rounded-2xl border border-gray-500 bg-white"
            >
              <Image
                src={pendingPreviewUrl}
                alt="Preview para confirmacao"
                width={1600}
                height={1600}
                unoptimized
                className="mx-auto block max-h-[80vh] w-full rounded-2xl object-contain"
              />
            </div>
          )}

          <div className="flex w-full justify-end gap-3">
            <button
              type="button"
              onClick={resetPendingState}
              className="inline-flex items-center gap-2 rounded-md border border-gray-500 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5"
            >
              <FaTimes className="h-4 w-4" />
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                void handleConfirmUpload();
              }}
              className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-black transition hover:bg-white"
            >
              <FaCheck className="h-4 w-4" />
              Confirmar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isPreviewModalOpen && !!previewUrl}
        onClose={() => setIsPreviewModalOpen(false)}
        contentClassName={fullWidthImagePreview ? 'max-w-5xl' : 'max-w-3xl'}
        showDefaultClose={false}
      >
        <div className="flex flex-col items-center gap-5">
          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(false)}
              className="text-gray-300 transition hover:text-gray-100"
              aria-label="Fechar preview"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {hasImagePreview && (
            <div className="relative w-full overflow-hidden rounded-2xl border border-gray-500 bg-white">
              <Image
                src={resolvedPreviewUrl}
                alt={fileName || 'Preview do arquivo'}
                width={1600}
                height={1600}
                unoptimized
                className="mx-auto block max-h-[80vh] w-full rounded-2xl object-contain"
              />
            </div>
          )}

          {hasPdfPreview && (
            <div className="flex min-h-[18rem] w-full items-center justify-center gap-3 rounded-2xl border border-gray-500 bg-gray-300 p-6 text-black">
              <FaFilePdf className="h-6 w-6 shrink-0" />
              <span className="truncate text-base">
                {fileName || getFileNameFromUrl(previewUrl)}
              </span>
            </div>
          )}

          {!hasImagePreview && !hasPdfPreview && (
            <div className="flex min-h-[18rem] w-full items-center justify-center gap-3 rounded-2xl border border-gray-500 bg-gray-300 p-6 text-black">
              <FaImage className="h-6 w-6 shrink-0" />
              <span className="truncate text-base">
                {fileName || getFileNameFromUrl(previewUrl)}
              </span>
            </div>
          )}

          <div className="text-center text-sm text-gray-300">
            <p>{`File: ${fileName || getFileNameFromUrl(previewUrl)}`}</p>
            {uploadedFile && <p>{`Tamanho: ${formatFileSize(uploadedFile.size)}`}</p>}
          </div>

          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(false)}
              className="inline-flex items-center gap-2 rounded-md border border-gray-500 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5"
            >
              <FaTimes className="h-4 w-4" />
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
