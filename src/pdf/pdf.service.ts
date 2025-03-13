import { Injectable } from '@nestjs/common';
import { jsPDF } from 'jspdf';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class PdfService {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
  }

  async generateInvoicePdf(invoiceData: any): Promise<string> {
    const { invoiceNumber, date, customer, items } = invoiceData;
    const doc = new jsPDF();

    // **Invoice Header**
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('INVOICE', 105, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice No: ${invoiceNumber}`, 10, 25);
    doc.text(`Date: ${date}`, 150, 25);

    // **Customer Details**
    doc.setFont('helvetica', 'bold');
    doc.setFont('helvetica', 'normal');
    doc.text(`Name:${customer.name}`, 10, 40);
    doc.text(`Email:${customer.email}`, 10, 45);

    // **Table Header Styling**
    let y = 80;
    doc.setFillColor(200, 200, 200); // Light gray background
    doc.rect(10, y - 5, 190, 8, 'F'); // Background color for headers

    doc.setFont('helvetica', 'bold');
    doc.text('Item', 10, y);
    doc.text('Qty', 80, y);
    doc.text('Price', 110, y);
    doc.text('GST (12%)', 140, y);
    doc.text('Total', 170, y);
    doc.line(10, y + 2, 200, y + 2); 

    // **List Items with GST Calculation**
    doc.setFont('helvetica', 'normal');
    y += 10;
    items.forEach((item) => {
      const gstAmount = item.price * 0.12;
      const totalWithGst = item.price + gstAmount;

      doc.text(item.name, 10, y);
      doc.text(item.quantity.toString(), 80, y);
      doc.text(`${item.price.toFixed(2)}`, 110, y);
      doc.text(`${gstAmount.toFixed(2)}`, 140, y);
      doc.text(`${(totalWithGst * item.quantity).toFixed(2)}`, 170, y);
      y += 10;
    });

    // **Total Amount**
    doc.line(10, y, 200, y); // Line before total
    y += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    // Convert PDF to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Upload to S3
    const fileName = `invoices/invoice-${invoiceNumber}.pdf`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
        ACL: 'public-read',
      }),
    );

    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  }
}
