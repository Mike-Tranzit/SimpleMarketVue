import axios from 'axios'

const apiService = {
    async get(resource) {
        return await axios.get(resource, { baseURL: window.location.origin })
    }
}

export default apiService
