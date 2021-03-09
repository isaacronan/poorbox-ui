<script>
import { createEventDispatcher } from 'svelte';
import ValueConfig from './ValueConfig.svelte';
    
export let value = {};
$: fields = value.fields;

const dispatch = createEventDispatcher();

const handleAdd = () => {
    dispatch('valuechange', {
        ...value,
        fields: [...fields, { label: '', value: {}, presence: 1 }]
    });
};

const handleValueChange = (changeIndex) => (event) => {
    dispatch('valuechange', {
        ...value,
        fields: fields.map((existingValue, index) => index === changeIndex ? { ...existingValue, value: { ...event.detail }} : existingValue)
    });
};

const handleLabelChange = (changeIndex) => (event) => {
    dispatch('valuechange', {
        ...value,
        fields: fields.map((field, index) => index === changeIndex ? { ...field, label: event.target.value } : field)
    });
};

const handlePresenceChange = (changeIndex) => (event) => {
    dispatch('valuechange', {
        ...value,
        fields: fields.map((field, index) => index === changeIndex ? { ...field, presence: Number.parseInt(event.target.value) } : field)
    });
};
</script>
<div>
    <div><button on:click={handleAdd}>add field</button></div>
    {#each fields as { label, value: existingValue, presence }, index}
        <label>label: <input value={label} on:input={handleLabelChange(index)} type="text"></label>
        <label>presence: <input value={presence} on:input={handlePresenceChange(index)} type="text"></label>
        <ValueConfig value={existingValue} on:valuechange={handleValueChange(index)} />
    {/each}
</div>