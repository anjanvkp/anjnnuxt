import { ref } from 'vue'
import * as ExcelJS from 'exceljs'

export function useFolio() {
  const folioData = ref<any[]>([])
  const folioSummary = ref<any[]>([])

  const calculateAverageAge = (records: any[]) => {
    const now = new Date();
    const ages = records.map(record => {
      const purchaseDate = new Date(record.pdate);
      const diffTime = Math.abs(now.getTime() - purchaseDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
    });
    return Math.floor(ages.reduce((sum, age) => sum + age, 0) / ages.length);
  };

  const getMonthlySummary = (data: any[]) => {
    const monthlySummaries: { [key: string]: any } = {};

    data.forEach((record: any) => {
      const pdt = new Date(record.pdate);
      const month = pdt.toISOString().substr(0, 7); // Get YYYY-MM format
      
      if (!monthlySummaries[month]) {
        monthlySummaries[month] = {
          month,
          sum_namt: 0,
          sum_cval: 0
        };
      }
      
      monthlySummaries[month].sum_namt += parseFloat(record.namt || 0);
      monthlySummaries[month].sum_cval += parseFloat(record.cval || 0);
    });

    const sortedMonths = Object.keys(monthlySummaries).sort();
    const results: any[] = [];

    for (let i = 0; i < sortedMonths.length; i++) {
      const month = sortedMonths[i];
      const summary = monthlySummaries[month];
  
      if (i > 0) {
        summary.sum_namt += results[i - 1].sum_namt;
        summary.sum_cval += results[i - 1].sum_cval;
      }
  
      results.push({
        month,
        sum_namt: Number(summary.sum_namt.toFixed(2)),
        sum_cval: Number(summary.sum_cval.toFixed(2))
      });
    }
    
    return results;
  };

  const fetchFolioData = async () => {
    try {
      const token = useCookie('token').value
      const response = await $fetch<any[]>('/api/nse/folio', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!Array.isArray(response)) {
        throw new Error('Expected array response from API')
      }

      folioData.value = response

      // Create summary by grouping data
      const groupedData = folioData.value.reduce((acc, curr) => {
        if (!acc[curr.symbol]) {
          acc[curr.symbol] = {
            symbol: curr.symbol,
            totalNamt: 0,
            totalCval: 0,
            totalBrokerage: 0,
            totalQnty: 0,
            priceSum: 0,
            count: 0,
            sector: curr.sector || 'Unknown',
            cprice: curr.cprice,
            records: []
          }
        }

        acc[curr.symbol].totalNamt += parseFloat(curr.namt || 0)
        acc[curr.symbol].totalCval += parseFloat(curr.cval || 0)
        acc[curr.symbol].totalBrokerage += parseFloat(curr.brokerage || 0)
        acc[curr.symbol].totalQnty += parseFloat(curr.qnty || 0)
        acc[curr.symbol].priceSum += parseFloat(curr.price || 0)
        acc[curr.symbol].count++
        acc[curr.symbol].records.push(curr)

        return acc
      }, {})

      // Convert grouped data to array and calculate averages
      folioSummary.value = Object.values(groupedData).map((group: any) => ({
        symbol: group.symbol,
        namt: Number(group.totalNamt.toFixed(2)),
        cval: Number(group.totalCval.toFixed(2)),
        brokerage: Number(group.totalBrokerage.toFixed(2)),
        qnty: Number(group.totalQnty.toFixed(2)),
        avgPrice: Number((group.priceSum / group.count).toFixed(2)),
        sector: group.sector,
        cprice: group.cprice,
        age: calculateAverageAge(group.records),
        gainLoss: Number((group.totalCval - group.totalNamt).toFixed(2))
      }))

      // Calculate overall totals
      const totalInvestment = folioData.value.reduce((sum, record) => sum + parseFloat(record.namt || 0), 0)
      const currentValue = folioData.value.reduce((sum, record) => sum + parseFloat(record.cval || 0), 0)
      const overallGain = Number((currentValue - totalInvestment).toFixed(2))

      // Get monthly summary
      const monthlySummary = getMonthlySummary(folioData.value)

      console.log('Folio Summary:', folioSummary.value)
      console.log('Monthly Summary:', monthlySummary)

      return {
        totalInvestment: Number(totalInvestment.toFixed(2)),
        currentValue: Number(currentValue.toFixed(2)),
        overallGain,
        monthlySummary
      }
    } catch (error) {
      console.error('Error fetching folio data:', error)
      throw error
    }
  }

  const gs_sheet = async () => {
    try {
      const token = useCookie('token').value
      const response = await $fetch('/api/nse/export', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { data: folioData.value }
      })

      // Create and download Excel file
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Folio Data')

      // Add headers
      worksheet.columns = [
        { header: 'Symbol', key: 'symbol', width: 15 },
        { header: 'Price', key: 'price', width: 12 },
        { header: 'Quantity', key: 'qnty', width: 12 },
        { header: 'Amount', key: 'amt', width: 15 },
        { header: 'Brokerage', key: 'brokerage', width: 12 },
        { header: 'Net Amount', key: 'namt', width: 15 },
        { header: 'Current Value', key: 'cval', width: 15 },
        { header: 'Sector', key: 'sector', width: 20 },
        { header: 'Purchase Date', key: 'pdate', width: 15 }
      ]

      // Add data
      worksheet.addRows(folioData.value)

      // Generate buffer and trigger download
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'folio_data.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting to Google Sheets:', error)
      throw error
    }
  }

  return {
    folioData,
    folioSummary,
    fetchFolioData,
    gs_sheet,
    getMonthlySummary
  }
}