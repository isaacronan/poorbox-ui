<script>
import { createEventDispatcher } from 'svelte';
import { generateID } from '../utils/misc';
import { typeDefaults } from '../utils/typeDefaults';
import ValueConfig from './ValueConfig.svelte';
    
export let value = {};
$: fields = value.fields;
$: presenceIsValid = (index) => fields[index].presence === Number(fields[index].presence) &&
    fields[index].presence >= 0 && fields[index].presence <= 1;

const dispatch = createEventDispatcher();
const id = generateID();

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
        fields: fields.map((field, index) => index === changeIndex ? { ...field, presence: isNaN(event.target.value) ? event.target.value : Number(event.target.value) } : field)
    });
};
</script>
<div>
    <div><button class="bare-button small-heavy" on:click={handleAdd}>Add Field</button></div>
    {#each fields as { label, value: existingValue, presence }, index}
        <div class="value-controls">
            <div class="form-control">
                <label for="label{index}-{id}">Label</label>
                <input id="label{index}-{id}" value={label} on:input={handleLabelChange(index)} type="text">
            </div>
            <div class="form-control">
                <label for="presence{index}-{id}">Presence</label>
                <input id="presence{index}-{id}" value={presence} class:error={!presenceIsValid(index)} on:input={handlePresenceChange(index)} type="number">
            </div>
            <div class="form-control">
                <button class="button button-negative" tabindex="-1" on:click={handleDelete(index)}>Remove Field</button>
            </div>
        </div>
        <ValueConfig value={existingValue} on:valuechange={handleValueChange(index)} />
    {/each}
</div>