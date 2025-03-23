import { MasterRoll } from '../../models/MasterRoll';
import { createError } from 'h3';
import ExcelJS from 'exceljs';
import { readMultipartFormData } from 'h3';

// Convert Excel date number to JavaScript Date
function excelDateToJSDate(excelDate: number) {
  return new Date(Math.round((excelDate - 25569) * 86400 * 1000))
}

export default defineEventHandler(async (event) => {
  
  try {
    // Get userId and firmId from the event context (set by auth middleware)
    const userId = event.context.userId;
    const firmId = event.context.user.firmId;
    
    // Read the uploaded file from multipart form data
    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No file uploaded'
      })
    }
    
    const fileField = formData.find(field => field.name === 'file');
    if (!fileField || !fileField.data) {
      throw createError({
        statusCode: 400,
        message: 'No file found in the request'
      })
    }

 // Convert fileField.data to a proper Node.js Buffer
 let fileBuffer: Buffer;
 if (Buffer.isBuffer(fileField.data)) {
   // If it's already a Buffer, use it directly.
   fileBuffer = fileField.data;
 } else {
   // Otherwise, convert it. This handles cases where
   // fileField.data is typed as Buffer<ArrayBuffer> or similar.
   fileBuffer = Buffer.from(new Uint8Array(fileField.data as any));
 }

    
    // Process the Excel file using ExcelJS
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);
    
    // Get the first worksheet
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw createError({
        statusCode: 400,
        message: 'No worksheet found in the Excel file'
      })
    }
    
    // Convert worksheet to JSON
    const jsonData: any[] = [];
    const headers: string[] = [];
    
    // Extract headers from the first row
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber - 1] = cell.value?.toString() || `Column${colNumber}`;
    });
    
    // Extract data from rows
    worksheet.eachRow((row, rowNumber) => {
      // Skip header row
      if (rowNumber === 1) return;
      
      const rowData: any = {};
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber - 1];
        let value = cell.value;
        
        // Handle date values
        if (cell.type === ExcelJS.ValueType.Date && value instanceof Date) {
          value = value;
        }
        
        rowData[header] = value;
      });
      
      // Only add non-empty rows
      if (Object.keys(rowData).length > 0) {
        jsonData.push(rowData);
      }
    });
    
    if (jsonData.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No employees data found in the Excel file'
      })
    }
    
    console.log('First row data:', jsonData[0]) // Debug log
    
    const employees = jsonData.map((emp: any, index: number) => {
      // Convert date fields
      const dateOfBirth = emp['DOB'] ? 
        (typeof emp['DOB'] === 'number' ? excelDateToJSDate(emp['DOB']) : new Date(emp['DOB'])) : 
        undefined

      const dateOfJoining = emp['D.O.J'] ? 
        (typeof emp['D.O.J'] === 'number' ? excelDateToJSDate(emp['D.O.J']) : new Date(emp['D.O.J'])) : 
        undefined

      const dateOfExit = emp['D.O.E'] ? 
        (typeof emp['D.O.E'] === 'number' ? excelDateToJSDate(emp['D.O.E']) : new Date(emp['D.O.E'])) : 
        undefined

      const employee = {
        employeeName: emp['EMPLOYEE_NAME*'] || emp['EMPLOYEE_NAME'],
        fatherHusbandName: emp["FATHER'S/HUSBAND NAME*"] || emp["FATHER'S/HUSBAND NAME"] || emp['FATHER_HUSBAND_NAME'],
        dateOfBirth,
        aadhar: (emp['AADHAR*'] || emp['AADHAR'])?.toString(),
        pan: emp['PAN'],
        phoneNo: (emp['PHONE NO*'] || emp['PHONE NO'] || emp['PHONE_NO'])?.toString(),
        address: emp['ADDRESS*'] || emp['ADDRESS'],
        bank: emp['BANK*'] || emp['BANK'],
        accountNo: (emp['A/C NO*'] || emp['A/C NO'] || emp['AC_NO'])?.toString(),
        ifsc: emp['IFSC*'] || emp['IFSC'],
        uan: emp['UAN'],
        esicNo: emp['ESIC NO'],
        sKalyanNo: emp['s_kalyan_no'],
        category: emp['category'] || 'UNSKILLED',
        pDayWage: emp['P_DAY_WAGE'],
        project: emp['project'],
        site: emp['site'],
        dateOfJoining,
        dateOfExit,
        doeRem: emp['doe_rem'],
        userId, // Add userId to each employee record
        firmId, // Add firmId to each employee record
        status: emp['status'] || 'active' // Add status field with default value
      }

      // Check required fields for each employee
      const requiredFields = {
        'Employee Name': employee.employeeName,
        'Father\'s/Husband Name': employee.fatherHusbandName,
        'Date of Birth': employee.dateOfBirth,
        'Aadhar': employee.aadhar,
        'Phone No': employee.phoneNo,
        'Address': employee.address,
        'Bank': employee.bank,
        'Account No': employee.accountNo,
        'IFSC': employee.ifsc,
        'Date of Joining': employee.dateOfJoining
      }

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([field]) => field)

      if (missingFields.length > 0) {
        throw createError({
          statusCode: 400,
          message: `Row ${index + 1} is missing required fields: ${missingFields.join(', ')}`
        })
      }

      return employee
    })
    
    await MasterRoll.insertMany(employees)
    
    return {
      message: `Successfully uploaded ${employees.length} employees`
    }
  } catch (error: any) {
    console.error('Upload error details:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error uploading employees'
    })
  }
})
