import * as MailComposer from "expo-mail-composer";

const sendEmailWithPhoto = async (photoUri) => {
    let available = await MailComposer.isAvailableAsync();
    if (available) {
        const emailOptions = {
            recipients: [],
            subject: "Někoho jsme našli",
            body: "Tady ho máte:",
            attachments: [photoUri],
        };
        await MailComposer.composeAsync(emailOptions);
    } else {
        console.log("e-mail není konfigurován na tomto zařízení.");
    }
};

export default sendEmailWithPhoto;