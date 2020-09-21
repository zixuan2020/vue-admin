export const localSave = (key, value) => {
    localStorage.setItem(key, value)
}

export const localRead = key => localStorage.getItem(key) || ''
