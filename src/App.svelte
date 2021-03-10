<script>
import ValueConfig from './components/ValueConfig.svelte';
import { typeDefaults } from './utils/typeDefaults';

let valueHistory = [typeDefaults.number];
let historyIndex = valueHistory.length - 1;
let mockData = null;
let url = null;

$: rootValue = historyIndex === null ? {} : valueHistory[historyIndex];

const handleValueChange = (event) => {
    valueHistory = [...valueHistory.slice(0, historyIndex + 1), { ...event.detail }]
    historyIndex = valueHistory.length - 1;
    console.log(valueHistory[historyIndex]);
};

const handleUndo = () => {
    historyIndex = Math.max(0, historyIndex - 1);
};

const handleRedo = () => {
    historyIndex = Math.min(valueHistory.length - 1, historyIndex + 1);
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
    <div class="history">
        <button disabled={historyIndex === 0} on:click={handleUndo}>Undo</button>
        <button disabled={historyIndex === valueHistory.length - 1} on:click={handleRedo}>Redo</button>
    </div>
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
    --dark: black;
    font-size: 10px;
}

body {
    color: var(--dark);
}

input,
select,
button {
    border: 1px solid var(--dark);
    border-radius: 0.5rem;
    color: var(--dark);
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

button[disabled] {
    background-color: grey;
}

label {
    color: var(--dark);
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

.value-selector:focus-within .value-selector:not(:focus-within) {
    --dark: grey;
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

textarea {
    resize: vertical;
    height: 100px;
    width: 100%;
}
</style>