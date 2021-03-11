<script>
import { createEventDispatcher } from 'svelte';

export let value = {};
$: min = value.min;
$: max = value.max;
$: scale = value.scale;
$: minIsValid = min === Number(min);
$: maxIsValid = max === Number(max);
$: maxIsLow = minIsValid && maxIsValid && min > max;
$: scaleIsValid = scale === Number(scale) && scale >= 0 && Number.isInteger(scale);

const dispatch = createEventDispatcher();

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
        <label for="min">Min</label>
        <input id="min" name="min" value={min} class:error={!minIsValid} on:input={handleChange} type="text">
    </div>
    <div class="form-control">
        <label for="max">Max</label>
        <input id="max" name="max" value={max} class:error={!maxIsValid || maxIsLow} on:input={handleChange} type="text">
    </div>
    <div class="form-control">
        <label for="scale">Decimals</label>
        <input id="scale" name="scale" value={scale} class:error={!scaleIsValid} on:input={handleChange} type="text">
    </div>
</div>