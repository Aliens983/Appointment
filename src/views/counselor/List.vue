<template>
  <div class="container page">
    <el-card>
      <el-form :inline="true" :model="form" @submit.prevent="onSearch">
        <el-form-item label="关键词">
          <el-input v-model="form.keyword" placeholder="姓名 / 简介" clearable @keyup.enter="onSearch" />
        </el-form-item>
        <el-form-item label="专长">
          <el-select v-model="form.specialty" placeholder="全部" clearable style="width: 160px">
            <el-option v-for="s in specialties" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="mt-16">
      <EmptyState v-if="!loading && list.length === 0" />
      <CounselorCard
        v-for="c in list"
        :key="c.id"
        :counselor="c"
        @click="$router.push(`/counselors/${c.id}`)"
      />
    </div>

    <div class="pagination">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="loadList"
        @size-change="loadList"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import CounselorCard from '@/components/CounselorCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const store = useStore()
const list = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const specialties = ref([])

const form = reactive({ keyword: '', specialty: '' })

async function loadList() {
  loading.value = true
  try {
    const res = await store.dispatch('counselor/fetchList', { keyword: form.keyword, specialty: form.specialty, page: page.value, pageSize: pageSize.value })
    list.value = res.list
    total.value = res.total
  } finally { loading.value = false }
}

async function loadSpecialties() {
  specialties.value = await store.dispatch('counselor/fetchSpecialties')
}

function onSearch() { page.value = 1; loadList() }
function onReset() { form.keyword = ''; form.specialty = ''; page.value = 1; loadList() }

onMounted(() => { loadSpecialties(); loadList() })
</script>

<style scoped>
.pagination { display: flex; justify-content: center; margin-top: 24px; }
</style>
