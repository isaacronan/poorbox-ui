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
<div>
    <label>min: <input name="min" value={min} on:input={handleChange} type="text"></label>
    <label>max: <input name="max" value={max} on:input={handleChange} type="text"></label>
    <label>scale: <input name="scale" value={scale} on:input={handleChange} type="text"></label>
</div>