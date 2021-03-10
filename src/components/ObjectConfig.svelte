<script>
import { createEventDispatcher } from 'svelte';
import { typeDefaults } from '../utils/typeDefaults';
import ValueConfig from './ValueConfig.svelte';
    
export let value = {};
$: fields = value.fields;

const dispatch = createEventDispatcher();

const handleAdd = () => {
    dispatch('valuechange', {
        ...value,
        fields: [...fields, { label: '', value: { ...typeDefaults.number }, presence: 1 }]
    });
};

const handleDelete = (deleteIndex) => () => {
    dispatch('valuechange', {
        ...value,
        fields: fields.filter((_, index) => index !== deleteIndex)
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
    <div><button class="bare-button small-heavy" on:click={handleAdd}>Add Field</button></div>
    {#each fields as { label, value: existingValue, presence }, index}
        <div class="value-controls">
            <div class="form-control">
                <label for="label">Label</label>
                <input id="label" value={label} on:input={handleLabelChange(index)} type="text">
            </div>
            <div class="form-control">
                <label for="presence">Presence</label>
                <input id="presence" value={presence} on:input={handlePresenceChange(index)} type="text">
            </div>
            <button tabindex="-1" on:click={handleDelete(index)}>Remove Field</button>
        </div>
        <ValueConfig value={existingValue} on:valuechange={handleValueChange(index)} />
    {/each}
</div>