<script>
import { fade } from 'svelte/transition';
import ValueConfig from './components/ValueConfig.svelte';
import { typeDefaults, typeExamples } from './utils/typeDefaults';
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
};

const updateValue = (value) => {
    if (JSON.stringify(rootValue) !== JSON.stringify(value)) {
        valueHistory = [...valueHistory.slice(0, historyIndex + 1), { ...value }]
        historyIndex = valueHistory.length - 1;
    }
};

const handleDefault = (type) => () => updateValue(typeExamples[type]);

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
<svelte:head>
    <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="mask-icon" color="#650505" href="/pinned-tab-icon.svg">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&family=Open+Sans:wght@400;700&display=swap" rel="stylesheet">
</svelte:head>
<header>
    <a href="/"><img alt="logo" height="20" src="/logo_blue.svg"></a>
    <h1>PoorBox</h1>
    <div>Endpoints for the needy.</div>
</header>
<main>
    <p>
        Create endpoints to return complex random data structures. Use the types
        <span on:click={handleDefault('fixed')} class="button-primary" tabindex="-1">fixed</span>,
        <span on:click={handleDefault('number')} class="button-primary" tabindex="-1">number</span>,
        <span on:click={handleDefault('array')} class="button-primary" tabindex="-1">array</span>,
        <span on:click={handleDefault('object')} class="button-primary" tabindex="-1">object</span>, and
        <span on:click={handleDefault('pool')} class="button-primary" tabindex="-1">pool</span>.
    </p>
    <div class="previews">
        <textarea spellcheck="false" placeholder="Paste existing config or URL..." value={JSON.stringify(rootValue)} on:input={handlePreloadedData} type="text" />
        {#if mockData !== null}
            <div class="test">{mockData}</div>
        {/if}
        {#if error}
            <div out:fade={{ duration: 400, delay: 1700 }} class="error-message">{error}</div>
        {/if}
    </div>
    {#if savedEndpoint}
        <div class="endpoint">
            <div class="url">
                <div>GET</div>
                <div>{`${window.location.origin}${savedEndpoint.url}`}</div>
                <button on:click={handleDeleteConfig} class="small-heavy bare-button">Delete</button>
            </div>
            <div>Endpoint will be removed after {savedEndpoint.expiration} seconds of inactivity.</div>
        </div>
    {/if}
    <div class="button-group">
        <button class="button-alt button-primary" disabled={historyIndex === 0} on:click={handleUndo}>Undo</button>
        <button class="button-alt button-primary" disabled={historyIndex === valueHistory.length - 1} on:click={handleRedo}>Redo</button>
        <button class="button button-primary" on:click={handleTestConfig}>Test</button>
        <button class="button button-primary" on:click={handleSaveConfig}>Create Endpoint</button>
    </div>
    <ValueConfig on:valuechange={handleValueChange} value={rootValue} />
</main>
<style>
header {
    align-items: center;
    display: flex;
    padding: 1rem 0.5rem;
}

header a {
    display: flex;
    padding: 0 1rem;
}

main {
    padding: 0.5rem;
}

h1 {
    margin-right: 1rem;
}

p {
    font-size: var(--fs-medium);
    margin-bottom: 1rem;
}

p span {
    color: var(--normal);
    cursor: pointer;
    font-weight: 700;
    outline: none;
}

p span:hover {
    color: var(--hover);
    text-decoration: underline;
}

p span:active:not(:disabled) {
    color: var(--active);
}

.endpoint {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
}

.previews {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 2rem;
    position: relative;
}

textarea,
.test {
    font-family: 'Inconsolata', monospace;
    flex-basis: 100%;
    height: 50px;
}

textarea {
    font-family: 'Inconsolata', monospace;
    font-weight: 400;
    margin-bottom: 0.5rem;
}

.test {
    font-weight: 700;
    height: 100px;
}

@media screen and (min-width: 768px) {
    .previews {
        flex-wrap: nowrap;
        height: 100px;
        margin-bottom: 2rem;
    }
    
    textarea,
    .test {
        flex-basis: 200px;
        height: auto;
        margin-bottom: 0;
    }
}

textarea {
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
    font-weight: 700;
    left: 0.5rem;
    position: absolute;
    top: 100%;
}

.url {
    align-items: flex-start;
    display: flex;
    font-size: var(--fs-normal);
    font-family: 'Inconsolata', monospace;
    font-weight: 700;
    flex-direction: column;
    margin-bottom: 1rem;
}

@media screen and (min-width: 768px) {
    .endpoint {
        align-items: center;
    }

    .url {
        align-items: center;
        font-size: var(--fs-big);
        flex-direction: row;
        margin-bottom: 0;
    }
}

.url > * {
    margin-right: 1rem;
}

.url > button {
    color: var(--red1);
}
</style>