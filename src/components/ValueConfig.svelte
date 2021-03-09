<script>
import { createEventDispatcher, onMount } from 'svelte';
import ArrayConfig from './ArrayConfig.svelte';
import MultiConfig from './MultiConfig.svelte';
import NumberConfig from './NumberConfig.svelte';
import ObjectConfig from './ObjectConfig.svelte';
import PrimitiveConfig from './PrimitiveConfig.svelte';

export let value = {};

const typeDefaults = {
    primitive: {
        type: 'primitive',
        values: ['']
    },
    number: {
        type: 'number',
        min: 0,
        max: 1,
        scale: 1
    },
    array: {
        type: 'array',
        minlength: 0,
        maxlength: 1,
        value: {}
    },
    multi: {
        type: 'multi',
        values: [{ value: {}, weight: 1 }]
    },
    object: {
        type: 'object',
        fields: [{ label: '', value: {}, presence: 1 }]
    }
}

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
}

onMount(() => {
    dispatch('valuechange', {
        ...value,
        ...typeDefaults.number
    });
});
</script>
<div class="value-selector">
    <div>
        <label>value<select on:change={handleTypeChange} value={type}>
            {#each valueTypes as valueType}
                <option value={valueType}>{valueType}</option>
            {/each}
        </select></label>
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
.type-selector {
    padding-left: 2rem;
}
</style>