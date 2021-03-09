<script>
import ValueConfig from './components/ValueConfig.svelte';

let rootValue = {};
let mockData = null;
let url = null;

const handleValueChange = (event) => {
    rootValue = { ...event.detail };
    console.log(rootValue);
};

const handleFetch = () => {
    fetch('/poorbox/api/test', {
        method: 'POST',
        body: JSON.stringify(rootValue),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        mockData = data;
    })
};
const handleCreate = () => {
    fetch('/poorbox/api/create', {
        method: 'POST',
        body: JSON.stringify(rootValue),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        url = data.url;
    });
};
</script>
<main>
    <h1>poorbox</h1>
    <div>
        <button on:click={handleFetch}>test</button>
        <button on:click={handleCreate}>create endpoint</button>
    </div>
    {#if mockData !== null}
        <textarea value={JSON.stringify(mockData)} />
    {/if}
    {#if url}
        <a target="_blank" href={url}>{url}</a>
    {/if}
    <ValueConfig on:valuechange={handleValueChange} value={rootValue} />
</main>
<svelte:head>
<style>
:root {
    font-size: 10px;
}

label {
    display: inline-flex;
    flex-direction: column;
}
</style>
</svelte:head>