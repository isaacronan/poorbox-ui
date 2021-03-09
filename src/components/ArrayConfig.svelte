<script>
import { createEventDispatcher } from 'svelte';
import ValueConfig from './ValueConfig.svelte';
    
export let value = {};
$: minlength = value.minlength;
$: maxlength = value.maxlength;
$: itemValue = value.value;

const dispatch = createEventDispatcher();

const handleChange = (event) => {
    dispatch('valuechange', {
        ...value,
        [event.target.name]: Number(event.target.value)
    });
};

const handleValueChange = (event) => {
    dispatch('valuechange', {
        ...value,
        value: { ...event.detail }
    });
};
</script>
<div>
    <div>
        <label>minlength: <input name="minlength" value={minlength} on:input={handleChange} type="text"></label>
        <label>maxlength: <input name="maxlength" value={maxlength} on:input={handleChange} type="text"></label>
    </div>
    <ValueConfig value={itemValue} on:valuechange={handleValueChange} />
</div>