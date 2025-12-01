function getProperty(object, propertyPath) {
    if (!object) { return undefined }

    let result = object;
    const propertyArray = propertyPath
    for (let i = 0; i <= propertyArray.length - 1; i += 1) {
        if (propertyArray[i] === '') { return undefined; }
        if (typeof result[propertyArray[i]] === 'undefined') { return undefined; }
        result = result[propertyArray[i]];
    }
    return result;
}
function isObject (item) {
  return typeof item === 'object' 
    && item !== null && !Array.isArray(item);
}

function setProperty(object, path, value) {
  if (!isObject(object)) { return; }
  
  const propertyArray = path;
  for (let i = 0; i <= propertyArray.length - 1; i += 1) {
    if (propertyArray[i] === '' ) { throw new Error('setProperty path'); }
  }

  let result = object;
  for (let i = 0; i <= propertyArray.length - 2; i += 1) {
    if (!isObject(result[propertyArray[i]])) { 
      result[propertyArray[i]] = {};
    }
    result = result[propertyArray[i]];
  }
  result[propertyArray[propertyArray.length - 1]] = value;
}

function delObject(obj, path) {
  if (!obj || !path || !Array.isArray(path)) return;
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (!current[path[i]]) return;
    current = current[path[i]];
  }
  delete current[path[path.length - 1]];
}


function Path() {
    let path = curtDir.slice(1);
    path = path.slice(0, -1);
    path = path.split("/");
    return(path);
}
async function keydownWait() {
    return new Promise((resolve) => {
        const Event = (event) => {
            document.removeEventListener("keydown", Event);
            resolve(event.key);
        };
        document.addEventListener("keydown", Event);
    });
}

async function keyupWait() {
    return new Promise((resolve) => {
        const Event = (event) => {
            document.removeEventListener("keyup", Event);
            resolve(event.key);
        };
        document.addEventListener("keyup", Event);
    });
}
