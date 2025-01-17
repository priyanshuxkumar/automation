import { Resend } from "resend";
import dotenv from "dotenv"

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async(metadata : any) => {
    try {
        await resend.emails.send({
          from: process.env.EMAIL as string,
          to: [metadata.to],
          subject: metadata.subject,
          html: `
                From Name :${metadata.fromname}
                <br/>
                ${metadata.body}
            `,
        });
        return { status: true, message: "Failed to sent message" };
      } catch (error) {
        throw new Error("Failed to send email.");
      }
}

export {sendEmail};