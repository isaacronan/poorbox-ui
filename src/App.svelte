<script>
import { fade } from 'svelte/transition';
import ValueConfig from './components/ValueConfig.svelte';
import { typeDefaults } from './utils/typeDefaults';
import { saveConfig, getConfig, testConfig, deleteConfig } from './utils/http';

let valueHistory = [typeDefaults.number];
let historyIndex = valueHistory.length - 1;
let mockData = null;
let savedEndpoint = null;
let preloadedData = '';
let error = '';

$: if (error) setTimeout(() => error = '');

$: rootValue = historyIndex === null ? {} : valueHistory[historyIndex];

const handleValueChange = (event) => {
    updateValue(event.detail);
    console.log(valueHistory[historyIndex]);
};

const updateValue = (value) => {
    if (JSON.stringify(rootValue) !== JSON.stringify(value)) {
        valueHistory = [...valueHistory.slice(0, historyIndex + 1), { ...value }]
        historyIndex = valueHistory.length - 1;
    }
};

const handleUndo = () => {
    historyIndex = Math.max(0, historyIndex - 1);
};

const handleRedo = () => {
    historyIndex = Math.min(valueHistory.length - 1, historyIndex + 1);
};

const handlePreloadedData = (event) => {
    preloadedData = event.target.value;
    const pattern = /.*(\w{8})\s*$/;
    if (pattern.test(preloadedData)) {
        const id = pattern.exec(preloadedData)[1];
        getConfig(id).then(data => {
            savedEndpoint = data;
            rootValue = { ...data.schema };
        }).catch((err) => {
            error = err.error;
        });
    } else {
        try {
            updateValue(JSON.parse(preloadedData))
        } catch {
            error = 'JSON syntax is invalid.';
        }
    }
};

const handleDeleteConfig = () => {
    deleteConfig(savedEndpoint.id).catch((err) => {
        error = err.error;
    }).finally(() => {
        savedEndpoint = null;
    });
};

const handleTestConfig = () => {
    testConfig(rootValue).then(data => {
        mockData = JSON.stringify(data);
    }).catch((err) => {
        error = err.error;
    });
};

const handleSaveConfig = () => {
    saveConfig(rootValue).then(data => {
        savedEndpoint = data;
    }).catch((err) => {
        error = err.error;
    });
};
</script>
<header>
    <h1>PoorBox</h1>
    <div>Endpoints for the needy.</div>
</header>
<main>
    <div class="previews">
        <textarea spellcheck="false" placeholder="Paste existing config or URL..." value={JSON.stringify(rootValue)} on:input={handlePreloadedData} type="text" />
        {#if mockData !== null}
            <div class="test">{mockData}</div>
        {/if}
        {#if error}
            <div out:fade={{ duration: 400, delay: 1600 }} class="error-message">{error}</div>
        {/if}
    </div>
    {#if savedEndpoint}
        <div class="endpoint">
            <div class="url">
                <div>GET</div>
                <div>{savedEndpoint.url}</div>
                <button on:click={handleDeleteConfig} class="small-heavy bare-button">Delete</button>
            </div>
            <div>Endpoint will be removed after {savedEndpoint.expiration} seconds of inactivity.</div>
        </div>
    {/if}
    <div class="button-group">
        <button class="button button-primary" disabled={historyIndex === 0} on:click={handleUndo}>Undo</button>
        <button class="button button-primary" disabled={historyIndex === valueHistory.length - 1} on:click={handleRedo}>Redo</button>
        <button class="button button-primary" on:click={handleTestConfig}>Test</button>
        <button class="button button-primary" on:click={handleSaveConfig}>Create Endpoint</button>
    </div>
    <ValueConfig on:valuechange={handleValueChange} value={rootValue} />
</main>
<svelte:head>
<style>
:root {
    --dark: black;
    --grey: #c1c1c1;
    --white: #ffffff;
    --blue1: #1e7c98;
    --blue2: #5ba0b5;
    --blue3: #0e3c4a;
    --red1: #662525;
    --red2: #8a5858;
    --red3: #540f0f;
    --redpale: #ffcccc;
    --fs-small: 1.0rem;
    --fs-normal: 1.3rem;
    --fs-medium: 1.8rem;
    --fs-big: 2.4rem;
    font-size: 10px;
}

body {
    color: var(--dark);
    font-size: var(--fs-normal);
    font-family: sans-serif;
    margin: 0;
}

h1 {
    font-size: var(--fs-big);
    margin: 0;
}

input,
select,
button,
textarea {
    border: 1px solid var(--dark);
    border-radius: 0.5rem;
    color: var(--dark);
    font-size: var(--fs-normal);
    outline: none;
    padding: 0.5rem;
}

textarea::placeholder {
    color: var(--grey);
    font-family: sans-serif;
}

input {
    box-sizing: border-box;
    width: 100px;
}

.error {
    background-color: var(--redpale);
}

select {
    padding-top: calc(0.5rem - 1px);
    padding-bottom: calc(0.5rem - 1px);
}

select,
button {
    cursor: pointer;
}

.button-primary {
    --normal: var(--blue1);
    --hover: var(--blue2);
    --active: var(--blue3);
}

.button-negative {
    --normal: var(--red1);
    --hover: var(--red2);
    --active: var(--red3);
}

.button {
    background-color: var(--normal);
    border-color: transparent;
    color: var(--white);
}

.button:hover:not(:disabled),
.button:focus:not(:disabled) {
    background-color: var(--hover);
}

.button:active:not(:disabled) {
    background-color: var(--active);
}

.button:disabled {
    background-color: var(--grey);
}

label {
    color: var(--dark);
    font-size: var(--fs-small);
}

.bare-button {
    background-color: transparent;
    border-color: transparent;
    padding-left: 0;
}

.small-heavy {
    text-transform: uppercase;
    font-size: var(--fs-small);
    font-weight: bold;
}

.small-heavy:hover,
.small-heavy:focus {
    text-decoration: underline;
}

.value-selector:focus-within .value-selector:not(:focus-within) {
    --dark: rgba(0, 0, 0, 0.4);
}

.form-control {
    display: inline-flex;
    flex-direction: column;
}

.value-controls,
.button-group {
    align-items: flex-end;
    display: flex;
    flex-wrap: wrap;
}

.value-controls .form-control,
.button-group button {
    margin: 0 0.5rem 0.5rem 0;
}
</style>
</svelte:head>
<style>
header {
    align-items: center;
    display: flex;
    padding: 1rem 0.5rem;
}

main {
    padding: 0.5rem;
}

h1 {
    margin-right: 1rem;
}

.endpoint {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
}

.previews {
    display: flex;
    height: 100px;
    margin-bottom: 2rem;
    position: relative;
}

textarea,
.test {
    font-family: monospace;
    flex-basis: 200px;
}

textarea {
    font-size: var(--fs-small);
    resize: none;
}

.test {
    flex-grow: 1;
    font-size: var(--fs-medium);
    overflow-y: auto;
    padding-left: 0.5rem;
    word-break: break-word;
}

.error-message {
    color: var(--red1);
    font-size: var(--fs-small);
    font-weight: bold;
    left: 0.5rem;
    position: absolute;
    top: 100%;
}

.url {
    align-items: center;
    display: flex;
    font-size: var(--fs-big);
    font-family: monospace;
}

.url > * {
    margin-right: 1rem;
}

.url > button {
    color: var(--red1);
}
</style>