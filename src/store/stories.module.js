import RequestService from "@/services/request.service";

export const stories = {
    namespaced: true,
    state: {
        storiesData: [],
        scrollReload: false,
        options: {
            limit: 20
        }
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
            let query = null

            if (Object.keys(state.options).length) {
                query = Object.keys(state.options).map(
                    key => key + '=' + state.options[key]
                ).join('&');
            }

            if (state.scrollReload) {
                query += `&page_token=98807224-712f-4658-9d31-98f77773333`
            }

            await RequestService.read(`/stories?${query}`).then((response) => {
                console.log(response.data.stories)
                commit('setData', { storiesData: response.data.stories })
            })

            
        }
    },

    getters: {
        storiesData: ({ storiesData }) => storiesData,
        options: ({ options }) => options,

    },

};
