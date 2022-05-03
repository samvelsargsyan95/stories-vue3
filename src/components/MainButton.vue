<template>
  <button type="button" class="button" @click="buttonClick">
      <span class="button__icon">
        <font-awesome-icon v-if="type === 'refresh'" icon="refresh" />
        <font-awesome-icon v-if="type === 'filter'" icon="filter" />
      </span> 
      <span>{{buttonText}}</span>
  </button>
</template>

<script>

export default {
    name: 'MainButton',
    props: {
        type: {
            type: String,
            default: () => "" 
        },
        buttonText: {
            type: String,
            default: () => ""
        }
    },

    setup (_, { emit }) {
        const buttonClick = (e) => {
            emit("onClick", e.target.value)
        }

        return { buttonClick }
    }
}
</script>

<style lang="scss">
    .button {
        display: flex;
        align-items: center;
        justify-content: center;   
        width: 100px;
        height: 40px;
        border-radius: 3px;
        border: solid 1px #eeeeee;
        background-color: white;
        cursor: pointer;
        font-weight:bold;

        &__icon {
            margin-right:10px;
            color: #3971c1;
        }

        &:hover {
             background-color: #eeeeee;
        }
    }
</style>