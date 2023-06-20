import { computed, ref } from "vue";
import { useFirebaseStorage } from "vuefire";
import { uid } from "uid";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";

export default function useImage() {
  const storage = useFirebaseStorage();

  const compressImage = async (
    file: File,
    { quality = 1, type = file.type }
  ) => {
    const imageBitmap = await createImageBitmap(file);

    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(imageBitmap, 0, 0);

    const blob = (await new Promise((resolve: BlobCallback) =>
      canvas.toBlob(resolve, type, quality)
    )) as BlobPart;

    return new File([blob], file.name, {
      type: file.type,
    });
  };

  const propertyImage = ref("");

  const uploadImage = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files as FileList;

    const compressedFile = await compressImage(files[0], {
      quality: 0.4,
      type: "image/webp",
    });

    const fileRef = storageRef(storage, `/properties/${uid()}.webp`);

    await uploadBytes(fileRef, compressedFile)
      .then(() => {
        getDownloadURL(fileRef).then(url => {
          propertyImage.value = url;
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  const imageUrl = computed(() => {
    return propertyImage.value;
  });

  return { uploadImage, imageUrl };
}
