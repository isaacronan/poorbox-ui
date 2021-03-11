<script>
import { createEventDispatcher } from 'svelte';

export let value = null;
export let hideRemove = false;
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

$: isComposite = ['string', 'number'].includes(type);

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

const handleDelete = () => {
    dispatch('primitivedelete');
};
</script>
<div class="primitive-selector">
    <select class="button button-primary" class:hide-right={!hideRemove || isComposite} value={type} on:change={handleTypeChange}>
        {#each primitiveTypes as primitiveType}
            <option value={primitiveType}>{primitiveType}</option>
        {/each}
    </select>
    {#if isComposite}
        <input class:middle={!hideRemove} value={value} on:input={handleValueChange} type={type === 'number' ? 'number' : 'text'}>
    {/if}
    {#if !hideRemove}
        <button class="button-alt button-negative" tabindex="-1" on:click={handleDelete}>Remove</button>
    {/if}
</div>
<style>
.primitive-selector {
    display: inline-flex;
    margin: 0 0.5rem 0.5rem 0;
}

.hide-right {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
}

input {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
}

.middle {
    border-radius: 0;
    border-left-color: transparent;
    border-right-color: transparent;
}

button {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
}
</style>