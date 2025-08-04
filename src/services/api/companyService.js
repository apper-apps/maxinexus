// Industry options for dropdown - from database schema
export const industryOptions = [
  'Technology',
  'Manufacturing', 
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Energy',
  'Transportation',
  'Real Estate',
  'Consulting',
  'Media',
  'Agriculture',
  'Construction',
  'Hospitality',
  'Other'
]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const companyService = {
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
          { field: { Name: "industry" } },
          { field: { Name: "employeeCount" } },
          { field: { Name: "website" } },
          { field: { Name: "address" } },
          { field: { Name: "description" } },
          { field: { Name: "contactCount" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      }
      
      const response = await apperClient.fetchRecords('company', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching companies:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error fetching companies:", error.message)
        throw error
      }
    }
  },

  async getById(id) {
    try {
      const companyId = parseInt(id)
      if (isNaN(companyId)) {
        throw new Error('Invalid company ID')
      }

      await delay(200)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "industry" } },
          { field: { Name: "employeeCount" } },
          { field: { Name: "website" } },
          { field: { Name: "address" } },
          { field: { Name: "description" } },
          { field: { Name: "contactCount" } }
        ]
      }
      
      const response = await apperClient.getRecordById('company', companyId, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching company with ID ${id}:`, error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error(`Error fetching company with ID ${id}:`, error.message)
        throw error
      }
    }
  },

  async create(companyData) {
    try {
      await delay(500)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include updateable fields
      const createData = {
        Name: companyData.name || '',
        industry: companyData.industry || '',
        employeeCount: parseInt(companyData.employeeCount) || 0,
        website: companyData.website || '',
        address: companyData.address || '',
        description: companyData.description || '',
        contactCount: 0 // New companies start with 0 contacts
      }
      
      const params = {
        records: [createData]
      }
      
      const response = await apperClient.createRecord('company', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create companies ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating company:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error creating company:", error.message)
        throw error
      }
    }
  },

  async update(id, companyData) {
    try {
      const companyId = parseInt(id)
      if (isNaN(companyId)) {
        throw new Error('Invalid company ID')
      }

      await delay(400)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include updateable fields
      const updateData = {
        Id: companyId,
        Name: companyData.name || '',
        industry: companyData.industry || '',
        employeeCount: parseInt(companyData.employeeCount) || 0,
        website: companyData.website || '',
        address: companyData.address || '',
        description: companyData.description || ''
      }
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('company', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update companies ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error updating company:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error updating company:", error.message)
        throw error
      }
    }
  },

  async delete(id) {
    try {
      const companyId = parseInt(id)
      if (isNaN(companyId)) {
        throw new Error('Invalid company ID')
      }

      await delay(300)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [companyId]
      }
      
      const response = await apperClient.deleteRecord('company', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete companies ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return { success: true }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting company:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error deleting company:", error.message)
        throw error
      }
    }
  }
}