<script>
import { createEventDispatcher } from 'svelte';
import PrimitiveSelector from './PrimitiveSelector.svelte';

export let value = {};
$: values = value.values || [];

const dispatch = createEventDispatcher();

const handleAdd = () => {
    dispatch('valuechange', {
        ...value,
        values: [...values, '']
    });
};

const handleChange = (changeIndex) => (event) => {
    dispatch('valuechange', {
        ...value,
        values: values.map((existingValue, index) => index === changeIndex ? event.detail.value : existingValue)
    });
};
</script>
<div>
    {#each values as existingValue, index}
        <PrimitiveSelector value={existingValue} on:primitivechange={handleChange(index)} />
        {#if index === values.length - 1}
            <button on:click={handleAdd}>add value</button>
        {/if}
    {/each}
</div>
<style>
div {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
}
</style>