const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const activityService = {
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
          { field: { Name: "type" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "outcome" } },
          { field: { Name: "date" } },
          { field: { Name: "entityType" } },
          { field: { Name: "entityId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "completed" } }
        ],
        orderBy: [{ fieldName: "date", sorttype: "DESC" }]
      }
      
      const response = await apperClient.fetchRecords('app_Activity', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error fetching activities:", error.message)
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
          { field: { Name: "type" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "outcome" } },
          { field: { Name: "date" } },
          { field: { Name: "entityType" } },
          { field: { Name: "entityId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "completed" } }
        ]
      }
      
      const response = await apperClient.getRecordById('app_Activity', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error(`Error fetching activity with ID ${id}:`, error.message)
        throw error
      }
    }
  },

  async getByEntity(entityType, entityId) {
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
          { field: { Name: "type" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "outcome" } },
          { field: { Name: "date" } },
          { field: { Name: "entityType" } },
          { field: { Name: "entityId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "completed" } }
        ],
        where: [
          {
            FieldName: "entityType",
            Operator: "EqualTo",
            Values: [entityType]
          },
          {
            FieldName: "entityId",
            Operator: "EqualTo", 
            Values: [parseInt(entityId)]
          }
        ],
        orderBy: [{ fieldName: "date", sorttype: "DESC" }]
      }
      
      const response = await apperClient.fetchRecords('app_Activity', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching activities for ${entityType} ${entityId}:`, error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error(`Error fetching activities for ${entityType} ${entityId}:`, error.message)
        throw error
      }
    }
  },

  async create(activityData) {
    try {
      await delay(400)
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Only include updateable fields
      const createData = {
        Name: activityData.title || activityData.Name || '',
        type: activityData.type || 'note',
        title: activityData.title || '',
        description: activityData.description || '',
        outcome: activityData.outcome || '',
        date: activityData.date || new Date().toISOString(),
        entityType: activityData.entityType || '',
        entityId: parseInt(activityData.entityId) || 0,
        createdAt: new Date().toISOString()
      }
      
      // Handle task-specific fields
      if (activityData.type === 'task') {
        createData.dueDate = activityData.dueDate || ''
        createData.completed = activityData.completed || false
      }
      
      const params = {
        records: [createData]
      }
      
      const response = await apperClient.createRecord('app_Activity', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create activities ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating activity:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error creating activity:", error.message)
        throw error
      }
    }
  },

  async update(id, activityData) {
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
        ...activityData
      }
      
      // Ensure proper field mapping
      if (updateData.title && !updateData.Name) {
        updateData.Name = updateData.title
      }
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('app_Activity', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update activities ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error updating activity:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error updating activity:", error.message)
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
      
      const response = await apperClient.deleteRecord('app_Activity', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete activities ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return true
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting activity:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error deleting activity:", error.message)
        throw error
      }
    }
  },

  async markTaskComplete(id, completed = true) {
    try {
      await delay(200)
      return await this.update(id, {
        completed: completed,
        outcome: completed ? "Completed" : "In progress"
      })
    } catch (error) {
      console.error("Error marking task complete:", error.message)
      throw error
    }
  },

  async getRecentActivities(limit = 10) {
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
          { field: { Name: "type" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "outcome" } },
          { field: { Name: "date" } },
          { field: { Name: "entityType" } },
          { field: { Name: "entityId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "completed" } }
        ],
        orderBy: [{ fieldName: "date", sorttype: "DESC" }],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      }
      
      const response = await apperClient.fetchRecords('app_Activity', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent activities:", error?.response?.data?.message)
        throw new Error(error?.response?.data?.message)
      } else {
        console.error("Error fetching recent activities:", error.message)
        throw error
      }
    }
  }
}