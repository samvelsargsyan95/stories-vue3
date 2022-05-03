import { createStore } from 'vuex'
import { stories } from "./stories.module";

export default createStore({
  modules: {
    stories
  }
})
