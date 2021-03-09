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
    <div class="value-controls">
        <div class="form-control">
            <label for="minlength">Min Length</label>
            <input id="minlength" name="minlength" value={minlength} on:input={handleChange} type="text">
        </div>
        <div class="form-control">
            <label for="maxlength">Max Length</label>
            <input id="maxlength" name="maxlength" value={maxlength} on:input={handleChange} type="text">
        </div>
    </div>
    <ValueConfig value={itemValue} on:valuechange={handleValueChange} />
</div>