import Paragraph from '../models/Paragraph.js';

export const INITIAL_PARAGRAPHS = [
  {
    title: "Customer Order Processing",
    content: "A customer order processing team receives purchase information from different channels, including email, online forms, telephone calls, and sales representatives. Each order must be entered into the system accurately before it is forwarded to the fulfillment team. The operator is required to verify the customer name, order number, product description, quantity, unit price, delivery address, contact number, and expected delivery date. For example, order number ORD-58241 contains three units of a wireless keyboard priced at ₹1,249 per unit, while order ORD-58257 contains five USB adapters priced at ₹399 each. Before submitting the order, the operator should confirm that the quantity and total amount are correct. If the delivery address is incomplete or the customer contact number contains fewer digits than expected, the record should be placed on hold for verification. Operators must also check whether the same order has already been entered into the system. Incorrect entries can result in delayed shipments, incorrect invoices, or customer complaints. Therefore, accuracy, attention to detail, and adherence to the standard operating procedure are essential when processing customer orders."
  },
  {
    title: "Employee Attendance",
    content: "The HR operations team maintains daily attendance records for employees working across different departments. Attendance information is received through biometric systems, employee portals, and approved attendance sheets. The data entry associate is responsible for updating the attendance records accurately and identifying any missing or unusual entries. Each record may include the employee ID, employee name, department, date, login time, logout time, attendance status, and approved leave details. For example, employee ID EMP1048 recorded a login time of 09:12 AM and logout time of 06:04 PM on September 18, 2026. The employee was marked as present for the day. If an employee has no login record but has an approved leave request, the attendance status should be updated according to the applicable HR policy. Any discrepancy between the biometric record and the approved attendance information should be flagged for verification. Operators must carefully distinguish between regular attendance, work-from-home, leave, half-day, and holiday records. Accurate attendance data is important because it may be used for payroll processing, leave balances, compliance reports, and employee records."
  },
  {
    title: "E-commerce Orders",
    content: "The e-commerce operations team processes customer orders received through the company website and mobile application. Each order contains information that must be entered and verified before it is sent to the warehouse for fulfillment. The operator should check the order ID, customer name, product code, product description, quantity, price, shipping address, contact number, and expected delivery date. Order EC-458721 was placed by Priya Nair on September 27, 2026, for two Bluetooth speakers priced at ₹2,499 each. The customer selected standard delivery to 18 Lake View Road, Coimbatore, Tamil Nadu, 641018. The expected delivery date is October 2, 2026. Before submitting the record, the operator should confirm that the quantity, product code, and total amount match the original order. If the system displays a different price or an incorrect delivery address, the issue should be escalated before processing. Operators should also check for duplicate orders and cancelled transactions. Accurate order processing is important because incorrect information can result in wrong products being shipped, delayed deliveries, incorrect billing, or customer complaints."
  },
  {
    title: "Insurance Claims",
    content: "The insurance operations team receives claim forms from customers and authorized representatives. Each claim must be entered into the processing system using the information provided in the original documents. The operator may need to enter the claim number, policy number, customer name, incident date, claim type, location, estimated amount, and supporting document details. Claim number CLM-904521 belongs to policy POL-7782451, registered under Suresh Rajan. The incident was reported on September 16, 2026, and the estimated claim amount is ₹86,500. The claim relates to vehicle damage following an accident near Salem, Tamil Nadu. The operator must carefully compare the information in the claim form with the details available in the system. Particular attention should be given to policy numbers, dates, registration numbers, and financial amounts. If the submitted documents contain incomplete or conflicting information, the record should be placed on hold and referred to the verification team. Employees must not approve, reject, or modify claim values unless they are specifically authorized to do so. Accurate data entry ensures that claims can be reviewed and processed efficiently."
  },
  {
    title: "Vendor Registration",
    content: "The procurement team registers new vendors in the company's supplier management system. The data entry associate is responsible for entering information provided in the vendor registration and KYC documents. Required details may include the company name, contact person, registered address, phone number, email address, tax identification number, bank account details, and service category. Vendor registration request VEN-260928 was submitted by Southline Technologies on September 28, 2026. The primary contact is Karthik Srinivasan, and the registered email address is [accounts@southlinetech.example](mailto:accounts@southlinetech.example). The vendor provides IT infrastructure and technical support services. Before entering the information, the operator should ensure that the submitted documents are complete and readable. Company names and identification numbers must be entered exactly as provided. Bank account information should be checked carefully because an incorrect digit may cause payment failures. If the documents contain conflicting information, the operator should not make assumptions or modify the details independently. The record should instead be sent to the appropriate verification team. Vendor information is confidential and should only be accessed and shared through approved company systems."
  }
];

export const seedParagraphs = async () => {
  try {
    const count = await Paragraph.countDocuments();
    if (count === 0) {
      await Paragraph.insertMany(INITIAL_PARAGRAPHS);
      console.log('Successfully seeded 5 initial assessment paragraphs with titles into MongoDB.');
    } else {
      console.log(`Paragraph collection already populated (${count} paragraphs in DB).`);
    }
  } catch (error) {
    console.error('Error seeding paragraphs:', error);
  }
};
