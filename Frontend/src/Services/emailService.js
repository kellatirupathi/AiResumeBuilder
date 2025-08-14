import emailjs from '@emailjs/browser';
import { 
  EMAILJS_SERVICE_ID, 
  EMAILJS_TEMPLATE_ID, 
  EMAILJS_PUBLIC_KEY 
} from '@/config/config';
import { toast } from 'sonner';

export const sendWelcomeEmail = async (userData) => {
  // Log 1: Check if the function is called with correct data
  console.log("Attempting to send welcome email to:", userData.email);

  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.error("EmailJS credentials are not set correctly in your .env.local file.");
    toast.error("Email service is not configured.", {
      description: "Could not send welcome email due to missing credentials."
    });
    return;
  }

  const templateParams = {
    user_name: userData.fullName, // Use user_name to match your template
    to_name: userData.fullName, // Keep to_name as well, for the email body
    user_email: userData.email, // Use user_email to match your template
    from_name: 'AI Resume Builder Team',
  };

  // Log 2: Check the parameters being sent
  console.log("EmailJS Template Params:", templateParams);
  
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      { publicKey: EMAILJS_PUBLIC_KEY }
    );

    console.log('SUCCESS! Email sent.', response.status, response.text);
    toast.success("A welcome email has been sent successfully!");
  } catch (error) {
    console.error('FAILED to send welcome email...', error);
    toast.error("Failed to send welcome email.", {
      description: `Error: ${error.text || error.message || 'Unknown error'}. Please check your console and EmailJS dashboard.`
    });
  }
};
