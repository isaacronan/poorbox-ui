<script>
import { createEventDispatcher } from 'svelte';
import ArrayConfig from './ArrayConfig.svelte';
import PoolConfig from './PoolConfig.svelte';
import NumberConfig from './NumberConfig.svelte';
import ObjectConfig from './ObjectConfig.svelte';
import FixedConfig from './FixedConfig.svelte';

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
        {:else if value.type === 'fixed'}
            <FixedConfig on:valuechange={handleValueChange} {value} />
        {:else if value.type === 'array'}
            <ArrayConfig on:valuechange={handleValueChange} {value} />
        {:else if value.type === 'pool'}
            <PoolConfig on:valuechange={handleValueChange} {value} />
        {:else if value.type === 'object'}
            <ObjectConfig on:valuechange={handleValueChange} {value} />
        {/if}
    </div>
</div>
<style>
.value-selector {
    border: 1px solid var(--dark);
    border-radius: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
}

select {
    -webkit-appearance: none;
    background-color: transparent;
    border: none;
    font-size: var(--fs-medium);
    font-weight: 700;
    outline: none;
    padding: 0;
    margin-bottom: 0.5rem;
}

select:hover,
select:focus {
    text-decoration: underline;
}

.type-selector {
    padding-left: 2rem;
}
</style>