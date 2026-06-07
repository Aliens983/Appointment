<template>
  <div class="container page" v-loading="loading">
    <el-page-header @back="$router.push('/assessment')" content="测评结果" />
    <el-card v-if="data" class="mt-16">
      <h2>{{ data.questionnaireTitle }}</h2>
      <div class="score-row">
        <div class="score">
          <div class="num">{{ data.score }}</div>
          <div class="muted">总分</div>
        </div>
        <el-tag size="large" :type="data.level === '正常' ? 'success' : 'warning'">{{ data.level }}</el-tag>
      </div>
      <el-divider />
      <h4>维度详情</h4>
      <el-table :data="data.dimensionScores" border style="width: 100%">
        <el-table-column prop="name" label="维度" />
        <el-table-column prop="score" label="分数" width="120" />
        <el-table-column prop="level" label="等级" width="120">
          <template #default="{ row }">
            <el-tag :type="row.level === '正常' ? 'success' : 'warning'">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <h4 class="mt-16">建议</h4>
      <p class="suggestion">{{ data.suggestion }}</p>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()
const data = ref(null)
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    data.value = await store.dispatch('assessment/fetchRecord', route.params.recordId)
  } finally { loading.value = false }
}

onMounted(load)
</script>

<style scoped>
.score-row { display: flex; align-items: center; gap: 24px; margin-top: 12px; }
.score .num { font-size: 48px; font-weight: 700; color: #5b8def; line-height: 1; }
.muted { color: #909399; }
.suggestion { background: #f5f7fa; padding: 16px; border-radius: 4px; line-height: 1.8; }
</style>
