import { v1 } from 'uuid';

const generateId = () => {
    const result = v1().split('-');
    return [result[2], result[1], result[0], result[3], result[4]].join('');
};

export default generateId;
