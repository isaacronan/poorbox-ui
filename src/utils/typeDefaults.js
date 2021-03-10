const primitive = {
    type: 'primitive',
    values: ['']
};

const number = {
    type: 'number',
    min: 0,
    max: 1,
    scale: 1
};

const array = {
    type: 'array',
    minlength: 0,
    maxlength: 1,
    value: { ...number }
};

const multi = {
    type: 'multi',
    values: [{ value: { ...number }, weight: 1 }]
};

const object = {
    type: 'object',
    fields: [{ label: '', value: { ...number }, presence: 1 }]
};

const typeDefaults = {
    primitive,
    number,
    array,
    multi,
    object,
};

module.exports = { typeDefaults };