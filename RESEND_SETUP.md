# Setting Up Resend for Password Reset Emails

This project uses [Resend](https://resend.com) for sending password reset emails. Resend is a simple and developer-friendly email API.

## Quick Setup

1. The Resend API key has already been configured in the `.env.development` file.
2. By default, you can send emails from `onboarding@resend.dev` which is provided for testing.
3. The password reset functionality should work out of the box with this configuration.

## Customizing Email Sender

If you want to use your own domain for sending emails:

1. Log in to your [Resend dashboard](https://resend.com/domains)
2. Go to "Domains" and click "Add Domain"
3. Follow the instructions to verify your domain
4. Once verified, update the `RESEND_FROM_EMAIL` in your `.env` file to use your custom domain

## Testing

To test the email functionality:

1. Make sure your server is running with the proper environment variables
2. Use the "Forgot Password" feature in your application
3. You should receive a password reset email at the specified address
4. If you don't receive an email, check the server logs for any error messages

## Helpful Resources

- [Resend Documentation](https://resend.com/docs/introduction)
- [Node.js SDK Documentation](https://resend.com/docs/node)
- [Email Delivery Best Practices](https://resend.com/docs/knowledge-base/email-delivery-guide)
