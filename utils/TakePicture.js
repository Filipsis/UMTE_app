import * as MediaLibrary from "expo-media-library";
import SendEmail from "./SendEmail";

const takePicture = async (cameraRef, pictureTaken, setPictureTaken, setOpenCamera, sendEmailWithPhoto) => {
    if (cameraRef.current && !pictureTaken) {
        setPictureTaken(true);
        setTimeout(async () => {
            try {
                const options = { quality: 0.5, base64: false };
                const data = await cameraRef.current.takePictureAsync(options);
                const asset = await MediaLibrary.createAssetAsync(data.uri);
                console.log('Foto uloženo do galerie:', asset.uri);
                const localUri = await MediaLibrary.getAssetInfoAsync(asset);
                console.log('Lokální URI souboru:', localUri.localUri);
                await SendEmail(localUri.localUri);
            } catch (error) {
                console.log('Nepodařilo se pořídit foto:', error);
            } finally {
                if (cameraRef.current) {
                    setOpenCamera(false);
                } else {
                    console.log('Kamera není dostupná.')
                }
            }
        }, 800);
    }
};

export default takePicture;