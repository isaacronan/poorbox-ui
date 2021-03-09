<script>
import { createEventDispatcher } from 'svelte';

export let value = null;
const dispatch = createEventDispatcher();

const primitiveTypes = ['null', 'true', 'false', 'string', 'number']
const defaults = {
    null: null,
    true: true,
    false: false,
    string: '',
    number: 0
};

$: type = (() => {
    if (value === null) return 'null';
    if (value === true) return 'true';
    if (value === false) return 'false';
    if (value === Number(value)) return 'number';
    return 'string'
})();

const handleTypeChange = (event) => {
    dispatch('primitivechange', {
        value: defaults[event.target.value]
    });
};

const handleValueChange = (event) => {
    dispatch('primitivechange', {
        value: type === 'number' && !isNaN(event.target.value) ? Number(event.target.value) : event.target.value
    });
};
</script>
<div>
<select value={type} on:change={handleTypeChange}>
    {#each primitiveTypes as primitiveType}
        <option value={primitiveType}>{primitiveType}</option>
    {/each}
</select>
{#if ['string', 'number'].includes(type)}
    <input value={value} on:input={handleValueChange} type="text">
{/if}
</div>