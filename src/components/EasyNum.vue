<script setup lang="ts">
import { ref, defineModel, defineProps, onMounted, watch } from "vue"
import { otherStore } from "@/otherStore"
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

    watch([model], () => {
        tempModel.value = model.value
    })
    watch([() => otherStore.numUpdate], () => {
        onUpdate(model.value)
    })
})



</script>
<template>
    <van-field autosize type="number" v-model="tempModel" :label="label" :placeholder="placeholder"
        @update:model-value="onUpdate" />
</template>
<style scoped></style>