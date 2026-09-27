import { supabase } from "@/lib/supabase";

const BUCKET = "patient-images";
// Signed links stop working after this long, so a copied link can't be
// shared around. One hour covers any normal time spent on the page.
const SIGNED_LINK_SECONDS = 60 * 60;

// Same values as the database check on patient_images.image_type.
export const IMAGE_TYPES = [
  { value: "panoramic", label: "Panoramic" },
  { value: "periapical", label: "Periapical" },
  { value: "bitewing", label: "Bitewing" },
  { value: "cephalometric", label: "Cephalometric" },
  { value: "occlusal", label: "Occlusal" },
];

// Must match the bucket's allowed types and size limit in Supabase.
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

// Images listed newest first, each with a temporary link for <img src>.
export async function fetchPatientImages(patientId) {
  const { data: images, error } = await supabase
    .from("patient_images")
    .select("id, storage_path, file_name, image_type, created_at")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Could not load images for patient ${patientId}:`, error);
    throw error;
  }
  if (images.length === 0) return [];

  const { data: links, error: linkError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(
      images.map((image) => image.storage_path),
      SIGNED_LINK_SECONDS,
    );

  if (linkError) {
    console.error(`Could not create image links for patient ${patientId}:`, linkError);
    throw linkError;
  }
  // A file missing from storage gets url null; the page shows a placeholder.
  return images.map((image, index) => ({ ...image, url: links[index]?.signedUrl || null }));
}

// "IMG 001 (final).JPG" -> "img-001-final-.jpg": storage paths can't take
// every character, and the original name is kept separately for display.
function toSafeFileName(fileName) {
  return fileName.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
}

// Upload the file first, then record it. If recording fails, the file is
// removed again so storage doesn't fill with files no page can list.
export async function uploadPatientImage(patientId, file, imageType) {
  const storagePath = `${patientId}/${crypto.randomUUID()}-${toSafeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { contentType: file.type });

  if (uploadError) {
    console.error(`Could not upload ${file.name} for patient ${patientId}:`, uploadError);
    throw uploadError;
  }

  const { error: recordError } = await supabase.from("patient_images").insert({
    patient_id: patientId,
    storage_path: storagePath,
    file_name: file.name,
    image_type: imageType || null,
  });

  if (recordError) {
    console.error(`Uploaded ${file.name} but couldn't record it; removing the file:`, recordError);
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw recordError;
  }
}

// Remove the record first so the image disappears from the page even if
// the file removal fails; a leftover file is harmless, a broken row isn't.
export async function deletePatientImage(image) {
  const { error } = await supabase.from("patient_images").delete().eq("id", image.id);
  if (error) {
    console.error(`Could not delete image ${image.id}:`, error);
    throw error;
  }

  const { error: fileError } = await supabase.storage.from(BUCKET).remove([image.storage_path]);
  if (fileError) {
    console.error(`Image ${image.id} removed from the list, but its file is still in storage:`, fileError);
  }
}
