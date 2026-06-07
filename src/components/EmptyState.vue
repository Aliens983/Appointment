<template>
  <el-empty :description="text" />
</template>

<script setup>
defineProps({ text: { type: String, default: '暂无数据' } })
</script>
