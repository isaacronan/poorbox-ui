import App from './src/App.svelte';
import './src/styles.css';

new App({
    target: document.body,
    hydrate: true
});