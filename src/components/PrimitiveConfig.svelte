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

const handleDelete = (deleteIndex) => () => {
    dispatch('valuechange', {
        ...value,
        values: values.filter((_, index) => index !== deleteIndex)
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
    <div><button class="bare-button small-heavy" on:click={handleAdd}>add value</button></div>
    <div class="selectors">
        {#each values as existingValue, index}
            <PrimitiveSelector hideRemove={values.length <= 1} value={existingValue} on:primitivedelete={handleDelete(index)} on:primitivechange={handleChange(index)} />
        {/each}
    </div>
</div>
<style>
.selectors {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
</style>