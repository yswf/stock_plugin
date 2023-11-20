<script setup>
import { bitable } from '@lark-base-open/js-sdk'
import { Notification } from "@arco-design/web-vue";

const ins = getCurrentInstance()?.proxy

const base = bitable.base
const bridge = bitable.bridge;


//表单信息
const form = reactive({
  snYourLabel: '',
  sn: '',
  inventoryYourLabel: '',
  inventory: 1,
})
//fileds list
const optionLabel = ref([])

// submit btn status
const submitStatus = ref(false)


const submitHandle = async() => {
  submitStatus.value = true
  if (form.snYourLabel && form.inventoryYourLabel && form.sn && form.inventory !== 0) {
    await searchSn(form.sn)

  } else {
    Notification.error(ins.$t('submitValueErrorTip'))
  }
  submitStatus.value = false
}

const filterType = (type) => {
  let filterData = []
  switch (type) {
    case 'number':
      filterData = optionLabel.value.filter(item => item.type === 2)
      break
    case 'date':
      filterData = optionLabel.value.filter(item => item.type === 5 || item.type === 1001 || item.type === 1002)
      break

    default:
      break
  }
  return filterData
}


const searchSn = async sn => {
  const table = await base.getActiveTable()
  const snField = await table.getField(form.snYourLabel)
  const cellList = await snField.getFieldValueList()
  for (let i = 0; i < cellList.length; i++) {
    if (cellList[i].value[0].text === sn) {
      const oldRowData = await table.getRecordById(cellList[i].record_id)
      const result = await table.setCellValue(form.inventoryYourLabel, cellList[i].record_id, parseInt(oldRowData.fields[form.inventoryYourLabel]) + form.inventory)
      if (result) {
        Notification.success(`${sn}  ${oldRowData.fields[form.inventoryYourLabel]} ${form.inventory > 0 ? '+' : ''} ${form.inventory}= ${cellList[i].record_id, parseInt(oldRowData.fields[form.inventoryYourLabel]) + form.inventory}`)

      } else {
        Notification.error(ins.$t('updateFaile'))
      }
      form.sn = ''
      return
    }
  }
  if (form.inventory > 0) {
    const fields = {}
    fields[form.snYourLabel] = sn
    fields[form.inventoryYourLabel] = form.inventory
    const result = await table.addRecord({ fields })
    if (result) {
      Notification.success(`${sn}  + ${form.inventory}`)
      form.sn = ''
    } else {
      Notification.error(ins.$t('addFaile'))
    }
  } else {
    Notification.error(ins.$t('notHaveSn'))
  }
}
onMounted(async () => {
  // 检测语言环境 保持和主站一致
  ins.$i18n.locale = await bridge.getLanguage()
  //获取Field字段信息
  const table = await base.getActiveTable()
  optionLabel.value = await table.getFieldMetaList()
})
</script>

<template>
  <div class="layout-main">
    <a-layout>
      <a-layout-header>
        <a-tag color="blue" size="large" class="expand-name">
          <template #icon>
            <icon-robot-add />
          </template>
          <span>{{ $t('title') }}</span>
        </a-tag>
      </a-layout-header>
      <a-layout-content>
        <section>
          <a-form :model="form" layout="horizontal">
            <a-form-item field="inventory">
              <a-row>
                <a-col :span="10">
                  <a-select v-model="form.inventoryYourLabel" :placeholder="$t('inventorySelect')" allow-clear
                    :bordered="false">
                    <a-option v-for=" i in filterType('number')" :key="i.id" :value="i.id">{{ i.name }}</a-option>
                  </a-select>
                </a-col>
                <a-col :span="13" :offset="1">

                  <a-input-number v-model="form.inventory" :default-value="1" mode="button" />
                </a-col>
              </a-row>
            </a-form-item>
            <a-row>
              <a-col :span="24">
                <a-form-item field="sn">
                  <a-col :span="10">
                    <a-select v-model="form.snYourLabel" :placeholder="$t('snSelect')" allow-clear :bordered="false">
                      <a-option v-for=" i in optionLabel" :key="i.id" :value="i.id">{{ i.name }}</a-option>
                    </a-select>
                  </a-col>
                  <a-input v-model="form.sn" placeholder="SN" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-space class="wrapper" direction="vertical">
                <a-button long html-type="submit" :loading="submitStatus" type="primary" @click="submitHandle">{{
                  $t('submit') }}</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </section>
      </a-layout-content>

      <a-layout-footer>
        <a-list>
          <template #header>
            {{ $t('useTip') }}
          </template>
          <a-list-item>{{ $t('footerTipNo1') }}</a-list-item>
          <a-list-item>{{ $t('footerTipNo2') }}</a-list-item>
          <a-list-item>{{ $t('footerTipNo3') }}</a-list-item>
          <a-list-item>{{ $t('footerTipNo4') }}</a-list-item>

        </a-list>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
.layout-main :deep(.arco-layout-header),
.layout-main :deep(.arco-layout-sider-children),
.layout-main :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color-primary);
  font-size: 16px;
  font-stretch: condensed;
  text-align: center;
}

.expand-name {
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 40px;
}

.wrapper {
  width: 300px;
  padding: 20px;
  border: 1px solid var(~'--color-border');
  border-radius: 4px;
}
</style>
