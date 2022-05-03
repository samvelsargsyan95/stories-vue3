<template>
  <div class="filter-cont">
    <div @click="listShow = !listShow" class="filter-cont__headers-parent">
      <div class="filter-cont__header">{{ selectedHeader }}</div>
      <div class="filter-cont__text">{{ filterData.header }}</div>
    </div>
    <div v-if="listShow" class="filter-cont__list-cont">
      <p class="filter-cont__list-cont--header">
        {{ filterData.header }}
      </p>
      <div>
        <div
          class="filter-cont__list-cont--item"
          v-for="(option, key) of filterData.options.list"
          :key="key"
        >
          <label>
            <input
              v-if="!multipleSelect"
              type="radio"
              :value="option.value"
              v-model="selectedFilter"
              @input="filterSelectUnselect(option.name)"
            />
            <input
              v-else
              type="checkbox"
              :value="option.value"
              v-model="selectedFilters"
              @input="filterSelectUnselect(option.name)"
            />
            {{ option.name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "FilterTab",
  props: {
    filterData: {
      type: Object,
      default: () => {},
    },

    multipleSelect: {
      type: Boolean,
      default: () => false,
    },
  },

  setup(props, { emit }) {
    const selectedFilters = ref([]);
    const selectedFilter = ref("");
    const listShow = ref(false);
    let selectedHeader = ref("");

    const filterSelectUnselect = (name) => {
      if (props.multipleSelect) {
        selectedHeader.value = "All Languages";
        emit("onSelect", selectedFilters.value, props.filterData.header);
      } else {
        selectedHeader.value = name;
        emit("onSelect", selectedFilter.value, props.filterData.header);
      }
    };

    return {
      selectedHeader,
      selectedFilters,
      selectedFilter,
      listShow,
      filterSelectUnselect,
    };
  },
};
</script>

<style lang="scss">
.filter-cont {
  position: relative;
  width: 172px;
  height: 40px;
  margin: 0 5px 0 0;
  padding: 5px 10px 4px;
  border-radius: 3px;
  background-color: white;

  &__headers-parent {
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  &__header {
    font-weight: bold;
    color: #292929;
    font-size: 15px;
  }

  &__text {
    color: rgb(124, 123, 123);
    text-transform: uppercase;
  }

  &__list-cont {
    position: absolute;
    top: 0;
    left: -5px;
    width: 188px;
    height: 241px;
    margin: 66px 185px 18px 5px;
    padding: 20px;
    border-radius: 3px;
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.2);
    background-color: white;
  
    &--header {
      color: #292929;
      font-weight: bold;
      margin-bottom: 15px;
    }

    & > div {
      display: flex;
      flex-direction: column;
    }

    &--item {
      display: flex;
      margin-bottom: 25px;
      justify-content: space-between;
      text-transform: uppercase;
    }
  }
}
</style>