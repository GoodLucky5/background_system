<template>
    <div id="app">
        <keep-alive :includes="['Attr','TradeMark','Sku','Spu','CategorySelect']">
            <router-view/>
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>
