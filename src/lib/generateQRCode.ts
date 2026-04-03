import QRCode from 'qrcode';

/**
 * Generates a high-quality QR code as a base64 PNG data URI.
 * 
 * @param url The verification URL or text to encode
 * @returns A Promise resolving to the base64 data URI string
 */
export const generateQRCodeBase64 = async (url: string): Promise<string> => {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      margin: 2,
      scale: 6,
      width: 300, // Explicit width ensures high resolution
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch (error) {
    console.error('QR Code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
};
