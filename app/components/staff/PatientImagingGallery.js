"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, Trash2, Upload, X } from "lucide-react";
import {
  fieldClass,
  labelClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./staffStyles";
import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  deletePatientImage,
  uploadPatientImage,
} from "@/lib/patientImages";

// Based on Zyrel's Imaging Gallery design (part-ni-zyrel branch), now saving
// to Supabase storage instead of only the browser. Any patient image (X-rays,
// intraoral photos, ...); the optional type names the X-ray kind when it is one.

const VISIBLE_LIMIT = 6;

function getTypeLabel(image) {
  const type = IMAGE_TYPES.find((item) => item.value === image.image_type);
  return type ? type.label : "Image";
}

function formatUploadDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Checked before uploading so staff get a clear reason instead of a
// storage error. The bucket enforces the same limits.
function findProblemFile(files) {
  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `${file.name} isn't a JPG, PNG or WebP image.`;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return `${file.name} is larger than 10 MB.`;
    }
  }
  return null;
}

// The patient page loads the images once and passes them in, because the
// visit timeline shows the same images under the day they were taken.
// loadState: "loading" | "ready" | "error"; onReload fetches them again.
export default function PatientImagingGallery({ patientId, images, loadState, onReload }) {
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const visible = showAll ? images : images.slice(0, VISIBLE_LIMIT);
  const hiddenCount = images.length - visible.length;

  const handleDeleted = () => {
    setLightboxIndex(null);
    onReload();
  };

  return (
    // Same flat panel and heading as the other sections of the patient page.
    <section className={`${panelClass} p-5`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Imaging Gallery</h2>
          <p className="mt-0.5 text-sm text-gray-600">
            {loadState === "ready"
              ? `${images.length} ${images.length === 1 ? "image" : "images"} on file`
              : "Patient images"}
          </p>
        </div>
        {/* Secondary, so "Book appointment" stays the page's one green action. */}
        <button
          type="button"
          onClick={() => setIsUploadOpen((previous) => !previous)}
          aria-expanded={isUploadOpen}
          className={`${secondaryButtonClass} flex items-center gap-1.5 text-sm`}
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Upload
        </button>
      </div>

      {isUploadOpen && (
        <UploadForm
          patientId={patientId}
          onUploaded={() => {
            setIsUploadOpen(false);
            onReload();
          }}
          onSomeUploaded={onReload}
          onCancel={() => setIsUploadOpen(false)}
        />
      )}

      {loadState === "loading" && (
        <p role="status" className="py-6 text-center text-sm text-gray-600">
          Loading images...
        </p>
      )}

      {loadState === "error" && (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          Images couldn&apos;t be loaded.{" "}
          <button
            type="button"
            onClick={onReload}
            className="font-medium underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#00685F]"
          >
            Try again
          </button>
        </div>
      )}

      {loadState === "ready" && images.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-600">
          No images yet. Use Upload to add them.
        </div>
      )}

      {loadState === "ready" && images.length > 0 && (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {visible.map((image, index) => (
            <li key={image.id}>
              <ImageThumbnail image={image} onOpen={() => setLightboxIndex(index)} />
            </li>
          ))}
        </ul>
      )}

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-[#00685F]"
        >
          Show {hiddenCount} more
        </button>
      )}
      {showAll && images.length > VISIBLE_LIMIT && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="mt-2 w-full rounded-lg py-2 text-sm font-medium text-gray-600 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-[#00685F]"
        >
          Show fewer
        </button>
      )}

      {/* The viewer gets every image, not only the ones shown, so the arrows
          reach all of them. The shown ones are the first few of the same
          list, so a thumbnail's position is the same in both. */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <ImageLightbox
          images={images}
          index={lightboxIndex}
          onChangeIndex={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onDeleted={handleDeleted}
        />
      )}
    </section>
  );
}

/* ---------- Thumbnail (also used by the visit timeline) ---------- */
export function ImageThumbnail({ image, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full overflow-hidden rounded-lg border border-gray-200 text-left hover:border-[#00685F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F]"
    >
      <div className="relative flex h-24 items-center justify-center bg-gray-800">
        <span className="absolute top-2 right-2 rounded bg-white/90 px-1.5 py-0.5 text-xs font-medium text-gray-800">
          {getTypeLabel(image)}
        </span>
        <PatientImage image={image} fit="object-cover" />
      </div>
      <div className="p-2">
        <p className="truncate text-sm font-medium text-gray-900">{image.file_name}</p>
        <p className="truncate text-xs text-gray-600">{formatUploadDate(image.created_at)}</p>
      </div>
    </button>
  );
}

/* ---------- One image ---------- */
// Signed links stop working after an hour, so a page left open longer (or a
// file missing from storage) would show the browser's broken-image icon.
// Instead this shows a placeholder, and the message tells staff to reload.
function PatientImage({ image, fit, showMessage = false }) {
  const [failedUrl, setFailedUrl] = useState(null);
  // Compared by URL so a fresh link after reloading the gallery gets a new try.
  const isBroken = !image.url || failedUrl === image.url;

  if (isBroken) {
    return showMessage ? (
      <p className="px-6 text-center text-sm text-white/80">
        This image couldn&apos;t be shown. Reload the page to try again.
      </p>
    ) : (
      <ImageIcon className="h-8 w-8 text-white/50" aria-hidden="true" />
    );
  }
  return (
    <img
      src={image.url}
      alt={`${getTypeLabel(image)}, uploaded ${formatUploadDate(image.created_at)}`}
      onError={() => setFailedUrl(image.url)}
      className={`h-full w-full ${fit}`}
    />
  );
}

/* ---------- Upload form ---------- */
// onSomeUploaded: called when an upload stopped partway, so the images that
// did save appear in the gallery.
function UploadForm({ patientId, onUploaded, onSomeUploaded, onCancel }) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [imageType, setImageType] = useState("");
  const [problem, setProblem] = useState("");
  const [progress, setProgress] = useState(null); // { done, total } while uploading

  const handleFilesPicked = (event) => {
    const picked = Array.from(event.target.files || []);
    setFiles(picked);
    setProblem(findProblemFile(picked) || "");
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (files.length === 0) {
      setProblem("Choose at least one image.");
      return;
    }
    const fileProblem = findProblemFile(files);
    if (fileProblem) {
      setProblem(fileProblem);
      return;
    }

    setProblem("");
    // One at a time, so a failure says exactly which file didn't make it
    // and the ones before it are already saved.
    for (let index = 0; index < files.length; index += 1) {
      setProgress({ done: index, total: files.length });
      try {
        await uploadPatientImage(patientId, files[index], imageType);
      } catch {
        // The files before this one are already saved. Keep only the rest,
        // so pressing Upload again doesn't save those a second time, and
        // refresh the gallery so the saved ones show up now.
        const remaining = files.slice(index);
        setFiles(remaining);
        if (index > 0) onSomeUploaded();
        setProgress(null);
        setProblem(
          index > 0
            ? `${files[index].name} didn't upload. The first ${index} did and are in the gallery. Check your connection, then press Upload to send the remaining ${remaining.length}.`
            : `${files[index].name} didn't upload. Check your connection and try again.`,
        );
        return;
      }
    }
    setProgress(null);
    onUploaded();
  };

  const isUploading = progress !== null;

  return (
    <form
      onSubmit={handleUpload}
      noValidate
      className="mb-4 flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
    >
      <div>
        <label htmlFor="image-files" className={`${labelClass} mb-1 block`}>
          Images (JPG, PNG or WebP, up to 10 MB each)
        </label>
        <input
          id="image-files"
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          multiple
          onChange={handleFilesPicked}
          className="block w-full text-sm text-gray-800 file:mr-3 file:rounded-lg file:border file:border-gray-400 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium"
        />
      </div>

      <div>
        <label htmlFor="image-type" className={`${labelClass} mb-1 block`}>
          Type (optional)
        </label>
        <select
          id="image-type"
          value={imageType}
          onChange={(event) => setImageType(event.target.value)}
          className={fieldClass()}
        >
          <option value="">General image</option>
          {IMAGE_TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <p role="status" aria-live="polite" className="text-sm">
        {isUploading && (
          <span className="text-gray-700">
            Uploading {progress.done + 1} of {progress.total}...
          </span>
        )}
        {problem && <span className="font-medium text-red-700">{problem}</span>}
      </p>

      {/* Cancel before the main action, like the staff pop-ups. */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isUploading}
          className={`${secondaryButtonClass} text-sm`}
        >
          Cancel
        </button>
        <button type="submit" disabled={isUploading} className={`${primaryButtonClass} text-sm`}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </form>
  );
}

/* ---------- Full-size viewer ---------- */
export function ImageLightbox({ images, index, onChangeIndex, onClose, onDeleted }) {
  const closeButtonRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const image = images[index];
  const hasSeveral = images.length > 1;

  const step = (delta) => {
    setDeleteError("");
    onChangeIndex((index + delta + images.length) % images.length);
  };

  // Focus starts on Close once, when the viewer opens, so keyboard users
  // land inside it (not on every re-render). On closing, focus goes back to
  // the thumbnail that opened it instead of jumping to the top of the page.
  useEffect(() => {
    const openedFrom = document.activeElement;
    closeButtonRef.current?.focus();
    return () => {
      if (openedFrom instanceof HTMLElement && openedFrom.isConnected) openedFrom.focus();
    };
  }, []);

  // Esc closes, arrow keys move between images.
  useEffect(() => {
    const total = images.length;
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (total > 1 && event.key === "ArrowLeft") onChangeIndex((index - 1 + total) % total);
      if (total > 1 && event.key === "ArrowRight") onChangeIndex((index + 1) % total);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [index, images.length, onClose, onChangeIndex]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${image.file_name}? This can't be undone.`)) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deletePatientImage(image);
      onDeleted();
    } catch {
      setDeleteError("The image wasn't deleted. Check your connection and try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${getTypeLabel(image)}: ${image.file_name}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6"
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        aria-label="Close image"
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full p-2 text-white/90 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>

      {hasSeveral && (
        <button
          type="button"
          aria-label="Previous image"
          onClick={(event) => {
            event.stopPropagation();
            step(-1);
          }}
          className="absolute left-2 rounded-full p-2 text-white/90 hover:text-white focus-visible:outline-2 focus-visible:outline-white sm:left-6"
        >
          <ChevronLeft className="h-7 w-7" aria-hidden="true" />
        </button>
      )}

      <div
        className="w-full max-w-3xl overflow-hidden rounded-xl bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-[60vh] items-center justify-center bg-gray-900">
          <PatientImage image={image} fit="object-contain" showMessage />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">{image.file_name}</p>
            <p className="text-sm text-gray-600">
              {getTypeLabel(image)} · uploaded {formatUploadDate(image.created_at)}
              {hasSeveral && ` · ${index + 1} of ${images.length}`}
            </p>
            {deleteError && (
              <p role="alert" className="mt-1 text-sm font-medium text-red-700">
                {deleteError}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 rounded-lg border border-red-700 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-[#00685F] disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {hasSeveral && (
        <button
          type="button"
          aria-label="Next image"
          onClick={(event) => {
            event.stopPropagation();
            step(1);
          }}
          className="absolute right-2 rounded-full p-2 text-white/90 hover:text-white focus-visible:outline-2 focus-visible:outline-white sm:right-6"
        >
          <ChevronRight className="h-7 w-7" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
