import { defineEventHandler, createError } from 'h3';
import { NSE } from '~/server/models/NSE';

export default defineEventHandler(async (event) => {
  try {
    // Fetch NSE data with specific fields
    const nseData = await NSE.find({}, {
      SYMBOL: 1,
      SERIES: 1,
      DATE1: 1,
      PREV_CLOSE: 1,
      OPEN_PRICE: 1,
      HIGH_PRICE: 1,
      LOW_PRICE: 1,
      LAST_PRICE: 1,
      CLOSE_PRICE: 1,
      AVG_PRICE: 1,
      TTL_TRD_QNTY: 1,
      TURNOVER_LACS: 1,
      NO_OF_TRADES: 1,
      DELIV_QTY: 1,
      DELIV_PER: 1
    }).sort({ DATE1: -1 });

    if (!nseData || nseData.length === 0) {
      return {
        status: 'success',
        data: []
      };
    }

    return {
      status: 'success',
      data: nseData
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Error fetching NSE data: ${error.message}`
    });
  }
});