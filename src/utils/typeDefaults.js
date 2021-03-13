const fixed = {
    type: 'fixed',
    values: ['hello']
};

const number = {
    type: 'number',
    min: 0,
    max: 1,
    scale: 1
};

const array = {
    type: 'array',
    minlength: 5,
    maxlength: 10,
    value: { ...number }
};

const pool = {
    type: 'pool',
    values: [{ value: { ...number }, weight: 1 }]
};

const object = {
    type: 'object',
    fields: [{ label: 'value', value: { ...number }, presence: 1 }]
};

export const typeDefaults = {
    fixed,
    number,
    array,
    pool,
    object,
};

export const typeExamples = {
    fixed: {"type":"fixed","values":["one","two","three",null]},
    number: {"type":"number","min":0,"max":10,"scale":2},
    array: {"type":"array","minlength":10,"maxlength":20,"value":{"type":"number","min":0,"max":10,"scale":0}},
    object: {"type":"object","fields":[{"label":"endpointsNeeded","value":{"type":"number","min":0,"max":10,"scale":0},"presence":1},{"label":"isPoor","value":{"type":"fixed","values":[true,false]},"presence":0.5}]},
    pool: {"type":"pool","values":[{"value":{"type":"object","fields":[{"label":"isPoor","value":{"type":"fixed","values":[true,false]},"presence":1}]},"weight":3},{"value":{"type":"fixed","values":[null]},"weight":1}]}
};