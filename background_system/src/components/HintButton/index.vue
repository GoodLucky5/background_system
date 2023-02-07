<template>
    <!--a标签包装有鼠标提示的按钮-->
    <a :title="title" style="margin: 10px;">
        <el-button v-bind="$attrs" v-on="$listeners"></el-button>
    </a>
</template>

<script>
export default {
    name: "HintButton",
    props: ['title'],
    //mounted () {
    //    console.log(this.$attrs)
    //    console.log(this.$listeners)
    //}
}
</script>

<style scoped>

</style>
