<script>
import { createEventDispatcher } from 'svelte';

export let value = {};
$: min = value.min;
$: max = value.max;
$: scale = value.scale;

const dispatch = createEventDispatcher();

const handleChange = (event) => {
    dispatch('valuechange', {
        ...value,
        [event.target.name]: Number.parseInt(event.target.value)
    });
};
</script>
<div class="value-controls">
    <div class="form-control">
        <label for="min">Min</label>
        <input id="min" name="min" value={min} on:input={handleChange} type="text">
    </div>
    <div class="form-control">
        <label for="max">Max</label>
        <input id="max" name="max" value={max} on:input={handleChange} type="text">
    </div>
    <div class="form-control">
        <label for="scale">Scale</label>
        <input id="scale" name="scale" value={scale} on:input={handleChange} type="text">
    </div>
</div>