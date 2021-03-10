<script>
import { createEventDispatcher, onMount } from 'svelte';
import ArrayConfig from './ArrayConfig.svelte';
import MultiConfig from './MultiConfig.svelte';
import NumberConfig from './NumberConfig.svelte';
import ObjectConfig from './ObjectConfig.svelte';
import PrimitiveConfig from './PrimitiveConfig.svelte';

import { typeDefaults } from '../utils/typeDefaults';

export let value = {};

$: type = value.type;
$: valueTypes = Object.keys(typeDefaults);

const dispatch = createEventDispatcher();

const handleTypeChange = (event) => {
    dispatch('valuechange', {
        type: event.target.value,
        ...typeDefaults[event.target.value]
    });
};

const handleValueChange = (event) => {
    dispatch('valuechange', {
        ...value,
        ...event.detail
    });
};

onMount(() => {
    // dispatch('valuechange', {
    //     ...value,
    //     ...typeDefaults.number
    // });
});
</script>
<div class="value-selector">
    <div>
        <select on:change={handleTypeChange} value={type}>
            {#each valueTypes as valueType}
                <option value={valueType}>{valueType}</option>
            {/each}
        </select>
    </div>
    <div class="type-selector">
        {#if value.type === 'number'}
            <NumberConfig on:valuechange={handleValueChange} {value} />
        {:else if value.type === 'primitive'}
            <PrimitiveConfig on:valuechange={handleValueChange} {value} />
        {:else if value.type === 'array'}
            <ArrayConfig on:valuechange={handleValueChange} {value} />
        {:else if value.type === 'multi'}
            <MultiConfig on:valuechange={handleValueChange} {value} />
        {:else if value.type === 'object'}
            <ObjectConfig on:valuechange={handleValueChange} {value} />
        {/if}
    </div>
</div>
<style>
.value-selector {
    border: 1px solid var(--dark);
    border-radius: 1rem;
    margin: 1rem;
    padding: 1rem;
}

select {
    -webkit-appearance: none;
    background-color: transparent;
    border: none;
    font-size: 2rem;
    outline: none;
    padding: 0.5rem 1rem;
    text-decoration: underline;
}

.type-selector {
    /* border-left: 1px solid var(--dark); */
    margin-left: 1rem;
    padding-left: 1rem;
}
</style>