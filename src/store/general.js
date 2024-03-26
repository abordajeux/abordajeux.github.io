import { createStore } from 'vuex'
const store = createStore({
    state () {
        
      return {

        isPhoneMode: window.height > window.width
      }
    },
    mutations: {
          }
  })

  export default store