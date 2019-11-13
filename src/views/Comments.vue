<template>
<div class="home">
    <h2>Comments</h2>
    {{ inst }}
</div>
</template>

<script>

import { mapState } from 'vuex'

export default {
    name: 'home',
    components: {},
    computed: {
        inst: () => this
    }
}
</script>
