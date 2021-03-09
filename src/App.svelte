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

input,
select,
button {
    border: 1px solid black;
    border-radius: 0.5rem;
    outline: none;
    padding: 0.5rem;
}

select {
    padding-top: calc(0.5rem - 1px);
    padding-bottom: calc(0.5rem - 1px);
}

select,
button {
    cursor: pointer;
}

.bare-button {
    background-color: transparent;
    border-color: transparent;
    padding-left: 0;
}

.small-heavy {
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: bold;
}

.small-heavy:hover,
.small-heavy:focus {
    text-decoration: underline;
}

.form-control {
    display: inline-flex;
    flex-direction: column;
}

.value-controls {
    align-items: flex-end;
    display: flex;
}

.value-controls .form-control {
    margin-right: 0.5rem;
}
</style>
</svelte:head>
<style>
h1 {
    font-size: 2rem;
}
</style>