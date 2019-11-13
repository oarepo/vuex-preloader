<template>
<div id="app">
    <div id="nav">
        <router-link to="/">Back to articles</router-link>
    </div>
    <hr>
    <router-view/>
    <hr>
    <h2>Store state</h2>
    <pre>{{ $store.state }}</pre>
</div>
</template>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

#nav {
    padding: 30px;
    float: right;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>
