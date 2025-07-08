const STORAGE_PREFIX = 'wellness_app_'

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

export const clearAllStorage = () => {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}