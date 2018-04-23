let serverData = [
    { id: 1, value: 'Value 1', delete: false },
    { id: 2, value: 'Value 2', delete: true },
    { id: 3, value: 'Value 3', delete: false },
    { id: 4, value: 'Value 4', delete: true }, // deleted
    { id: 5, value: 'Value 5', delete: false }, // só no server
];

let storageData = [
    { id: 1, value: 'Value 1' },
    { id: 2, value: 'Value 2' },
    { id: 3, value: 'Value 3' },
    { id: 4, value: 'Value 4' },
    { id: 6, value: 'Value 6' }, // só no storage
];

let schemaConfig = {
    deletedField: 'delete',
    idField: 'id',
};

function insertNew(serverRecords: Array<any>, storageRecords: Array<any>, schema): Array<any> {
    const storageIds = storageRecords.map(storageItem => storageItem[schema.idField]);
    const newStorageRecords = serverRecords.filter(serverItem => !storageIds.includes(serverItem[schema.idField]));
    return [...storageRecords, ...newStorageRecords];
}

function updateExisting(serverRecords: Array<any>, storageRecords: Array<any>, schema): Array<any> {
    return storageRecords.map((storageItem) => {
        const findServerItem = serverRecords.find((serverItem) => serverItem[schema.idField] === storageItem[schema.idField]);
        return findServerItem === undefined ? storageItem : findServerItem;
    });
}

function removeDeleted(serverRecords: Array<any>, storageRecords: Array<any>, schema): Array<any> {
    const excludedServerItems = serverRecords.reduce((excluded, serverItem) => {
      if (serverItem[schema.deletedField]) {
        excluded.push(serverItem[schema.idField]);
      }
      return excluded;
    }, []);
    return storageRecords.filter(storageItem => !excludedServerItems.includes(storageItem[schema.idField]));
 }

function updateRecords(serverRecords, storageRecords, schema) {
    storageRecords = removeDeleted(serverRecords, storageRecords, schema);
    serverRecords = serverRecords.filter(serverItem => !serverItem[schema.deletedField]);
    storageRecords = updateExisting(serverRecords, storageRecords, schema);
    storageRecords = insertNew(serverRecords, storageRecords, schema);
    return storageRecords;
}

function updateRecords2(serverRecords, storageRecords, schema) {
    const newStorageRecords = serverRecords.reduce((acc, current) => {
        // remove
        if (current[schema.deletedField]) {
            storageRecords = storageRecords.filter(storageItem => storageItem[schema.idField] !== current[schema.idField]);
        } else {
            const storageItem = storageRecords.find(s => s[schema.idField] === current[schema.idField]);
            // update
            if (storageItem !== undefined) {
                storageRecords[storageRecords.indexOf(storageItem)] = current;
            } else {
                // add
                acc.push(current);
            }
        }
        return acc;
    }, []);
    return [...storageRecords, ...newStorageRecords];
}

// tslint:disable-next-line:no-console
console.log(updateRecords2(serverData, storageData, schemaConfig));