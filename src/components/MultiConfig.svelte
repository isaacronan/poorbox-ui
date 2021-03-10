<script>
import { createEventDispatcher } from 'svelte';
import { typeDefaults } from '../utils/typeDefaults';
import ValueConfig from './ValueConfig.svelte';
    
export let value = {};
$: values = value.values;
$: weightIsValid = (index) => values[index].weight === Number(values[index].weight) &&
    values[index].weight >= 0 && Number.isInteger(values[index].weight);

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
        values: values.map((existingValue, index) => index === changeIndex ? { ...existingValue, weight: isNaN(event.target.value) ? event.target.value : Number(event.target.value) } : existingValue)
    });
};
</script>
<div>
    <div><button class="bare-button small-heavy" on:click={handleAdd}>Add Value</button></div>
    {#each values as { value: existingValue, weight }, index}
        <div class="value-controls">
            <div class="form-control">
                <label for="weight">Weight</label>
                <input id="weight" value={weight} class:error={!weightIsValid(index)} on:input={handleWeightChange(index)} type="text">
            </div>
            {#if values.length > 1}
                <div class="form-control">
                    <button class="button button-negative" tabindex="-1" on:click={handleDelete(index)}>Remove Value</button>
                </div>
            {/if}
        </div>
        <ValueConfig value={existingValue} on:valuechange={handleValueChange(index)} />
    {/each}
</div>