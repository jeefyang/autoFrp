<script setup lang="ts">
import { ref, defineModel, defineProps, onMounted } from "vue"
const model = defineModel<number>({ required: true })
const tempModel = ref(<number>model.value)
defineProps<{
    label: string
    placeholder: string
}>()

const onUpdate = (v: string | number) => {
    model.value = Number(v)
}

onMounted(() => {
    onUpdate(model.value)
})


</script>
<template>
    <van-field autosize type="number" v-model="tempModel" :label="label" :placeholder="placeholder"
        @update:model-value="onUpdate" />
</template>
<style scoped></style>