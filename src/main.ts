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
    return storageRecords;
}

function updateExisting(serverRecords: Array<any>, storageRecords: Array<any>, schema): Array<any> {
    return storageRecords.map((storageItem) => {
        const findServerItem = serverRecords.find((serverItem) => serverItem[schema.idField] === storageItem[schema.idField]);
        return findServerItem === undefined ? storageItem : findServerItem;
    });
}

function removeDeleted(serverRecords: Array<any>, storageRecords: Array<any>, schema): Array<any> {
    const excludedServerItems: Array<any> = serverRecords.reduce((excluded, serverItem) => {
      if (serverItem[schema.deletedField]) {
        excluded.push(serverItem[schema.idField]);
      }
      return excluded;
    }, []);
    return storageRecords.filter(storageItem => !excludedServerItems.includes(storageItem[schema.idField]));
 }

function updateRecords(serverRecords, storageRecords, schema) {
    // const oldItems = [];
    // storageRecords = insertNew(serverRecords, storageRecords, schema);
    // storageRecords = updateExisting(serverRecords, storageRecords, schema);
    storageRecords = removeDeleted(serverRecords, storageRecords, schema);

    // return [...insertNew(), updateExisting()]
    // return serverRecords.filter(server => {
    //     if (!server[schema.deletedField]) {
    //         return server;
    //     }
    // });

    return storageRecords;

    // marca os items excluídos como #deleted em records.
    // Adiciona os itens velhos em oldItems
    // data são os dados vindos do servidor e records são os dados que vieram do storage
    // serverRecords.forEach(serverRecord => {
    //   storageRecords = storageRecords.map(storageRecord => {
    //     if (storageRecord[schema.idField] === serverRecord[schema.idField]) {
    //       oldItems.push(serverRecord);
    //       if (serverRecord[schema.deletedField]) {
    //         return '#deleted';
    //       } else {
    //         return serverRecord;
    //       }
    //     } else {
    //       return storageRecord;
    //     }
    //   });
    // });

    // // retira de records os items que estão marcados como #deleted
    // storageRecords = storageRecords.filter(r => r !== '#deleted');

    // // verifica se é um item novo e adiciona em newRecords
    // const newRecords = serverRecords.filter(element => {
    //   return oldItems.indexOf(element) < 0 && !element[schema.deletedField];
    // });

    // // concatena records (que não tem mais itens excluídos) com newRecords
    // return storageRecords.concat(newRecords);
}

// tslint:disable-next-line:no-console
console.log(updateRecords(serverData, storageData, schemaConfig));