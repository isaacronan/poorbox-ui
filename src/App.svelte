<script>
import ValueConfig from './components/ValueConfig.svelte';
import { typeDefaults } from './utils/typeDefaults';
import { saveConfig, getConfig, testConfig, deleteConfig } from './utils/http';

let valueHistory = [typeDefaults.number];
let historyIndex = valueHistory.length - 1;
let mockData = null;
let savedEndpoint = null;
let preloadedData = '';
let error = '';

$: rootValue = historyIndex === null ? {} : valueHistory[historyIndex];

const handleValueChange = (event) => {
    updateValue(event.detail);
    console.log(valueHistory[historyIndex]);
};

const updateValue = (value) => {
    valueHistory = [...valueHistory.slice(0, historyIndex + 1), { ...value }]
    historyIndex = valueHistory.length - 1;
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
        preloadedData = '';
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
        } finally {
            preloadedData = '';
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
        mockData = data;
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
<main>
    <h1>poorbox</h1>
    <div>
        <textarea placeholder="Paste an existing JSON config or endpoint URL..." value={preloadedData} on:input={handlePreloadedData} type="text" />
    </div>
    {#if error}
        <div>{error} <button on:click={() => error = ''} class="small-heavy bare-button">Dismiss</button></div>
    {/if}
    <div class="button-group">
        <button on:click={handleTestConfig}>Test</button>
        <button on:click={handleSaveConfig}>Create Endpoint</button>
    </div>
    
    {#if savedEndpoint}
        <div>
            <div class="url">
                <div>GET</div>
                <div>{savedEndpoint.url}</div>
                <button on:click={handleDeleteConfig} class="small-heavy bare-button">Delete</button>
            </div>
            <div>Endpoint will be removed after {savedEndpoint.expiration} seconds of inactivity.</div>
        </div>
    {/if}
    {#if mockData !== null}
        <div class="preview">{JSON.stringify(mockData)}</div>
    {/if}
    <div class="history button-group">
        <button disabled={historyIndex === 0} on:click={handleUndo}>Undo</button>
        <button disabled={historyIndex === valueHistory.length - 1} on:click={handleRedo}>Redo</button>
    </div>
    <div>
        <div>JSON Config:</div>
        <div>{JSON.stringify(rootValue)}</div>
    </div>
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

.error {
    background-color: red;
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
    --dark: rgba(0, 0, 0, 0.2);
}

.form-control {
    display: inline-flex;
    flex-direction: column;
}

.value-controls,
.button-group {
    align-items: flex-end;
    display: flex;
}

.value-controls .form-control,
.button-group button {
    margin-right: 0.5rem;
}
</style>
</svelte:head>
<style>
h1 {
    font-size: 2rem;
}

.preview {
    border-radius: 1rem;
    max-height: 100px;
    overflow-y: auto;
    padding: 1rem;
    word-wrap: break-word;
}

.url {
    align-items: center;
    display: flex;
    font-size: 3rem;
}

.url > * {
    margin-right: 1rem;
}

.history {
    margin: 1rem 0;
}
</style>