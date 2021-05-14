const axios = window.axios
const namespaced = true
const state = () => ({
    clients: [],
    client: null
})
const getters = {
    getClientsList:(state) => state.clients,
    getClient:(state) => state.client,
    getClientsId:(state) => state.clients.map(item => item.id)
}
const mutations = {
    setClients(state, clientsList){
        state.clients = [...clientsList]
    },
    setClient(state, client){
        state.client = {...client}
    },
    storeNewClient(state, newClient){
        state.clients.push({...newClient})
    },
    updateClientData(state, updateData){
        const index = state.clients.findIndex(item => item.id === updateData.id)
        if(index !== -1){
            state.clients[index] = Object.assign({}, {...updateData})
        }
    },
    deleteClientById(state, id){
        const index = state.clients.findIndex(item => item.id === id)
        if(index > -1){
            state.clients.splice(index, 1)
        }
    }
}
const actions = {
    async fetchClients({commit}){
        return axios.get('/clients')
            .then((resp)=>{
                if(resp.data){
                    const data = resp.data || []
                    const result = clientsArrayDestruction(data)
                    commit('setClients', result)
                    return true
                }
                return false
            })
            .catch(() => false)
    },
    async fetchClient({commit}, id){
        return axios.get(`/clients/${id}`)
            .then((resp)=>{
                if(resp.data){
                    commit('setClient', resp.data)
                    return true
                }
                return false
            })
            .catch(()=> false)
    },
    async createClient({commit}, clientData){
        return axios.post('/clients/create', clientData)
            .then((resp)=>{
                if(resp.data){
                    commit('storeNewClient', resp.data)
                    return true
                }
                return false
            })
            .catch(()=> false)
    },
    async updateClient({commit}, {id, payload}){
        return axios.put(`/clients/update/${id}`, payload)
            .then((resp)=>{
                if(resp.data){
                    commit('updateClientData', resp.data)
                    return true
                }
                return false
            })
            .catch(()=> false)
    },
    async deleteClient({commit}, id){
        return axios.delete(`/clients/delete/${id}`)
            .then((resp)=>{
                if(resp.status === 204){
                    commit('deleteClientById', id)
                    return true
                }
                return false
            })
            .catch(()=> false)
    }
}

function clientsArrayDestruction (data){
    return data.map((item) => {
        const {
            created_at = '',
            description = '',
            id = '',
            sort = '',
            status = '',
            title = '',
            updated_at = ''
        } = item
        return {
            created_at,
            description,
            id,
            sort,
            status,
            title,
            updated_at
        }
    })
}

export default {
    namespaced,
    actions,
    mutations,
    getters,
    state
}