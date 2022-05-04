<template>
  <router-view/>
</template>

<style lang="scss">
#app {
  font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.d-flex {
  display: flex;
}

.justify-content-center {
  justify-content: center;
}

.justify-content-between {
  justify-content: space-between;
}

.justify-content-end {
  justify-content: flex-end;
}

.align-items-center {
  align-items: center;
}

.flex-column {
  flex-direction: column;
}

.mr-20 {
  margin-right: 20px;
}

.mr-10 {
  margin-right: 10px;
}

.mr-40 {
  margin-right: 40px;
}


.mr-5 {
  margin-right: 5px;
}

.mb-12 {
  margin-bottom: 12px;
}

.pt-12 {
  padding-top: 12px;
}

.pb-12 {
  padding-bottom: 12px;
}

.w-16 {
  width: 16px;
}

.h-16 {
  height: 16px;
}


</style>
