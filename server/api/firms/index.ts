// server/api/firms/index.ts
import { defineEventHandler, readBody, getQuery, createError } from 'h3';
import Firm from '../../models/Firm';
import { verifyToken } from '@/server/utils/auth';

export default defineEventHandler(async (event) => {
  // Verify authentication for all requests except GET
  if (event.node.req.method !== 'GET') {
    const user = await verifyToken(event);
    
    // Only admins can create/update/delete firms
    if (user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Only admins can manage firms'
      });
    }
  }

  // GET - List firms or search by name
  if (event.node.req.method === 'GET') {
    const query = getQuery(event);
    const searchTerm = query.search as string;
    
    let firmQuery = {};
    
    // If search term is provided, use it to filter firms
    if (searchTerm) {
      firmQuery = {
        name: { $regex: searchTerm, $options: 'i' } // Case-insensitive search
      };
    }
    
    const firms = await Firm.find(firmQuery).sort({ name: 1 }).limit(20);
    return firms;
  }
  
  // POST - Create a new firm
  if (event.node.req.method === 'POST') {
    const user = await verifyToken(event);
    const { name, code, description, status } = await readBody(event);
    
    if (!name || !code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and code are required'
      });
    }
    
    // Check if firm with same name or code already exists
    const existingFirm = await Firm.findOne({ $or: [{ name }, { code }] });
    if (existingFirm) {
      throw createError({
        statusCode: 400,
        statusMessage: 'A firm with this name or code already exists'
      });
    }
    
    // If the request is from an admin, use the provided status or default to 'approved'
    // If the request is from a regular user (via registration), set status to 'pending'
    const firmStatus = user && user.role === 'admin' ? (status || 'approved') : 'pending';
    
    const firm = new Firm({ 
      name, 
      code, 
      description, 
      status: firmStatus 
    });
    await firm.save();
    
    return { 
      message: firmStatus === 'pending' ? 'Firm created and pending approval' : 'Firm created successfully', 
      firm 
    };
  }
  
  // PUT - Update a firm
  if (event.node.req.method === 'PUT') {
    const { id, name, code, description } = await readBody(event);
    
    if (!id || (!name && !code && !description)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Firm ID and at least one field to update are required'
      });
    }
    
    const firm = await Firm.findById(id);
    if (!firm) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Firm not found'
      });
    }
    
    // Update fields if provided
    if (name) firm.name = name;
    if (code) firm.code = code;
    if (description !== undefined) firm.description = description;
    
    await firm.save();
    
    return { message: 'Firm updated successfully', firm };
  }
  
  // DELETE - Delete a firm
  if (event.node.req.method === 'DELETE') {
    const { id } = await readBody(event);
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Firm ID is required'
      });
    }
    
    const result = await Firm.findByIdAndDelete(id);
    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Firm not found'
      });
    }
    
    return { message: 'Firm deleted successfully' };
  }
});