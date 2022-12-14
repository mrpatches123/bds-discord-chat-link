import {
    world,
    Items,
    BlockLocation,
    Player,
    Entity
} from 'mojang-minecraft';
// import errorLogger from './classes/error.js';
export function typeOf(value) {
    if (typeof value === 'function') {
        try {
            return (new value()).constructor?.name;
        } catch {
            return 'Function';
        }
    }
    return value?.constructor?.name;
}

export const lockedItemKey = '§1§a§s§w§A';
export const crossHareDataKey = 87;
const { isInteger } = Number;
const { isArray } = Array;
const { log10, random, hypot, sqrt, PI } = Math;
const { entries, keys, values, assign } = Object;
export function randomCoordsOutsideCircle(minRadius, maxRadius) {
    const angle = random() * PI * 2;
    const randR = () => minRadius + (maxRadius - minRadius) * sqrt(random());
    const x = Math.cos(angle) * randR();
    const z = Math.sin(angle) * randR();
    const r = hypot(x, z,);
    return { x, z, r };
}
export function sortRange(array) {
    const x1 = (array[0][0] < array[1][0]) ? array[0][0] : array[1][0];
    const z1 = (array[0][1] < array[1][1]) ? array[0][1] : array[1][1];
    const x2 = (array[0][0] < array[1][0]) ? array[1][0] : array[0][0];
    const z2 = (array[0][1] < array[1][1]) ? array[1][1] : array[0][1];
    return [[x1, z1], [x2, z2]];
}
export function sort3DRange(array) {
    const x1 = (array[0][0] < array[1][0]) ? array[0][0] : array[1][0];
    const y1 = (array[0][1] < array[1][1]) ? array[0][1] : array[1][1];
    const z1 = (array[0][2] < array[1][2]) ? array[0][2] : array[1][2];
    const x2 = (array[0][0] < array[1][0]) ? array[1][0] : array[0][0];
    const y2 = (array[0][1] < array[1][1]) ? array[1][1] : array[0][1];
    const z2 = (array[0][2] < array[1][2]) ? array[1][2] : array[0][2];
    return [[x1, y1, z1], [x2, y2, z2]];
}
export function andArray(array = []) {
    let ReturnArray = [...array];
    if (ReturnArray.length > 1) ReturnArray.splice(ReturnArray.length - 1, 0, 'and');
    if (ReturnArray.length > 3) { return ReturnArray.join(', ').replace(/(?<=and),/, ''); }
    else if (ReturnArray.length === 2) { return ReturnArray.join(', ').replace(/,(?=\sand)|(?<=and),/g, ''); }
    return ReturnArray;
}
export function blockFaceToCoords(blockFace, { x, y, z }) {
    content.warn({ blockFace });
    let location = [x, y, z];
    [
        [0, -1, 0],
        [0, 1, 0],
        [0, 0, -1],
        [0, 0, 1],
        [-1, 0, 0],
        [1, 0, 0]
    ][blockFace].forEach((coord, i) => location[i] += coord);
    [x, y, z] = location;
    return new BlockLocation(x, y, z);
    //return new Location(x,y,z);
}
Math.randomBetween = function (n1, n2) {
    return n1 + Math.random() * Math.abs(n2 - n1);
};



// const array1 = {
// 	help: []
// };

// console.log(assignToPath(['help', 0], array1, 2), true);



export function pathIsObject(pathArray, object, allowArrays) {
    if (!allowArrays) {
        console.log(`return typeof object?.${pathArray.join('?.')} === 'object' && !Array.isArray(object?.${pathArray.join('?.')})`);
        return new Function('object', `return typeof object?.${pathArray.join('?.')} === 'object' && !Array.isArray(object?.${pathArray.join('?.')})`)(object);
    } else {
        return new Function('object', `return typeof object?.${pathArray.join('?.')} === 'object'`)(object);

    }
}
export function pathIsSettable(pathArray, object, allowArrays) {
    const call = pathArray.slice(0, -1).every((key, i) => pathIsObject(pathArray.slice(0, -(i + 1)), object, allowArrays));
    if (pathArray.slice(0, -1).length) {
        return call;
    } else {
        return true;
    }
}
export function assignToPath(pathArray, object, value, allowArrays = false) {
    const mappedPathArray = pathArray.map(value => `[${(typeof value === 'number') ? value : `'${value}'`}]`);
    //   	console.log(mappedPathArray)
    //   console.log(pathIsSettable(mappedPathArray, object))
    if (pathIsSettable(mappedPathArray, object, allowArrays)) {
        console.log({ pathIsSettable: `object${mappedPathArray.join('')} = value; return object` });
        return new Function('object', 'value', `object${mappedPathArray.join('')} = value; return object`)(object, value);
    } else {
        let stop = false;
        pathArray.forEach((path, i) => {
            const newPathArray = mappedPathArray.slice(0, i + 1);
            // console.log(newPathArray);
            if (!stop && !pathIsObject(newPathArray, object, allowArrays)) {
                // console.log(`object${newPathArray.join('')} = {}; return object`);
                object = new Function('object', `object${newPathArray.join('')} = {}; return object`)(object);
            } else if (!stop && pathIsSettable(newPathArray, object, allowArrays)) {
                return;
            } else {
                stop = true;
            }
            // console.log('obj', object);
        });
        if (!stop) {
            return assignToPath(pathArray, object, value, allowArrays);
        }

    }
}
const native = {
    typeOf(input) {
        switch (typeof input) {
            case 'object': {
                return (Array.isArray(input)) ? 'array' : 'object';
            }
            default: {
                return typeof input;
            }
        }
    },
    toConstructed(type) {
        switch (type) {
            case "object": {
                return {};
            } case "array": {
                return [];
            } default: {
                return false;
            }

        }
    },
    toObject(input) {
        let output = this.toConstructed(this.typeOf(input));
        if (!output) { return input; }
        call(input, []);
        function call(input1, path) {
            console.log(path);
            switch (native.typeOf(input1)) {
                case "object": {
                    for (const key in input1) {
                        call(input1[key], [...path, key]);
                    }
                    break;
                } case "array": {
                    output = assignToPath(path, output, [], true);
                    input1.forEach((item, i) => {
                        call(item, [...path, i]);
                    });
                    break;
                } case "function": {
                    output = assignToPath(path, output, `function() { }`, true);
                    break;
                } default: {
                    output = assignToPath(path, output, input1, true);
                    break;
                }
            }
        };


        return output;
    },
    stringify(input) {
        return JSON.stringify(this.toObject(input));
    }
};
export { native };

export function toProperCase(string) {
    return string.replace(/_/g, ' ').replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
export const staff = {
    tellraw(message, exludePlayer) {
        try {
            overworld.runCommand(`tellraw @a[scores={Notifications=1}${(exludePlayer) ? `,name=!${exludePlayer.name}` : ''}] {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
            return true;
        } catch (error) {
            content.warn(error);
            return undefined;
        }
    }
};
export const server = {
    tellraw(message) {
        try {
            overworld.runCommand(`tellraw @a {"rawtext":[{"text":"${message.replaceAll('"', '\\"')}"}]}`);
            return true;
        } catch (error) {
            console.warn('server.tellraw', error);
        }
    },
    /**
     * @method scoreTest
     * @param {String} objective 
     * @param {Player} target Or String or Entity
     * @param {Boolean} findParticipant 
     * @returns {Number}
     */
    scoreTest(objective, target, findParticipant = false) {
        try {
            content.warn({ target, bool: (target instanceof Player || target instanceof Entity) && !findParticipant });
            if (findParticipant && (target instanceof Player || target instanceof Entity)) target = target?.name;
            if (!target) throw new Error('target must be defined');
            let scoreboardObjective;
            let score;
            let scoreboardIdentity;
            try { scoreboardObjective = world.scoreboard.getObjective(objective); } catch (error) { console.warn(error, error.stack); }
            if ((target instanceof Player || target instanceof Entity) && !findParticipant) {
                if (!target.hasOwnProperty('scoreboard')) return;
                scoreboardIdentity = this.scoreboard;
                // content.warn({ score });
            } else {
                content.warn({ getParticipants: scoreboardObjective.getParticipants().map(({ displayName }) => displayName) });
                scoreboardIdentity = scoreboardObjective.getParticipants().find(({ displayName }) => displayName === target);
            }
            if (scoreboardObjective) { try { score = scoreboardObjective.getScore(scoreboardIdentity); } catch { } }
            return score;
        } catch (error) {
            console.warn(error, error.stack);
        }
    },
    objectiveAdd(objective, display = '') {
        try {
            overworld.runCommand(`scoreboard objectives add ${objective} dummy ${display}`);
            return true;
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
    scoreAdd(objective, name, amount = 0) {
        try {
            return Number(overworld.runCommand(`scoreboard players add ${name} ${objective} ${amount}`).statusMessage.match(/-?\d+(?=[^-\d]$)/));
        } catch (error) {
            // console.warn(error, error.stack);
            return;
        }
    },
    scoreSet(objective, name, amount = 0) {
        try {
            return Number(overworld.runCommand(`scoreboard players set ${name} ${objective} ${amount}`).statusMessage.match(/-?\d+(?=$)/));
        } catch (error) {
            console.warn(error, error.stack);
            return;
        }
    },
};

export const content = {
    warn(...messages) {
        console.warn(...messages.map(message => {
            if (typeof message === 'object') {
                return JSON.stringify(message);
                // console.warn(native.stringifyEx(message));
            } else {
                return message;
                // server.tellraw(message);
            }
        }));
    }
};






// const prototypes = {
//     toBinary() {
//         return this.replace(/[\s\S]/g, (str) => str.charCodeAt().toString(2));
//     },
//     toText() {
//         return this.replace(/\d{5}]/g, (match) => console.log(Number(match).toString()));
//     },
// };

// Object.assign(String.prototype, prototypes);






/**
 * @param {Array<String>} commandArray Commands.
 * @param {String} dimension The dimension command should be run in. If left blank it will run in the: Overworld.
 * @returns {Array<String>} Returns the following array for each object in the array.
 */

export function combine(target, source) {
    target.forEach((key, value) => {
        if (source[key] && typeof target[key] === 'object' && typeof source[key] === 'object') {
            source[key] = { ...target[key], ...source[key] };
        }
    });
    return { ...target, ...source };
}


export function ItemsGet(id, log = false) {
    const item = Items.get(id);
    if (!item) {
        let stack;
        try {
            help;
        } catch (error) {
            stack = error.stack;
        }
        if (log) {
            // errorLogger.log({ message: `Item: ${id}, does not exist!` }, stack, { key: 'chests', event: 'tick' });
        }
        return Items.get('air');
    } else {
        return item;
    }
}

export const colors = ['4', 'c', '6', 'g', 'e', 'a', '2', '3', '9', '1', 'd', '5'];
export function rainbowWeight(value, reversed) {
    const colorsA = (reversed) ? colors.reverseCopy() : colors;
    // content.warn({color: ~~(((value > 1) ? 1 : value) * (colors2.length - 1)), colors})
    return colorsA[~~(((value > 1) ? 1 : value) * (colorsA.length - 1))];
}
export function rainbow() {
    return colors.random();
}
export function getNames() {
    const names = [...world.getPlayers()].forEach(name => {
        return name;
    });
    return names;
}




export const overworld = world.getDimension('overworld'), nether = world.getDimension('nether'), end = world.getDimension('the end');

