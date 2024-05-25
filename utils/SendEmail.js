import * as MailComposer from "expo-mail-composer";

const sendEmail = async (name) => {
    try {
        let available = await MailComposer.isAvailableAsync();
        if (available) {
            const emailOptions = {
                recipients: [],
                subject: "Informace o hledané osobě",
                body: `Mám informace o hledané osobě: ${name}`,
            };
            await MailComposer.composeAsync(emailOptions);
        } else {
            console.log("e-mail není konfigurován na tomto zařízení.");
        }
    } catch (error) {
        console.error("Error composing email:", error);
        throw error;
    }
};

export default sendEmail;
