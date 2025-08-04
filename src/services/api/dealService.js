const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const dealService = {
  async getAll() {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "value" } },
          { field: { Name: "contact" } },
          { field: { Name: "stage" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "stageUpdatedAt" } },
          { field: { Name: "description" } },
          { field: { Name: "contactId" } },
          { field: { Name: "companyId" } },
          { field: { Name: "contactName" } },
          { field: { Name: "companyName" } },
          { field: { Name: "closeDate" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      }
      
      const response = await apperClient.fetchRecords('deal', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error fetching deals:", error.message)
        throw error
      }
    }
  },

  async getById(id) {
    try {
      const dealId = parseInt(id)
      if (isNaN(dealId)) {
        throw new Error('Deal ID must be a number')
      }

      await delay(300)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "value" } },
          { field: { Name: "contact" } },
          { field: { Name: "stage" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "stageUpdatedAt" } },
          { field: { Name: "description" } },
          { field: { Name: "contactId" } },
          { field: { Name: "companyId" } },
          { field: { Name: "contactName" } },
          { field: { Name: "companyName" } },
          { field: { Name: "closeDate" } }
        ]
      }
      
      const response = await apperClient.getRecordById('deal', dealId, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error(`Error fetching deal with ID ${id}:`, error.message)
        throw error
      }
    }
  },

  async create(dealData) {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include updateable fields
      const createData = {
        Name: dealData.name || '',
        value: parseFloat(dealData.value) || 0,
        contact: dealData.contactName || dealData.contact || '',
        stage: dealData.stage || 'lead', 
        description: dealData.description || '',
        createdAt: new Date().toISOString(),
        stageUpdatedAt: new Date().toISOString(),
        contactName: dealData.contactName || '',
        companyName: dealData.companyName || '',
        closeDate: dealData.closeDate || ''
      }
      
      // Handle contactId and companyId if provided
      if (dealData.contactId) {
        createData.contactId = dealData.contactId.toString()
      }
      if (dealData.companyId) {
        createData.companyId = dealData.companyId.toString()
      }
      
      const params = {
        records: [createData]
      }
      
      const response = await apperClient.createRecord('deal', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create deals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) throw new Error(record.message)
          })
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        return successfulRecords[0]?.data
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating deal:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error creating deal:", error.message)
        throw error
      }
    }
  },

  async update(id, updates) {
    try {
      const dealId = parseInt(id)
      if (isNaN(dealId)) {
        throw new Error('Deal ID must be a number')
      }

      await delay(300)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include updateable fields
      const updateData = {
        Id: dealId,
        ...updates
      }
      
      // Ensure proper data types
      if (updateData.value) {
        updateData.value = parseFloat(updateData.value)
      }
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('deal', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update deals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) throw new Error(record.message)
          })
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        return successfulRecords[0]?.data
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error updating deal:", error.message)
        throw error
      }
    }
  },

  async updateStage(id, newStage) {
    try {
      const dealId = parseInt(id)
      if (isNaN(dealId)) {
        throw new Error('Deal ID must be a number')
      }

      return await this.update(dealId, {
        stage: newStage,
        stageUpdatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error("Error updating deal stage:", error.message)
      throw error
    }
  },

  async delete(id) {
    try {
      const dealId = parseInt(id)
      if (isNaN(dealId)) {
        throw new Error('Deal ID must be a number')
      }

      await delay(300)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [dealId]
      }
      
      const response = await apperClient.deleteRecord('deal', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete deals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return true
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error deleting deal:", error.message)
        throw error
      }
    }
  },

  async getByStage(stage) {
    try {
      const allDeals = await this.getAll()
      return allDeals.filter(deal => deal.stage === stage)
    } catch (error) {
      console.error(`Error fetching deals by stage ${stage}:`, error.message)
      throw error
    }
  },

  async getTotalValue() {
    try {
      const allDeals = await this.getAll()
      return allDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
    } catch (error) {
      console.error("Error calculating total deal value:", error.message)
      return 0
    }
  },

  async getValueByStage(stage) {
    try {
      const stageDeals = await this.getByStage(stage)
      return stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
    } catch (error) {
      console.error(`Error calculating value for stage ${stage}:`, error.message)
      return 0
    }
  },

  async getWinRate() {
    try {
      const allDeals = await this.getAll()
      const totalDeals = allDeals.length
      if (totalDeals === 0) return 0
      
      const closedDeals = allDeals.filter(deal => deal.stage === 'closed').length
      return Math.round((closedDeals / totalDeals) * 100)
    } catch (error) {
      console.error("Error calculating win rate:", error.message)
      return 0
    }
  },

  async getRecentDeals(days = 30) {
    try {
      const allDeals = await this.getAll()
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      
      return allDeals.filter(deal => {
        const dealDate = new Date(deal.createdAt || deal.stageUpdatedAt)
        return dealDate >= cutoffDate
      })
    } catch (error) {
      console.error("Error fetching recent deals:", error.message)
      return []
    }
  },

  async getPipelineData() {
    try {
      const allDeals = await this.getAll()
      const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed']
      
      return stages.map(stage => {
        return allDeals.filter(deal => deal.stage === stage).length
      })
    } catch (error) {
      console.error("Error getting pipeline data:", error.message)
      return [0, 0, 0, 0, 0]
    }
  },

  async getTopContactsByValue(limit = 5) {
    try {
      const allDeals = await this.getAll()
      const contactPerformance = {}
      
      allDeals.forEach(deal => {
        const contactName = deal.contact || deal.contactName
        if (contactName) {
          if (!contactPerformance[contactName]) {
            contactPerformance[contactName] = {
              name: contactName,
              company: deal.companyName || 'No company',
              totalValue: 0,
              dealCount: 0
            }
          }
          contactPerformance[contactName].totalValue += deal.value || 0
          contactPerformance[contactName].dealCount += 1
        }
      })
      
      return Object.values(contactPerformance)
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, limit)
    } catch (error) {
      console.error("Error getting top contacts:", error.message)
      return []
    }
  },

  async getTopCompaniesByOpportunities(limit = 5) {
    try {
      const allDeals = await this.getAll()
      const companyPerformance = {}
      
      allDeals.forEach(deal => {
        const companyName = deal.companyName
        if (companyName) {
          if (!companyPerformance[companyName]) {
            companyPerformance[companyName] = {
              company: companyName,
              opportunityCount: 0,
              totalValue: 0
            }
          }
          companyPerformance[companyName].opportunityCount += 1
          companyPerformance[companyName].totalValue += deal.value || 0
        }
      })
      
      return Object.values(companyPerformance)
        .sort((a, b) => b.opportunityCount - a.opportunityCount)
        .slice(0, limit)
    } catch (error) {
      console.error("Error getting top companies:", error.message)
      return []
    }
  }
}