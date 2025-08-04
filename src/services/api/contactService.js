const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const contactService = {
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "companyName" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "jobTitle" } },
          { field: { Name: "notes" } },
          { field: { Name: "lastContactDate" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "companyId" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      }
      
      const response = await apperClient.fetchRecords('app_contact', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching contacts:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error fetching contacts:", error.message)
        throw error
      }
    }
  },

  async getById(id) {
    try {
      await delay(200)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "companyName" } },
          { field: { Name: "firstName" } },
          { field: { Name: "lastName" } },
          { field: { Name: "jobTitle" } },
          { field: { Name: "notes" } },
          { field: { Name: "lastContactDate" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "companyId" } }
        ]
      }
      
      const response = await apperClient.getRecordById('app_contact', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error(`Error fetching contact with ID ${id}:`, error.message)
        throw error
      }
    }
  },

  async create(contactData) {
    try {
      await delay(400)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include updateable fields
      const createData = {
        Name: contactData.name || `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim(),
        email: contactData.email || '',
        phone: contactData.phone || '',
        companyName: contactData.companyName || contactData.company || '',
        firstName: contactData.firstName || '',
        lastName: contactData.lastName || '',
        jobTitle: contactData.jobTitle || '',
        notes: contactData.notes || '',
        lastContactDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString().split("T")[0]
      }
      
      // Handle companyId if provided
      if (contactData.companyId) {
        createData.companyId = parseInt(contactData.companyId)
      }
      
      const params = {
        records: [createData]
      }
      
      const response = await apperClient.createRecord('app_contact', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create contacts ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating contact:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error creating contact:", error.message)
        throw error
      }
    }
  },

  async update(id, contactData) {
    try {
      await delay(350)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include updateable fields
      const updateData = {
        Id: parseInt(id),
        Name: contactData.name || `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim(),
        email: contactData.email || '',
        phone: contactData.phone || '',
        companyName: contactData.companyName || contactData.company || '',
        firstName: contactData.firstName || '',
        lastName: contactData.lastName || '',
        jobTitle: contactData.jobTitle || '',
        notes: contactData.notes || '',
        lastContactDate: new Date().toISOString().split("T")[0]
      }
      
      // Handle companyId if provided
      if (contactData.companyId) {
        updateData.companyId = parseInt(contactData.companyId)
      }
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('app_contact', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update contacts ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error updating contact:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error updating contact:", error.message)
        throw error
      }
    }
  },

  async delete(id) {
    try {
      await delay(250)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('app_contact', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete contacts ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return true
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting contact:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error deleting contact:", error.message)
        throw error
      }
    }
  },

  async search(query) {
    try {
      const allContacts = await this.getAll()
      
      if (!query || query.trim() === "") {
        return allContacts
      }
      
      const searchTerm = query.toLowerCase().trim()
      const filtered = allContacts.filter(contact => 
        (contact.Name && contact.Name.toLowerCase().includes(searchTerm)) ||
        (contact.email && contact.email.toLowerCase().includes(searchTerm)) ||
        (contact.companyName && contact.companyName.toLowerCase().includes(searchTerm)) ||
        (contact.phone && contact.phone.includes(searchTerm))
      )
      
      return filtered
    } catch (error) {
      console.error("Error searching contacts:", error.message)
      throw error
    }
  },

  async getActivities(contactId) {
    try {
      const { activityService } = await import('@/services/api/activityService')
      return await activityService.getByEntity('contact', contactId)
    } catch (error) {
      console.error('Error fetching contact activities:', error)
      return []
    }
  },

  async getTotalCount() {
    try {
      const contacts = await this.getAll()
      return contacts.length
    } catch (error) {
      console.error("Error getting total contact count:", error.message)
      return 0
    }
  }
}