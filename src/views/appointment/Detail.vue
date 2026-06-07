<template>
  <div class="container page" v-loading="loading">
    <el-page-header @back="$router.back()" content="预约详情" />
    <el-card v-if="data" class="mt-16">
      <div class="head">
        <el-tag :type="statusInfo.type" size="large">{{ statusInfo.label }}</el-tag>
        <el-tag v-if="data.isAnonymous" type="warning" effect="plain">匿名预约</el-tag>
        <span class="muted">预约号 #{{ data.id }}</span>
      </div>
      <el-descriptions :column="2" border class="mt-16">
        <el-descriptions-item label="咨询师">{{ data.counselor?.name }} ({{ data.counselor?.title }})</el-descriptions-item>
        <el-descriptions-item label="预约人">{{ data.studentName }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ fmtDateTime(data.start) }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ fmtTime(data.end) }}</el-descriptions-item>
        <el-descriptions-item label="咨询主题">{{ data.topic }}</el-descriptions-item>
        <el-descriptions-item label="紧急程度">
          <el-tag :type="urgencyInfo.type">{{ urgencyInfo.label }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系电话" :span="2">{{ data.contactPhone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="详细描述" :span="2">{{ data.description || '-' }}</el-descriptions-item>
        <el-descriptions-item v-if="data.score" label="我的评价" :span="2">
          <el-rate :model-value="data.score" disabled />
          <div v-if="data.review" class="muted">{{ data.review }}</div>
        </el-descriptions-item>
      </el-descriptions>

      <template v-if="data.timeline">
        <h4 class="mt-16">流转时间线</h4>
        <el-timeline>
          <el-timeline-item v-for="(t, i) in data.timeline" :key="i" :timestamp="fmtDateTime(t.time)">{{ t.action }}</el-timeline-item>
        </el-timeline>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { APPOINTMENT_STATUS, URGENCY } from '@/utils/constants'
import { fmtDateTime, fmtTime } from '@/utils/format'

const route = useRoute()
const store = useStore()
const loading = ref(false)
const data = ref(null)

const statusInfo = computed(() => APPOINTMENT_STATUS[data.value?.status] || {})
const urgencyInfo = computed(() => URGENCY[data.value?.urgency] || {})

async function load() {
  loading.value = true
  try {
    data.value = await store.dispatch('appointment/fetchDetail', route.params.id)
  } finally { loading.value = false }
}

onMounted(load)
</script>

<style scoped>
.head { display: flex; gap: 8px; align-items: center; }
.muted { color: #909399; }
</style>
