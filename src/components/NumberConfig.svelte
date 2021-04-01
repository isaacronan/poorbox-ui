<script>
import { createEventDispatcher } from 'svelte';
import { generateID } from '../utils/misc';

export let value = {};
$: min = value.min;
$: max = value.max;
$: scale = value.scale;
$: minIsValid = min === Number(min);
$: maxIsValid = max === Number(max);
$: maxIsLow = minIsValid && maxIsValid && min > max;
$: scaleIsValid = scale === Number(scale) && scale >= 0 && Number.isInteger(scale);

const dispatch = createEventDispatcher();
const id = generateID();

const handleChange = (event) => {
    const asNumber = Number(event.target.value);
    dispatch('valuechange', {
        ...value,
        [event.target.name]: isNaN(asNumber) ? event.target.value : asNumber
    });
};
</script>
<div class="value-controls">
    <div class="form-control">
        <label for="min-{id}">Min</label>
        <input id="min-{id}" name="min" value={min} class:error={!minIsValid} on:input={handleChange} type="number">
    </div>
    <div class="form-control">
        <label for="max-{id}">Max</label>
        <input id="max-{id}" name="max" value={max} class:error={!maxIsValid || maxIsLow} on:input={handleChange} type="number">
    </div>
    <div class="form-control">
        <label for="scale-{id}">Decimals</label>
        <input id="scale-{id}" name="scale" value={scale} class:error={!scaleIsValid} on:input={handleChange} type="number">
    </div>
</div>