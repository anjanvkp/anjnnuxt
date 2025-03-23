<template>
  <div>
    <!-- Top Navigation Bar -->
    <div class="bg-gradient-to-r from-red-600 to-black min-h-[50px] flex flex-col sm:flex-row items-center justify-between shadow-lg p-2" id="top-nav">
      <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 w-full sm:w-auto mb-2 sm:mb-0">
        <span class="text-white font-semibold text-lg">NSE Trading</span>
        <button class="bg-red-700 hover:bg-red-800 text-white px-4 py-1 rounded" @click="toggleCnNote">CN Notes</button>
        <button class="bg-red-700 hover:bg-red-800 text-white px-4 py-1 rounded" @click="toggleAllRec">Show All</button>
        <div :class="{'animate-pulse': timerMinutes === 0 && timerSeconds <= 30}" 
             class="text-white font-mono bg-red-600 px-3 py-1 rounded flex items-center">
          <Icon v-if="timerMinutes === 0 && timerSeconds <= 30" name="heroicons:clock" class="w-4 h-4 mr-2 text-white" />
          Next Refresh: {{ formatTime }}
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-2">
        <button class="bg-black hover:bg-gray-900 text-white px-4 py-1 rounded">Settings</button>
        <button class="bg-black hover:bg-gray-900 text-white px-4 py-1 rounded">Profile</button>
        <button class="bg-red-700 hover:bg-red-800 text-white px-4 py-1 rounded">Logout</button>
      </div>
    </div>

    <!-- Dashboard Section -->
    <div class="flex flex-col lg:flex-row justify-between gap-4 p-4">
      <div class="w-full lg:w-1/2 bg-white rounded-lg shadow-lg" v-if="!isLoading">
        <div class="p-4">
          <!-- Investment Values -->
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h1 class="text-xl sm:text-3xl font-bold flex items-center">Total Investment Value:</h1>
              <h1 class="text-xl sm:text-3xl font-bold">
                <template v-if="!isLoading">{{ totalInvestment }}</template>
              </h1>
            </div>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h1 class="text-xl sm:text-3xl font-bold">Current Investment Value:</h1>
              <h1 class="text-xl sm:text-3xl font-bold">
                <template v-if="!isLoading">
                  <div :style="{ color: dynamicColor }">{{ currentValue }}</div>
                </template>
              </h1>
            </div>
            <hr />
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h1 class="text-xl sm:text-3xl font-bold">Overall Gain/Loss:</h1>
              <h1 class="text-xl sm:text-3xl font-bold">
                <template v-if="!isLoading">
                  <div :style="{ color: dynamicColor }">{{ overallGain }}</div>
                </template>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <!-- Monthly Chart -->
      <div class="w-full lg:w-1/2 bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-4">
          <div class="h-[300px] lg:h-[32vh] min-h-[300px]">
            <h2 class="text-xl sm:text-2xl font-bold mb-4">Monthly Investment Summary</h2>
            <div class="h-[calc(100%-3rem)]">
              <canvas ref="monthlyChart" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trading View Widget Section -->
    <div class="flex flex-col lg:flex-row gap-4 mt-4 mx-4">
      <div class="w-full lg:w-2/3 bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-4">
          <div class="h-[40vh]">
            <div ref="tradingViewContainer" class="h-[calc(100%-3rem)]">
              <div class="tradingview-widget-container__widget"></div>
              <div class="tradingview-widget-copyright">
                <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
                  <span class="blue-text">Track all markets on TradingView</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Performers List -->
      <div class="w-full lg:w-1/3 space-y-4">
        <!-- Top 5 Price Gainers -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-green-600 text-white p-3">
            <h3 class="text-lg font-semibold">Top 5 Price Gainers</h3>
          </div>
          <div class="p-4">
            <div class="space-y-3">
              <div v-for="item in priceGainers" :key="item.symbol">
                <div class="flex justify-between items-center">
                  <div class="font-medium">{{ item.symbol }}</div>
                  <div class="text-green-600 font-semibold">
                    +{{ formatNumber(item.difference) }}
                    ({{ formatNumber(item.percentageChange, 1) }}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top 5 Price Losers -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-red-600 text-white p-3">
            <h3 class="text-lg font-semibold">Top 5 Price Losers</h3>
          </div>
          <div class="p-4">
            <div class="space-y-3">
              <div v-for="item in priceLosers" :key="item.symbol">
                <div class="flex justify-between items-center">
                  <div class="font-medium">{{ item.symbol }}</div>
                  <div class="text-red-600 font-semibold">
                    {{ formatNumber(item.difference) }}
                    ({{ formatNumber(item.percentageChange, 1) }}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div>
    <!-- Existing code -->
    <CNNoteModal
      :show="showCnNote"
      :is-edit="isEdit"
      :initial-data="selectedCNNote"
      @close="closeCNNoteModal"
      @submit="handleCNNoteSubmit"
    />
    <NSEAllRecordsModal
      :show="showAllRec"
      @close="showAllRec = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import NSEAllRecordsModal from '~/components/nse/NSEAllRecordsModal.vue'
import CNNoteModal from '~/components/nse/CNNoteModal.vue'
import { Chart } from 'chart.js/auto'
import type { ChartData, ChartOptions, ChartDataset } from 'chart.js'
import { useFolio } from '~/composables/nse/useFolio'

// Define interfaces for NSE data
interface PriceChange {
  symbol: string
  difference: number
  percentageChange: number
}

// Initialize useFolio composable
const { folioData, folioSummary, fetchFolioData } = useFolio()

// State
const showCnNote = ref(false)
const showAllRec = ref(false)
const showPopup = ref(false)
const isLoading = ref(true)
const timerMinutes = ref(5)
const timerSeconds = ref(0)
const dynamicColor = ref('#ff0000')
const totalInvestment = ref(1)
const currentValue = ref(1)
const overallGain = ref(1)
const priceGainers = ref<PriceChange[]>([])
const priceLosers = ref<PriceChange[]>([])
const error = ref<string | null>(null)
const isEdit = ref(false)
const oth_chg1 = ref(0)
const famt1 = ref(0)

// Form and table state
const documentForm = ref<{
  id?: string;
  cn_no: string;
  broker: string;
  cn_date: string;
  folio: string;
  type: string;
  famt: number;
  oth_chg?: number;
}>({  
  cn_no: '',
  broker: '',
  cn_date: '',
  folio: '',
  type: '',
  famt: 0
});

const nseRecords = ref<any[]>([])

const tableData = ref({
  cn_no: '',
  symbol: '',
  price: '',
  qnty: '',
  amt: '',
  brokerage: '',
  broker: '',
  pdate: '',
  namt: '',
  folio: '',
  type: '',
  rid: '',
  sector: ''
})

// Refs
const monthlyChart = ref<HTMLCanvasElement | null>(null)
const tradingViewContainer = ref<HTMLElement | null>(null)

// Computed
const formatTime = computed(() => {
  return `${timerMinutes.value.toString().padStart(2, '0')}:${timerSeconds.value.toString().padStart(2, '0')}`
})

// Methods
interface MonthlySummary {
  month: string
  sum_namt: number
  sum_cval: number
}

const fetchNSEData = async () => {
  try {
    isLoading.value = true
    const response = await fetch('/api/nse/data')
    const data = await response.json()
    
    if (data.success) {
      totalInvestment.value = data.totalInvestment
      currentValue.value = data.currentValue
      overallGain.value = data.overallGain
      updateTopPerformers() // Update top gainers and losers
      
      // Update dynamic color based on gain/loss
      dynamicColor.value = overallGain.value >= 0 ? '#22c55e' : '#ef4444'
    } else {
      error.value = data.message || 'Failed to fetch NSE data'
    }
  } catch (err) {
    error.value = 'Error fetching NSE data'
    console.error('NSE Data Error:', err)
  } finally {
    isLoading.value = false
  }
}

const toggleCnNote = async () => {
  try {
    showCnNote.value = !showCnNote.value
    if (showCnNote.value) {
      const response = await fetch('/api/nse/cn-notes')
      const data = await response.json()
      // Handle CN Notes data
    }
  } catch (err) {
    error.value = 'Error fetching CN notes'
    console.error('CN Notes Error:', err)
  }
}

const toggleAllRec = async () => {
  try {
    showAllRec.value = !showAllRec.value
    if (showAllRec.value) {
      const response = await fetch('/api/nse/all-records')
      const data = await response.json()
      // Handle all records data
    }
  } catch (err) {
    error.value = 'Error fetching all records'
    console.error('All Records Error:', err)
  }
}

const handleSettings = () => {
  navigateTo('/settings')
}

const handleProfile = () => {
  navigateTo('/profile')
}

const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
    navigateTo('/login')
  } catch (err) {
    error.value = 'Error during logout'
    console.error('Logout Error:', err)
  }
}

const updateRowData = (rowData: any) => {
  // Update rowData with values from documentForm
  rowData.cn_no = documentForm.value.cn_no
  rowData.broker = documentForm.value.broker
  rowData.pdate = documentForm.value.cn_date
  rowData.folio = documentForm.value.folio
  rowData.type = documentForm.value.type

  // Check if rowData already exists in nseRecords
  const existingRecordIndex = nseRecords.value.findIndex(record => 
    record.symbol === rowData.symbol && record.rid === rowData.rid
  )

  if (existingRecordIndex !== -1) {
    console.log('UPDATE')
    nseRecords.value[existingRecordIndex] = rowData
  } else {
    console.log('NEW')
    nseRecords.value.push(rowData)
  }

  // Reset tableData with the same values
  tableData.value = {
    cn_no: '',
    symbol: '',
    price: '',
    qnty: '',
    amt: '',
    brokerage: '',
    broker: rowData.broker,
    pdate: rowData.pdate,
    namt: '',
    folio: rowData.folio,
    type: rowData.type,
    rid: "RID" + Date.now(),
    sector: ''
  }

  // Sum the namt values in nseRecords and update famt in documentForm
  const totalNamt = nseRecords.value.reduce((sum, record) => 
    sum + parseFloat(record.namt || 0), 0
  )
  documentForm.value.famt = totalNamt

  // Update famt1 input if it exists
  const famt1Input = document.getElementById('famt1') as HTMLInputElement
  if (famt1Input) {
    famt1Input.value = totalNamt.toString()
  }

  console.log('Updating row data at index:', nseRecords.value.length, rowData)
  
  // Focus on first input in the data table
  nextTick(() => {
    const firstInput = document.querySelector('.data-table tbody tr:first-child td input') as HTMLInputElement
    if (firstInput) {
      firstInput.focus()
    }
  })
}

const deleteRowData = (rowData: any) => {
  if (!confirm('Are you sure you want to delete this row?')) return

  const existingRecordIndex = nseRecords.value.findIndex(record => 
    record.symbol === rowData.symbol && record.rid === rowData.rid
  )

  if (existingRecordIndex !== -1) {
    nseRecords.value.splice(existingRecordIndex, 1)
  }

  // Recalculate total net amount
  const totalNamt = nseRecords.value.reduce((sum, record) => 
    sum + parseFloat(record.namt || 0), 0
  )
  documentForm.value.famt = totalNamt

  // Update famt1 input if it exists
  const famt1Input = document.getElementById('famt1') as HTMLInputElement
  if (famt1Input) {
    famt1Input.value = totalNamt.toString()
  }

  console.log('Deleting row data at index:', nseRecords.value.length, rowData)
  
  // Focus on first input in the data table
  nextTick(() => {
    const firstInput = document.querySelector('.data-table tbody tr:first-child td input') as HTMLInputElement
    if (firstInput) {
      firstInput.focus()
    }
  })
}

const formatNumber = (value: number, decimals: number = 2) => {
  return value.toFixed(decimals)
}

const initTradingViewWidget = () => {
  const script = document.createElement('script')
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js'
  script.type = 'text/javascript'
  script.async = true
  script.innerHTML = JSON.stringify({
    "colorTheme": "dark",
    "dateRange": "12M",
    "showChart": true,
    "locale": "en",
    "largeChartUrl": "",
    "isTransparent": false,
    "showSymbolLogo": true,
    "showFloatingTooltip": false,
    "width": "100%",
    "height": "100%",
    "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
    "plotLineColorFalling": "rgba(41, 98, 255, 1)",
    "gridLineColor": "rgba(240, 243, 250, 0)",
    "scaleFontColor": "rgba(120, 123, 134, 1)",
    "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
    "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
    "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
    "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
    "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
    "tabs": [
      {
        "title": "Indices",
        "symbols": [
          {
            "s": "BSE:SENSEX",
            "d": "Sensex"
          },
          {
            "s": "NSE:NIFTY",
            "d": "Nifty 50"
          },
          {
            "s": "NSE:BANKNIFTY",
            "d": "Bank Nifty"
          }
        ],
        "originalTitle": "Indices"
      }
    ]
  })
  tradingViewContainer.value?.appendChild(script)
}

const { getMonthlySummary } = useFolio()

const initMonthlyChart = () => {
  if (!monthlyChart.value) return

  const ctx = monthlyChart.value.getContext('2d')
  if (!ctx) return

  const monthlySummaryData = getMonthlySummary(folioData.value)
  const labels = monthlySummaryData.map(item => item.month)
  const investmentData = monthlySummaryData.map(item => item.sum_namt)
  const currentValueData = monthlySummaryData.map(item => item.sum_cval)

  const chartConfig: {
    type: 'line',
    data: ChartData<'line'>,
    options: ChartOptions<'line'>
  } = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Investment Value',
          data: investmentData,
          fill: true,
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.4
        },
        {
          label: 'Current Value',
          data: currentValueData,
          fill: true,
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => '₹' + value.toLocaleString()
          }
        }
      }
    }
  }

  new Chart(ctx, chartConfig)
}

// Lifecycle
onMounted(() => {
  // Initialize components
  initTradingViewWidget()
  initMonthlyChart()
  
  // Fetch initial data
  fetchNSEData()

  // Start timer
  const timer = setInterval(() => {
    if (timerSeconds.value === 0) {
      if (timerMinutes.value === 0) {
        timerMinutes.value = 5
        fetchNSEData() // Refresh data
      } else {
        timerMinutes.value--
        timerSeconds.value = 59
      }
    } else {
      timerSeconds.value--
    }
  }, 1000)

  // Cleanup
  onUnmounted(() => {
    clearInterval(timer)
  })
})

const updateCountry = (index: number) => {
  console.log('Blank Row Values:', tableData.value)
  nseRecords.value[index] = { ...nseRecords.value[index], ...tableData.value }
  
  tableData.value = {
    symbol: '',
    price: '',
    qnty: '',
    amt: '',
    brokerage: '',
    cn_no: (document.getElementById('cn_no') as HTMLInputElement)?.value || '',
    broker: (document.getElementById('broker') as HTMLInputElement)?.value || '',
    pdate: (document.getElementById('cn_date') as HTMLInputElement)?.value || '',
    namt: '',
    folio: (document.getElementById('folio') as HTMLInputElement)?.value || '',
    type: (document.getElementById('type') as HTMLInputElement)?.value || '',
    rid: "RID" + Date.now(),
    sector: ''
  }
}

const openModal = () => {
  showCnNote.value = true;
  nextTick(() => {
    const cnNoInput = document.getElementById('cn_no') as HTMLInputElement;
    if (cnNoInput) {
      cnNoInput.focus();
    }
  });
}

const closeModal = () => {
  nseRecords.value = [];
  documentForm.value = {
    cn_no: '',
    broker: '',
    cn_date: '',
    folio: '',
    type: '',
    famt: 0
  };
  showCnNote.value = false;
  showAllRec.value = false;
}

const onSubmit = async () => {
  // Get form values
  const othChg1Element = document.getElementById('oth_chg1') as HTMLInputElement;
  const famt1Element = document.getElementById('famt1') as HTMLInputElement;
  const formData = {
    ...documentForm.value,
    famt: famt1Element?.value,
    oth_chg: othChg1Element?.value
  };

  try {
    let response;
    if (!isEdit.value) {
      response = await $fetch('/api/nse/submit', {
        method: 'POST',
        body: {
          formData,
          nseRecords: nseRecords.value
        }
      });
    } else {
      response = await $fetch('/api/nse/update', {
        method: 'PUT',
        body: {
          formData,
          nseRecords: nseRecords.value
        }
      });
    }
    console.log('Folio data submitted:', response);
    closeModal();
  } catch (error) {
    console.error('Error submitting folio data:', error);
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  const focusedElement = document.activeElement as HTMLElement;
  if (event.key === 'Enter') {
    event.preventDefault();
    if (focusedElement.tagName === 'INPUT') {
      const nextElement = getNextVisibleElement(focusedElement);
      if (nextElement) {
        nextElement.focus();
      }
    }
  } else if (event.key === 'Escape') {
    if (confirm('Are you sure you want to close the modal?')) {
      showPopup.value = false;
    }
  }
};

const placeCaret = (element: HTMLElement) => {
  const range = document.createRange();
  const selection = window.getSelection();
  if (selection) {
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

const getNextVisibleElement = (current: HTMLElement): HTMLElement | null => {
  const focusableElements = Array.from(
    document.querySelectorAll('input, [contenteditable="true"]')
  ) as HTMLElement[];
  const index = focusableElements.indexOf(current);
  for (let i = index + 1; i < focusableElements.length; i++) {
    if (focusableElements[i].offsetParent !== null) {
      return focusableElements[i];
    }
  }
  return null;
};

const getNextElement = (current: HTMLElement): HTMLElement | null => {
  const focusableElements = Array.from(
    document.querySelectorAll('input, [contenteditable="true"]')
  ) as HTMLElement[];
  const index = focusableElements.indexOf(current);
  return focusableElements[index + 1] || null;
};

const getPreviousElement = (current: HTMLElement): HTMLElement | null => {
  const focusableElements = Array.from(
    document.querySelectorAll('input, [contenteditable="true"]')
  ) as HTMLElement[];
  const index = focusableElements.indexOf(current);
  return focusableElements[index - 1] || null;
};

const calculateAmount = (row: any) => {
  if (row.price && row.qnty) {
    row.amt = row.price * row.qnty;
  }
};

const calculatenAmount = (row: any) => {
  if (row.amt !== undefined && row.brokerage !== undefined) {
    row.namt = parseFloat(row.amt) + (parseFloat(row.brokerage) * parseFloat(row.qnty));
  }
};

const updateCharges = () => {
  const othChgElement = document.getElementById('oth_chg') as HTMLInputElement;
  const othChg1Element = document.getElementById('oth_chg1') as HTMLInputElement;
  const famtElement = document.getElementById('famt') as HTMLInputElement;
  const famt1Element = document.getElementById('famt1') as HTMLInputElement;

  if (othChg1Element && famt1Element) {
    othChgElement.value = othChg1Element.value;

    const othChgValue = parseFloat(othChg1Element.value) || 0;
    const totalNamt = nseRecords.value.reduce((sum, record) => sum + parseFloat(record.namt || 0), 0);
    const sumValue = othChgValue + totalNamt;

    famtElement.value = Number(sumValue.toString()).toFixed(2);
    famt1Element.value = Number(sumValue.toString()).toFixed(2);
  }
};

const editCNNote = (note: any) => {
  isEdit.value = true;
  documentForm.value = {
    id: note._id,
    cn_no: note.cn_no,
    cn_date: formatDate(note.cn_date),
    broker: note.broker,
    type: note.type,
    folio: note.folio,
    oth_chg: note.oth_chg,
    famt: note.famt
  };

  oth_chg1.value = note.oth_chg;
  famt1.value = note.famt;
  nseRecords.value = note.Folio_rec;
  openModal();
};

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const getInvestmentClass = (): string => {
  return currentValue.value > totalInvestment.value ? 'text-green-500' : 'text-red-500';
};

const updateTopPerformers = () => {
  // Sort by gainLoss for gainers (highest to lowest)
  priceGainers.value = [...folioSummary.value]
    .filter(item => item.gainLoss > 0)
    .sort((a, b) => b.gainLoss - a.gainLoss)
    .slice(0, 5)
    .map(item => ({
      symbol: item.symbol,
      difference: item.gainLoss,
      percentageChange: (item.gainLoss / item.namt) * 100
    }))

  // Sort by gainLoss for losers (lowest to highest)
  priceLosers.value = [...folioSummary.value]
    .filter(item => item.gainLoss < 0)
    .sort((a, b) => a.gainLoss - b.gainLoss)
    .slice(0, 5)
    .map(item => ({
      symbol: item.symbol,
      difference: item.gainLoss,
      percentageChange: (item.gainLoss / item.namt) * 100
    }))
}
const selectedCNNote = ref(null)

const closeCNNoteModal = () => {
  showCnNote.value = false
  selectedCNNote.value = null
  isEdit.value = false
}

const handleCNNoteSubmit = async (payload: any) => {
  try {
    const url = `/api/nse/cn-notes${isEdit.value ? '?method=PUT' : ''}`
    const response = await fetch(url, {
      method: isEdit.value ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) throw new Error('Failed to save CN Note')

    closeCNNoteModal()
    // Refresh data if needed
    await fetchNSEData()
  } catch (err) {
    console.error('Error saving CN Note:', err)
    error.value = 'Error saving CN Note'
  }
}
</script>