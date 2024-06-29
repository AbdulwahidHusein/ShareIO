import { getDownloadURL, ref, uploadBytes, getStorage } from 'firebase/storage';
import { Alert } from 'react-native';
import mime from "mime";
import firebaseConfig from './firebaseConfig';

const storage = getStorage();

export async function uploadFiles(fileUris, userId) {
  try {
    const uploadPromises = fileUris.map(async (uri, index) => {
      const response = await fetch(uri);
      const blobFile = await response.blob();

      const mimeType = mime.getType(uri);

      const path = `files/${userId}/${new Date().getTime()}_${index}.${mimeType.split("/")[1]}`;
      const reference = ref(storage, path);

      const result = await uploadBytes(reference, blobFile, { contentType: mimeType });
      
      const url = await getDownloadURL(result.ref);
      return url;
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    return uploadedFiles;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function uploadFiles2(fileData, userId) {
  try {
    const uploadPromises = fileData.map(async ([uri, name, size]) => {
      const response = await fetch(uri);
      const blobFile = await response.blob();

      const mimeType = mime.getType(uri);

      const path = `files/${userId}/${new Date().getTime()}_${name}`;
      const reference = ref(storage, path);

      const result = await uploadBytes(reference, blobFile, { contentType: mimeType });
      
      const url = await getDownloadURL(result.ref);
      return { downloadURL: url, name, size };
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    return uploadedFiles;
  } catch (err) {
    return Promise.reject(err);
  }
}