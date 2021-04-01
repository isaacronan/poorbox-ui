<script>
import { createEventDispatcher } from 'svelte';
import { generateID } from '../utils/misc';
import ValueConfig from './ValueConfig.svelte';
    
export let value = {};
$: minlength = value.minlength;
$: maxlength = value.maxlength;
$: minlengthIsValid = minlength === Number(minlength) && minlength >= 0 && Number.isInteger(minlength);
$: maxlengthIsValid = maxlength === Number(maxlength) && maxlength >= 0 && Number.isInteger(maxlength);
$: maxlengthIsLow = minlengthIsValid && maxlengthIsValid && minlength > maxlength;
$: itemValue = value.value;

const dispatch = createEventDispatcher();
const id = generateID();

const handleChange = (event) => {
    const asNumber = Number(event.target.value);
    dispatch('valuechange', {
        ...value,
        [event.target.name]: isNaN(asNumber) ? event.target.value : asNumber
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
            <label for="minlength-{id}">Min Length</label>
            <input id="minlength-{id}" name="minlength" class:error={!minlengthIsValid} value={minlength} on:input={handleChange} type="number">
        </div>
        <div class="form-control">
            <label for="maxlength-{id}">Max Length</label>
            <input id="maxlength-{id}" name="maxlength" class:error={!maxlengthIsValid || maxlengthIsLow} value={maxlength} on:input={handleChange} type="number">
        </div>
    </div>
    <ValueConfig value={itemValue} on:valuechange={handleValueChange} />
</div>