import { Member, Payment, Attendance, Plan } from '../types';

// Export data to CSV format
export function exportToCSV(data: any[], filename: string, headers: string[]) {
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const key = header.toLowerCase().replace(/ /g, '_');
      let val = row[key];
      
      // Handle nested or complex fields
      if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val);
      }
      
      // Clean string values to avoid CSV issues
      const escaped = ('' + (val ?? '')).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  // Create Blob and trigger download
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate pre-populated WhatsApp reminder URL
export function generateWhatsAppLink(mobile: string, name: string, amount: number, dueDate: string, gymName: string, template: string) {
  // Clean mobile number (keep only digits)
  const cleanMobile = mobile.replace(/\D/g, '');
  
  // Parse template variables
  let message = template
    .replace(/{name}/g, name)
    .replace(/{amount}/g, amount.toString())
    .replace(/{dueDate}/g, dueDate)
    .replace(/{gymName}/g, gymName)
    .replace(/{qrUrl}/g, 'FitTrack-Pass');
    
  const encodedText = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${cleanMobile}&text=${encodedText}`;
}

// Trigger browser print for dynamic receipt
export function printReceipt(payment: Payment, gymConfig: { name: string, mobile: string, address: string }) {
  const printWindow = window.open('', '_blank', 'width=600,height=600');
  if (!printWindow) {
    alert('Please allow popups to print/download the receipt.');
    return;
  }
  
  const receiptHTML = `
    <html>
      <head>
        <title>Receipt - ${payment.receiptNumber}</title>
        <style>
          body {
            font-family: 'Inter', Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 40px;
            background-color: #fff;
          }
          .receipt-container {
            border: 2px solid #D4AF37;
            border-radius: 8px;
            padding: 30px;
            max-width: 500px;
            margin: 0 auto;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .header h1 {
            color: #111;
            font-size: 24px;
            margin: 0 0 5px 0;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .header h1 span {
            color: #D4AF37;
          }
          .header p {
            margin: 3px 0;
            font-size: 13px;
            color: #666;
          }
          .title {
            text-align: center;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #D4AF37;
            letter-spacing: 0.5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 8px;
          }
          .info-row .label {
            color: #71717a;
            font-weight: 500;
          }
          .info-row .value {
            color: #18181b;
            font-weight: 600;
            text-align: right;
          }
          .total-box {
            background-color: #000;
            color: #fff;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
            margin-top: 25px;
          }
          .total-box p {
            margin: 0;
            font-size: 12px;
            color: #a1a1aa;
            text-transform: uppercase;
          }
          .total-box h2 {
            margin: 5px 0 0 0;
            font-size: 28px;
            color: #D4AF37;
            font-weight: 800;
          }
          .footer {
            text-align: center;
            margin-top: 35px;
            font-size: 12px;
            color: #71717a;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
          .signature-space {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            font-size: 12px;
            color: #71717a;
          }
          .sig-line {
            border-top: 1px solid #a1a1aa;
            width: 120px;
            text-align: center;
            padding-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <h1>Fit<span>Track</span></h1>
            <p>${gymConfig.name}</p>
            <p>${gymConfig.address}</p>
            <p>Ph: ${gymConfig.mobile}</p>
          </div>
          
          <div class="title">OFFICIAL PAYMENT RECEIPT</div>
          
          <div class="info-row">
            <span class="label">Receipt No:</span>
            <span class="value">${payment.receiptNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Date Paid:</span>
            <span class="value">${payment.paymentDate}</span>
          </div>
          <div class="info-row">
            <span class="label">Member Name:</span>
            <span class="value">${payment.memberName}</span>
          </div>
          <div class="info-row">
            <span class="label">Member ID:</span>
            <span class="value">${payment.memberId}</span>
          </div>
          <div class="info-row">
            <span class="label">Membership Plan:</span>
            <span class="value">${payment.planName}</span>
          </div>
          <div class="info-row">
            <span class="label">Valid Until:</span>
            <span class="value">${payment.dueDate}</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value" style="color: #10b981;">PAID</span>
          </div>
          
          <div class="total-box">
            <p>Total Amount Received</p>
            <h2>₹${payment.amount}.00</h2>
          </div>
          
          <div class="signature-space">
            <div>
              <div style="height: 30px;"></div>
              <div class="sig-line">Member Signature</div>
            </div>
            <div>
              <div style="height: 30px; text-align: center; color: #D4AF37; font-family: cursive;">Authorized</div>
              <div class="sig-line">Manager Signature</div>
            </div>
          </div>
          
          <div class="footer">
            Thank you for being part of FitTrack! Stay Strong.
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;
  
  printWindow.document.write(receiptHTML);
  printWindow.document.close();
}

// Backup app state to file
export function backupState(state: {
  members: Member[];
  plans: Plan[];
  payments: Payment[];
  attendance: Attendance[];
  notifications: any[];
  gymConfig: any;
}) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const link = document.createElement('a');
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `fittrack_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
