import RequestService from "@/services/request.service";

export const stories = {
    namespaced: true,
    state: {
        storiesData: [],
        scrollReload: false,

        //filters
        autorefresh: null,
        order: null,
        languages: []
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
            const options = {
                limit: 20
            }

            let query = null

            if (state.order) {
                options.order = state.order
            }

            if (state.languages.length) {
                options.languages = state.languages.join(',')
            }

            if (Object.keys(options).length) {
                query = Object.keys(options).map(
                    key => key + '=' + options[key]
                ).join('&');
            }

            if (state.scrollReload) {
                query += `&page_token=98807224-712f-4658-9d31-98f77773333`
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
