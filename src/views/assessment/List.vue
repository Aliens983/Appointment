<template>
  <div class="container page" v-loading="loading">
    <h2 class="title">心理测评</h2>
    <p class="muted">选择一份问卷开始作答,完成后将生成个性化报告。</p>
    <el-row :gutter="16" class="mt-16">
      <el-col :xs="24" :sm="12" :md="8" v-for="a in list" :key="a.id">
        <el-card class="quiz-card" shadow="hover" @click="start(a)">
          <h3>{{ a.title }}</h3>
          <p class="muted">{{ a.description }}</p>
          <div class="meta">
            <el-tag size="small">{{ a.questionCount }} 题</el-tag>
            <el-tag size="small" type="success">约 {{ a.estimatedMinutes }} 分钟</el-tag>
            <el-tag v-if="a.completedCount" size="small" type="info">已答 {{ a.completedCount }} 次</el-tag>
          </div>
          <div v-if="a.latestResult" class="latest">
            最近结果:{{ a.latestResult.score }} 分 / {{ a.latestResult.level }}
          </div>
          <el-button class="mt-8" type="primary" @click.stop="start(a)">开始测评</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const list = ref([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    list.value = await store.dispatch('assessment/fetchList')
  } finally { loading.value = false }
}

function start(a) { router.push(`/assessment/${a.id}`) }

onMounted(load)
</script>

<style scoped>
.title { margin: 0 0 4px; }
.muted { color: #909399; }
.quiz-card { margin-bottom: 16px; cursor: pointer; }
.quiz-card h3 { margin: 0 0 4px; }
.meta { display: flex; gap: 6px; margin: 8px 0; flex-wrap: wrap; }
.latest { color: #e6a23c; font-size: 13px; }
</style>
