import nodemailer from 'nodemailer';
import type { Lead } from '@shared/schema';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    // Check for email configuration
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (emailHost && emailPort && emailUser && emailPass) {
      this.config = {
        host: emailHost,
        port: parseInt(emailPort),
        secure: parseInt(emailPort) === 465,
        auth: {
          user: emailUser,
          pass: emailPass
        }
      };

      this.transporter = nodemailer.createTransport(this.config);
      console.log('Email service initialized with SMTP configuration');
    } else if (process.env.NODE_ENV === 'development') {
      this.createTestAccount();
    } else {
      console.log('Email service not configured - email notifications disabled');
    }
  }

  private async createTestAccount(): Promise<void> {
    try {
      const testAccount = await nodemailer.createTestAccount();
      
      this.config = {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      };

      this.transporter = nodemailer.createTransport(this.config);
      console.log('Email service initialized with Ethereal test account');
    } catch (error) {
      console.error('Failed to create test email account:', error);
    }
  }

  public isConfigured(): boolean {
    return this.transporter !== null;
  }

  public async sendLeadNotification(lead: Lead, recipientEmail: string = 'leads@bjorkhomes.com'): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const subject = `New Lead: ${lead.firstName} ${lead.lastName} - ${lead.interest || 'General Inquiry'}`;
      
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New Lead Notification</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
              .content { background: #f9f9f9; padding: 20px; }
              .lead-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
              .label { font-weight: bold; color: #2c3e50; }
              .value { margin-left: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Lead Notification</h1>
                <p>BjorkHomes.com</p>
              </div>
              
              <div class="content">
                <h2>Lead Details</h2>
                
                <div class="lead-info">
                  <p><span class="label">Name:</span><span class="value">${lead.firstName} ${lead.lastName}</span></p>
                  <p><span class="label">Email:</span><span class="value">${lead.email}</span></p>
                  ${lead.phone ? `<p><span class="label">Phone:</span><span class="value">${lead.phone}</span></p>` : ''}
                  ${lead.interest ? `<p><span class="label">Interest:</span><span class="value">${lead.interest.charAt(0).toUpperCase() + lead.interest.slice(1)}</span></p>` : ''}
                  ${lead.propertyAddress ? `<p><span class="label">Property:</span><span class="value">${lead.propertyAddress}</span></p>` : ''}
                  <p><span class="label">Date:</span><span class="value">${new Date(lead.createdAt!).toLocaleString()}</span></p>
                </div>
                
                ${lead.message ? `
                  <div class="lead-info">
                    <p class="label">Message:</p>
                    <p style="margin-top: 10px; padding: 10px; background: #ecf0f1; border-radius: 3px;">${lead.message}</p>
                  </div>
                ` : ''}
              </div>
            </div>
          </body>
        </html>
      `;

      const text = `
New Lead Notification - BjorkHomes.com

Lead Details:
Name: ${lead.firstName} ${lead.lastName}
Email: ${lead.email}
${lead.phone ? `Phone: ${lead.phone}` : ''}
${lead.interest ? `Interest: ${lead.interest.charAt(0).toUpperCase() + lead.interest.slice(1)}` : ''}
${lead.propertyAddress ? `Property: ${lead.propertyAddress}` : ''}
Date: ${new Date(lead.createdAt!).toLocaleString()}

${lead.message ? `Message: ${lead.message}` : ''}
      `;

      const mailOptions = {
        from: this.config?.auth.user || 'noreply@bjorkhomes.com',
        to: recipientEmail,
        subject,
        html,
        text
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('Lead notification sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };

    } catch (error) {
      console.error('Failed to send lead notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async sendLeadConfirmation(lead: Lead): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const subject = `Thank you for your interest - BjorkHomes.com`;
      
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Thank You for Your Interest</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
              .content { background: #f9f9f9; padding: 20px; }
              .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div style="font-size: 24px; font-weight: bold;">BjorkHomes.com</div>
                <p>Luxury Real Estate in Omaha & Lincoln, Nebraska</p>
              </div>
              
              <div class="content">
                <h2>Thank You, ${lead.firstName}!</h2>
                
                <div class="info-box">
                  <p>Thank you for your interest in our luxury real estate services. We have received your inquiry and a member of our team will contact you within 24 hours.</p>
                  
                  <h3>Your Inquiry Details:</h3>
                  <ul>
                    ${lead.interest ? `<li><strong>Interest:</strong> ${lead.interest.charAt(0).toUpperCase() + lead.interest.slice(1)}</li>` : ''}
                    ${lead.propertyAddress ? `<li><strong>Property:</strong> ${lead.propertyAddress}</li>` : ''}
                  </ul>
                </div>
                
                <div class="info-box">
                  <h3>What's Next?</h3>
                  <ul>
                    <li>A qualified agent will review your inquiry</li>
                    <li>We'll contact you via ${lead.phone ? 'phone or email' : 'email'} within 24 hours</li>
                    <li>We'll provide personalized property recommendations</li>
                    <li>Schedule a consultation that fits your schedule</li>
                  </ul>
                </div>
                
                <div class="info-box">
                  <h3>Contact Information</h3>
                  <p><strong>Email:</strong> info@bjorkhomes.com</p>
                  <p><strong>Phone:</strong> (402) 555-0123</p>
                  <p><strong>Website:</strong> www.bjorkhomes.com</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      const text = `
Thank You for Your Interest - BjorkHomes.com

Dear ${lead.firstName},

Thank you for your interest in our luxury real estate services. We have received your inquiry and a member of our team will contact you within 24 hours.

Your Inquiry Details:
${lead.interest ? `Interest: ${lead.interest.charAt(0).toUpperCase() + lead.interest.slice(1)}` : ''}
${lead.propertyAddress ? `Property: ${lead.propertyAddress}` : ''}

What's Next?
- A qualified agent will review your inquiry
- We'll contact you via ${lead.phone ? 'phone or email' : 'email'} within 24 hours
- We'll provide personalized property recommendations
- Schedule a consultation that fits your schedule

Contact Information:
Email: info@bjorkhomes.com
Phone: (402) 555-0123
Website: www.bjorkhomes.com

BjorkHomes.com - Your Luxury Real Estate Partner
Serving Omaha, Lincoln, and surrounding areas
      `;

      const mailOptions = {
        from: this.config?.auth.user || 'noreply@bjorkhomes.com',
        to: lead.email,
        subject,
        html,
        text
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('Lead confirmation sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };

    } catch (error) {
      console.error('Failed to send lead confirmation:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export const emailService = new EmailService();