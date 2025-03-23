// server/api/users/index.ts
import { defineEventHandler, readBody, createError } from 'h3';
import User from '../../models/User';
import { verifyToken } from '@/server/utils/auth';
import { Types } from 'mongoose';

interface UserDocument {
  _id: Types.ObjectId;
  role: string;
  status?: string;
  save(): Promise<UserDocument>;
}

export default defineEventHandler(async (event) => {
  // Verify admin authentication for all requests
  const user = await verifyToken(event);
  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only admins can manage users'
    });
  }

  // GET - List all users
  if (event.node.req.method === 'GET') {
    const users = await User.find()
      .select('-password')
      .populate('firmId', 'name code')
      .sort({ createdAt: -1 });
    return { users };
  }

  // PUT - Update user role or status
  if (event.node.req.method === 'PUT') {
    const { id, role, status } = await readBody(event);
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      });
    }

    // Find the user
    const targetUser = await User.findById(id) as UserDocument | null;
    if (!targetUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      });
    }

    // Prevent changing own role
    if (targetUser._id.toString() === (user._id as Types.ObjectId).toString()) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot modify your own role'
      });
    }

    // Update role if provided
    if (role) {
      // Validate role
      if (!['user', 'manager', 'admin'].includes(role)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid role'
        });
      }
      targetUser.role = role;
    }

    // Update status if provided
    if (status) {
      // Validate status
      if (!['active', 'inactive'].includes(status)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid status'
        });
      }
      targetUser.status = status;
    }

    await targetUser.save();

    // Return user without password
    const updatedUser = await User.findById(id)
      .select('-password')
      .populate('firmId', 'name code');

    return { 
      message: 'User updated successfully',
      user: updatedUser
    };
  }

  // DELETE - Delete a user
  if (event.node.req.method === 'DELETE') {
    const { id } = await readBody(event);
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      });
    }

    // Prevent self-deletion
    if (id === ((user as { _id: Types.ObjectId })._id).toString()) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot delete your own account'
      });
    }

    const result = await User.findByIdAndDelete(id);
    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      });
    }

    return { message: 'User deleted successfully' };
  }
});