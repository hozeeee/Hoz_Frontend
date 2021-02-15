<template>
  <div id="app">
    <div id="nav_container">
      <router-link
        v-for="(item,index) of $router.options.routes"
        :key="index"
        :to="item.path"
      >{{item.name}}</router-link>
    </div>
    <div id="page_container">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#nav_container {
  a {
    margin-right: 10px;
  }
  border-bottom: 2px solid #000;
}
#page_container {
  flex: 1;
}
</style>
