'use client';

import NextImage from 'next/image';
import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { Modal } from '@/components/ui/modal';

interface LogoUploadCropperProps {
  label?: string;
  labelClassName?: string;
  onCroppedImageChange: (value: string | null) => void;
}

const PREVIEW_SIZE = 240;
const EXPORT_SIZE = 512;

interface ImageBounds {
  width: number;
  height: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
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

export function LogoUploadCropper({
  label = 'Logo da empresa',
  labelClassName = 'text-gray-300',
  onCroppedImageChange,
}: LogoUploadCropperProps) {
  const [file, setFile] = useState<File | null>(null);
  const [appliedFileName, setAppliedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBounds, setImageBounds] = useState<ImageBounds | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const dragStateRef = useRef({
    pointerX: 0,
    pointerY: 0,
    startX: 0,
    startY: 0,
  });

  const resetEditorState = useCallback(() => {
    setPreviewUrl(null);
    setImageBounds(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setCroppedPreview(null);
  }, []);

  useEffect(() => {
    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const baseScale = Math.max(
        PREVIEW_SIZE / image.width,
        PREVIEW_SIZE / image.height
      );

      setImageBounds({ width: image.width, height: image.height });
      setZoom(baseScale);
      setPosition({ x: 0, y: 0 });
      setPreviewUrl(objectUrl);
      setIsModalOpen(true);
    };

    image.src = objectUrl;

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const constrainedPosition = useMemo(() => {
    if (!imageBounds) {
      return position;
    }

    const renderedWidth = imageBounds.width * zoom;
    const renderedHeight = imageBounds.height * zoom;
    const maxOffsetX = Math.max(0, (renderedWidth - PREVIEW_SIZE) / 2);
    const maxOffsetY = Math.max(0, (renderedHeight - PREVIEW_SIZE) / 2);

    return {
      x: clamp(position.x, -maxOffsetX, maxOffsetX),
      y: clamp(position.y, -maxOffsetY, maxOffsetY),
    };
  }, [imageBounds, position, zoom]);

  useEffect(() => {
    if (!previewUrl || !imageBounds) {
      return;
    }

    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = EXPORT_SIZE;
      canvas.height = EXPORT_SIZE;

      const context = canvas.getContext('2d');

      if (!context) {
        onCroppedImageChange(null);
        return;
      }

      const cropWidth = PREVIEW_SIZE / zoom;
      const cropHeight = PREVIEW_SIZE / zoom;
      const centerX = imageBounds.width / 2 - constrainedPosition.x / zoom;
      const centerY = imageBounds.height / 2 - constrainedPosition.y / zoom;
      const sourceX = clamp(centerX - cropWidth / 2, 0, imageBounds.width - cropWidth);
      const sourceY = clamp(centerY - cropHeight / 2, 0, imageBounds.height - cropHeight);

      context.clearRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
      context.drawImage(
        image,
        sourceX,
        sourceY,
        cropWidth,
        cropHeight,
        0,
        0,
        EXPORT_SIZE,
        EXPORT_SIZE
      );

      setCroppedPreview(canvas.toDataURL('image/png'));
    };

    image.src = previewUrl;
  }, [constrainedPosition, imageBounds, onCroppedImageChange, previewUrl, zoom]);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    function handlePointerMove(event: MouseEvent) {
      const deltaX = event.clientX - dragStateRef.current.pointerX;
      const deltaY = event.clientY - dragStateRef.current.pointerY;

      setPosition({
        x: dragStateRef.current.startX + deltaX,
        y: dragStateRef.current.startY + deltaY,
      });
    }

    function handlePointerUp() {
      setIsDragging(false);
    }

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [isDragging]);

  function handleFileChange(nextFile: File | null) {
    if (!nextFile) {
      setFile(null);
      resetEditorState();
      return;
    }

    setFile(nextFile);
  }

  function handleCloseModal() {
    if (!appliedFileName) {
      setFile(null);
      resetEditorState();
      onCroppedImageChange(null);
    }

    setIsModalOpen(false);
  }

  function handleConfirmCrop() {
    onCroppedImageChange(croppedPreview);
    setAppliedFileName(file?.name || null);
    setIsModalOpen(false);
  }

  function handleMouseDown(event: ReactMouseEvent<HTMLDivElement>) {
    if (!previewUrl) {
      return;
    }

    event.preventDefault();
    dragStateRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: constrainedPosition.x,
      startY: constrainedPosition.y,
    };
    setIsDragging(true);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
          {label}
        </label>
        <label className="flex min-h-[50px] w-full cursor-pointer items-center justify-between rounded-xl border border-gray-500 bg-black px-4 py-3 text-gray-300">
          <span className="truncate text-sm">
            {appliedFileName || 'Nenhum arquivo selecionado'}
          </span>
          <span className="flex shrink-0 items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-black">
            <IoCloudUploadOutline className="h-4 w-4" />
            <span>Choose File</span>
          </span>
          <input
            type="file"
            accept=".png,.svg,image/png,image/svg+xml"
            onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex items-end">
        {file ? (
          <div className="flex min-h-[50px] w-full flex-col justify-center px-1 py-3 text-gray-100">
            <span className="truncate text-sm">{appliedFileName || file.name}</span>
            <span className="mt-1 text-sm text-gray-300">
              {formatFileSize(file.size)}
            </span>
          </div>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>

      <Modal isOpen={isModalOpen && !!previewUrl} onClose={handleCloseModal}>
        <div className="flex flex-col items-center gap-5">
          <div>
            <h3 className="text-center text-lg font-semibold uppercase text-gray-100">
              Ajustar logo
            </h3>
            <p className="mt-2 text-center text-sm text-gray-300">
              Arraste a imagem e ajuste o zoom para enquadrar melhor o logo.
            </p>
          </div>

          {previewUrl && (
            <div
              className={`relative h-[240px] w-[240px] overflow-hidden rounded-2xl border border-gray-500 bg-neutral-950 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
            >
              <NextImage
                src={previewUrl}
                alt="Preview do logo da empresa"
                unoptimized
                width={PREVIEW_SIZE}
                height={PREVIEW_SIZE}
                className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
                style={{
                  width: imageBounds ? `${imageBounds.width * zoom}px` : undefined,
                  height: imageBounds ? `${imageBounds.height * zoom}px` : undefined,
                  transform: `translate(calc(-50% + ${constrainedPosition.x}px), calc(-50% + ${constrainedPosition.y}px))`,
                }}
              />
            </div>
          )}

          <div className="w-full">
            <div className="mb-2 flex items-center justify-between text-sm text-gray-300">
              <span>Zoom</span>
              <span>{Math.round((zoom || 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min={imageBounds ? Math.max(PREVIEW_SIZE / imageBounds.width, PREVIEW_SIZE / imageBounds.height) : 1}
              max={imageBounds ? Math.max(PREVIEW_SIZE / imageBounds.width, PREVIEW_SIZE / imageBounds.height) * 3 : 3}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
            />
          </div>

          <div className="flex w-full justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="rounded-md border border-gray-500 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmCrop}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-black transition hover:bg-white"
            >
              Usar imagem
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
