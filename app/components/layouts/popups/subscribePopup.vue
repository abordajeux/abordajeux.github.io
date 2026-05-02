<script setup lang="ts">
import * as v from 'valibot'

const { currentParticipants, maxParticipants } = defineProps<{
    currentParticipants: number,
    maxParticipants: number,
}>()

const schema = v.object({
  contact: v.string().min(2),
  participantsToAdd:v.array()
})

type Schema = v.output<typeof schema>

const participantsToAddSchema = v.object({
  name: v.string().min(1),
  lastName: v.number().min(0)
})

type ItemSchema = v.output<typeof participantsToAddSchema>

const state = reactive<Partial<Schema & { items: Partial<ItemSchema>[] }>>({ })

function addItem() {
  if (!state.participantsToAdd) {
    state.participantsToAdd = []
  }
  state.participantsToAdd.push({})
}

function removeItem() {
  if (state.participantsToAdd?.length > 1) {
    state.participantsToAdd.pop()
  }
}

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
const state = reactive({
    contact:'',

})
onBeforeMount(() => {
    addItem()
})
</script>

<template>

    <UForm
    :state="state"
    :schema="schema"
    class="gap-4 flex flex-col w-60"
    @submit="onSubmit"
  >
    <UFormField label="E-mail de contact" name="email">
      <UInput v-model="state.contact" placeholder="johnDoe@exampleMail.ch" />
    </UFormField>

    <UForm
      v-for="item, count in state."
      :key="count"
      :name="`items.${count}`"
      :schema="itemSchema"
      class="flex gap-2"
      nested
    >
      <UFormField :label="!count ? 'Nom' : undefined" name="nom">
        <UInput v-model="item.name" />
      </UFormField>
      <UFormField :label="!count ? 'Prénom' : undefined" name="prénom" class="w-20">
        <UInput v-model="item.lastName" />
      </UFormField>
    </UForm>

        <div class="flex gap-2">
      <UButton color="neutral" variant="subtle" size="sm" @click="addItem()">
        Add Item
      </UButton>

      <UButton color="neutral" variant="ghost" size="sm" @click="removeItem()">
        Remove Item
      </UButton>
    </div>
    <div>
      <UButton type="submit">
        Submit
      </UButton>
</div>
</template>
