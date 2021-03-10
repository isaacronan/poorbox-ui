<script>
import { createEventDispatcher } from 'svelte';
import { typeDefaults } from '../utils/typeDefaults';
import ValueConfig from './ValueConfig.svelte';
    
export let value = {};
$: values = value.values;

const dispatch = createEventDispatcher();

const handleAdd = () => {
    dispatch('valuechange', {
        ...value,
        values: [...values, { value: { ...typeDefaults.number }, weight: 1 }]
    });
};

const handleDelete = (deleteIndex) => () => {
    dispatch('valuechange', {
        ...value,
        values: values.filter((_, index) => index !== deleteIndex)
    });
};

const handleValueChange = (changeIndex) => (event) => {
    dispatch('valuechange', {
        ...value,
        values: values.map((existingValue, index) => index === changeIndex ? { ...existingValue, value: { ...event.detail }} : existingValue)
    });
};

const handleWeightChange = (changeIndex) => (event) => {
    dispatch('valuechange', {
        ...value,
        values: values.map((existingValue, index) => index === changeIndex ? { ...existingValue, weight: Number.parseInt(event.target.value) } : existingValue)
    });
};
</script>
<div>
    <div><button class="bare-button small-heavy" on:click={handleAdd}>Add Value</button></div>
    {#each values as { value: existingValue, weight }, index}
        <div class="value-controls">
            <div class="form-control">
                <label for="weight">Weight</label>
                <input id="weight" value={weight} on:input={handleWeightChange(index)} type="text">
            </div>
            <button tabindex="-1" on:click={handleDelete(index)}>Remove Value</button>
        </div>
        <ValueConfig value={existingValue} on:valuechange={handleValueChange(index)} />
    {/each}
</div>