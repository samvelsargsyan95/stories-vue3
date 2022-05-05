<template>
  <div class="home" id="home">
    <div class="home__header">
      <router-link to="/">
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

      <div class="home__body--stories">
        <div v-for="(story, key) of storiesData" :key="key" class="story">

          <vue-collapsible-panel-group base-color="#ffffff">
            <vue-collapsible-panel :expanded="false">
              <template #title>
                <div class="d-flex justify-content-center">
                  <img :src="story.imageUrls ? story.imageUrls[0] : ''" class="story__avatar mr-20" />

                  <div class="story__body d-flex justify-content-between  pt-12 pb-12">
                    <div class="d-flex justify-content-center flex-column">
                      <a :href="story.url" target="_blank" class="story__body--title mb-12">{{ story.title }}</a>
                      
                      <div v-if="story.category === 'op' || story.category === 'mp'" class="d-flex align-items-center">
                        <img :src="story.domain_cached_logo_url" :title="story.domain_name" class="story__body--domain-logo mr-5">
                        <span class="story__body--domain-name mr-20">{{story.domain_name}}</span>

                        <span>{{ diffDate(story.publishTime) }}</span>
                      </div>

                       <div v-else class="d-flex align-items-center">
                        <img :src="story.author_image_url" :title="story.author_screen_name" class="story__body--domain-logo mr-5">
                        <span class="story__body--domain-name mr-20">{{story.author_screen_name}}</span>

                        <div style="display: inline-flex;" class="aling-itmes-center">
                          <img class="story__body--domain-logo" src="@/assets/twitter.png" :alt="story.author_screen_name" :title="story.author_screen_name">
                          <span>{{ diffDate(story.publishTime) }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div :class="{
                      'green': story.score >= 50,
                      'orange': story.score > 13 && story.score < 50,
                      'red' : story.score <= 13 
                    }" class="story__body--percent">{{ story.score }}%</div>
                  </div>
                </div>
              </template>
              <template #content>
                <p>{{ story.description }}</p>

                <div class="story__body--footer d-flex justify-content-end">
                  <div class="d-flex align-items-center mr-40"><img class="mr-10 w-16 h-16" src="@/assets/like.png">Like</div>
                  <div class="d-flex align-items-center mr-40"><img class="mr-10 w-16 h-16" src="@/assets/unlike.png">Dislike</div>
                  <div class="d-flex align-items-center"><img class="mr-10 w-16 h-16" src="@/assets/bookmark.png">bookmark</div>
                </div>
              </template>
            </vue-collapsible-panel>
          </vue-collapsible-panel-group>

        </div>
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

      window.addEventListener('scroll', handleScroll);
    });

    //methods
    const reset = async () => {
      setData({
        autorefresh: null,
        order: null,
        languages: [],
        limit: 20
      });

      clearInterval(autorefreshInterval);
      await getStories();
    };

    const selectFilter = async (selectedValue, filterType) => {
      const filterTypes = ["autorefresh", "order", "languages"];

      if (typeof selectedValue === Object) {
        selectedValue = selectedValue.join(",");
      }

      filterTypes.map((item) => {
        if (item === filterType) {
          setData({ [filterType]: selectedValue });
        }
      });

      if (filterType === "autorefresh") {
        let interval = selectedValue.split("/");
        let miliseconds = 0;

        if (interval[1] === "s") {
          miliseconds = interval[0] * 1000; //seconds to miliseconds
        }

        if (interval[1] === "m") {
          miliseconds = interval[0] * 60000; //minutes to miliseconds
        }

        clearInterval(autorefreshInterval);
        autoRefresh(miliseconds);
      }

      if (filterType !== "autorefresh") {
        await getStories();
      }
    };

    const autoRefresh = (miliseconds) => {
      autorefreshInterval = setInterval(async () => {
        await getStories();
      }, miliseconds);
    };

    const diffDate = (startDate) => {
      const diff = ref(new Date(new Date() - new Date(startDate)))

      if((diff.value.toISOString().slice(0, 4) - 1970) > 0) {
        return (diff.value.toISOString().slice(0, 4) - 1970) + 'y '
      } 
      if (diff.value.getMonth() > 0) {
        return (diff.value.toISOString().slice(0, 4) - 1970) + 'y ' + diff.value.getMonth() + 'm '
      }  
      
      if (diff.value.getDate()-1 > 0) {
        return (diff.value.toISOString().slice(0, 4) - 1970) + 'y ' + diff.value.getMonth() + 'm ' + diff.value.getDay() + 'd '
      }

      if (diff.value.getHours() > 0) {
        return (diff.value.toISOString().slice(0, 4) - 1970) + 'y ' + diff.value.getMonth() + 'm ' + diff.value.getDay() + 'd ' +  diff.value.getHours() + 'h ' 
      }
    };

    const handleScroll = async () => {
      let d = document.documentElement;
      let offset = d.scrollTop + window.innerHeight;
      let height = d.offsetHeight;
      if (offset >= height - 10) {
        setData({scrollReload: true})
        await getStories();

        return (false)
      }

    }

    return {
      showFilterTab,
      filtersData,
      storiesData,
      reset,
      autoRefresh,
      selectFilter,
      diffDate,
      handleScroll
    };
  },
};
</script>

<style lang="scss" scoped>
.home {
  background-color: #f7f7f7;
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
    width: 928px;
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

    &--stories {
      margin-top: 20px;
    }
  }
}

.story {
  margin-bottom: 7px;
  border: 1px solid #e0e0e0;

  &__avatar {
    width: 70px;
    object-fit: cover;
  }

  &__body {
    width: 804px;
    & a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }

    &--title {
      color: black;
    }

    &--percent {
      width: 40px;
      height: 30px;
      padding: 6px;
      display: flex;
      align-items:center;
      justify-content: center;
      border: 1px solid;
      border-radius: 5px;
      font-weight: bold;
      font-size:13px;
    }

    &--domain-logo {
      width: 18px;
      height: 18px;
      object-fit: cover;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }

    &--domain-name {
      font-size: 12px;
      color: #666;
    }
  }
}

.green {
  color: #4eb495;
}

.orange {
  color: #ffb300;
}

.red {
  color: #ef6c00;
}
</style>

<style lang="scss">
  .vcp__header {
    height: auto!important;
    padding: 0!important;
  }
</style>
