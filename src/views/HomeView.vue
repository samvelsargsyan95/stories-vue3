<template>
  <div class="home">
    <div class="home__header">
      <router-link to="/home">
        <img src="@/assets/logo.png" />
      </router-link>
      <div class="home__header--user"></div>
    </div>

    <div class="home__body">
      <h2 class="home__body--title">Watchlist Name</h2>

      <div class="home__body--buttons-cont">
        <MainButton
          @onClick="$router.go()"
          type="refresh"
          buttonText="Refresh"
          style="margin-right: 5px"
        />
        <MainButton
          @onClick="showFilterTab = !showFilterTab"
          type="filter"
          buttonText="Filter"
        />
      </div>

      <div v-if="showFilterTab" class="home__body--filters-tab">
        <filterTab
          v-for="(tabData, key) of filtersData"
          @onSelect="selectFilter"   
          :key="key"
          :filterData="tabData"
          :multipleSelect="tabData.header === 'languages' ? true : false"
        />

        <button @click="reset" class="home__body--reset-btn">Reset</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers";
const { useGetters, useActions, useMutations } =
  createNamespacedHelpers("stories");

import MainButton from "@/components/MainButton";
import FilterTab from "@/components/FilterTab";
export default {
  name: "HomeView",
  components: { MainButton, FilterTab },

  setup() {
    let autorefreshInterval = ref(null);
    const showFilterTab = ref(false);
    const filtersData = ref([
      {
        header: "autorefresh",
        options: {
          list: [
            {
              name: "10 Seconds",
              value: "10/s",
            },
            {
              name: "30 Seconds",
              value: "30/s",
            },
            {
              name: "1 Minute",
              value: "1/m",
            },
            {
              name: "10 Minute",
              value: "10/m",
            },
          ],
        },
      },
      {
        header: "order",
        options: {
          list: [
            {
              name: "Top Rated",
              value: "top",
            },
            {
              name: "Latest",
              value: "latest",
            },
            {
              name: "Retweeted",
              value: "retweeted",
            },
            {
              name: "Read",
              value: "read”",
            },
          ],
        },
      },
      {
        header: "languages",
        options: {
          list: [
            {
              name: "English",
              value: "en",
            },
            {
              name: "German",
              value: "de",
            },
            {
              name: "Chinese",
              value: "zh",
            },
            {
              name: "Italian",
              value: "it",
            },
          ],
        },
      },
    ]);

    //vuex
    const { storiesData } = useGetters(["storiesData"]);
    const { setData } = useMutations(["setData"]);
    const { getStories } = useActions(["getStories"]);

    onMounted(async () => {
      await getStories();
    });

    //methods
    const reset = async () => {
      setData({
        autorefresh: null,
        order: null,
        languages: []
      })

      clearInterval(autorefreshInterval)
      await getStories();
    };

    const selectFilter = async (selectedValue, filterType) => {
      const filterTypes = ['autorefresh', 'order', 'languages']
      
      if (typeof selectedValue === Object) {
        selectedValue = selectedValue.join(",");
      }

      filterTypes.map((item) => {
        if (item === filterType) {
          setData({ [filterType]: selectedValue });
        }
      })

      if (filterType === 'autorefresh') {
        let interval = selectedValue.split('/');
        let miliseconds = 0;

        if (interval[1] === 's') {
          miliseconds = interval[0] * 1000 //seconds to miliseconds
        }

        if (interval[1] === 'm') {
          miliseconds = interval[0] * 60000 //minutes to miliseconds
        }

        clearInterval(autorefreshInterval)
        autoRefresh(miliseconds)
      }

      if (filterType !== 'autorefresh') {
        await getStories();
      }
    };

    const autoRefresh = (miliseconds) => {
      autorefreshInterval = setInterval(async  () => {
        await getStories()
      }, miliseconds)

    }

    return {
      showFilterTab,
      filtersData,
      storiesData,
      reset,
      autoRefresh,
      selectFilter,
    };
  },
};
</script>

<style lang="scss" scoped>
.home {
  background-color: #f7f7f7;
  height: 100vh;
  position: relative;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 83px;
    background-color: white;
    padding: 4px 20px;

    &--user {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background: grey;
    }
  }

  &__body {
    margin-top: 30px;
    margin-left: 70.5px;
    margin-right: 30px;
    text-align: left;

    &--title {
      color: #3971c1;
      font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
        sans-serif;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 15px;
    }

    &--buttons-cont {
      display: flex;
    }

    &--filters-tab {
      display: flex;
      justify-content: space-between;
      width: 751px;
      height: 80px;
      margin: 14px 207px 20px 0;
      padding: 20px 24px;
      border-radius: 3px;
      background-color: #eee;
    }

    &--reset-btn {
      height: 40px;
      border-radius: 3px;
      background-color: #3971c1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 172px;
      font-weight: bold;
      color: white;
      text-transform: uppercase;
      border: unset;
      transition: all 0.3s;

      &:hover {
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.582);
      }
    }
  }
}
</style>
