import Document from '../../models/Document'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get userId from the event context (set by auth middleware)
    const userId = event.context.userId;
    const firmId = event.context.user.firmId;

    
    // Handle different HTTP methods
    if (event.method === 'GET') {
      // Get query parameters
      const query = getQuery(event);
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;
      const status = query.status; // 'all', 'active', 'expired', 'expiring-soon'

      // Base query to get documents for the user
      const matchQuery = { firmId };

      // Filter by status if specified
      if (status && status !== 'all') {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        switch (status) {
          case 'active':
            matchQuery.expiryDate = { $gt: today };
            break;
          case 'expired':
            matchQuery.expiryDate = { $lte: today };
            break;
          case 'expiring-soon':
            matchQuery.expiryDate = { $gt: today, $lte: thirtyDaysFromNow };
            break;
          default:
            break;
        }
      }

      // Get total document count
      const totalDocuments = await Document.countDocuments(matchQuery);

      // Calculate total pages
      const totalPages = Math.ceil(totalDocuments / limit);

      // Paginate and sort documents by updatedAt (newest first)
      const documents = await Document.find(matchQuery)
        .sort({ updatedAt: -1 }) // Sort by updatedAt descending
        .skip((page - 1) * limit) // Skip documents for pagination
        .limit(limit); // Limit the number of results
      // Return paginated results with metadata
      return {
        documents,
        pagination: {
          total: totalDocuments,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } else if (event.method === 'POST') {
      // Create a new document
      const body = await readBody(event);
      // Validate input
      if (!body.name || !body.expiryDate || !body.ref_no) {
        throw createError({
          statusCode: 400,
          message: 'Name, reference number, and expiry date are required',
        });
      }

      // Create and save a new document
      const document = new Document({
        ...body, // Spread operator to copy fields from body
        userId,  // Add userId from an external variable
        firmId,
      });

      const savedDocument = await document.save();
      return savedDocument;
    } else {
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
    }
  } catch (error) {
    if (error.statusCode) {
      console.error('Error in documents API:', error)
      throw error
    }

    console.error('Error in documents API:', error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})