import RequestService from "@/services/request.service";

export const stories = {
    namespaced: true,
    state: {
        storiesData: [],
        scrollReload: false,
        limit: 20,

        //filters
        autorefresh: null,
        order: null,
        languages: [],
        
    },
    mutations: {
        setData(state, data) {
            for (const key in data) {
                state[key] = data[key];
            }
        },
    },

    actions: {
        async getStories({ state, commit }) {
            const options = {}

            let query = null

            if (state.order) {
                options.order = state.order
            }

            if (state.languages.length) {
                options.languages = state.languages.join(',')
            }

            if (state.scrollReload) {
                commit('setData', { limit : state.limit += 5})                
                query += `page_token=98807224-712f-4658-9d31-98f77773333`
            }else {
                commit('setData', { limit : 20 })
            }

            options.limit = state.limit
            

            if (Object.keys(options).length) {
                query = Object.keys(options).map(
                    key => key + '=' + options[key]
                ).join('&');
            }

            await RequestService.read(`/stories?${query}`).then((response) => {
                commit('setData', { storiesData: response.data.stories })
            })
            
        }
    },

    getters: {
        storiesData: ({ storiesData }) => storiesData,
    },

};
