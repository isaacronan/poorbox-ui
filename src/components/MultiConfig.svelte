<script>
import { createEventDispatcher } from 'svelte';
import ValueConfig from './ValueConfig.svelte';
    
export let value = {};
$: values = value.values;

const dispatch = createEventDispatcher();

const handleAdd = () => {
    dispatch('valuechange', {
        ...value,
        values: [...values, { value: {}, weight: 1 }]
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
    <div><button on:click={handleAdd}>add value</button></div>
    {#each values as { value: existingValue, weight }, index}
        <div><label>weight: <input value={weight} on:input={handleWeightChange(index)} type="text"></label></div>
        <ValueConfig value={existingValue} on:valuechange={handleValueChange(index)} />
    {/each}
</div>