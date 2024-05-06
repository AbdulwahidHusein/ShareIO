import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase/app';
import { getDownloadURL, ref, uploadBytes , getStorage} from 'firebase/storage';
storage = getStorage();

export const pickImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (result.cancelled) {
      return null;
    }
    
    return result.assets[0].uri;
  } catch (error) {
    throw error;
  }
};

export async function uploadImage(imageUri) {
  try {
    const response = await fetch(imageUri)
    const blobFile = await response.blob()

    const reference = ref(storage, "your_name.jpg")
    const result = await uploadBytes(reference, blobFile)
    const url = await getDownloadURL(result.ref)

    return url
  } catch (err) {
    return Promise.reject(err)
}
}