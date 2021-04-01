const createIdGenerator = () => {
    let id = 0;

    return () => id++;
};

export const generateID = createIdGenerator();