export interface ModelCollection<T extends {id: number}> {
  allIds: number[],
  byId: {
    [id: number]: T
  }
}

export function collectionFromModels<T extends {id: number}> (
  models: T[]
): ModelCollection<T> {
  return {
    allIds: models.map(model => model.id),
    byId: models.reduce((accum, model) => {
      accum[model.id] = model
      return accum
    }, {} as {[id: number]: T})
  }
}

export const emptyCollection = {
  allIds: [],
  byId: {}
}

export function iterateCollection<T extends {id: number}>(collection: ModelCollection<T>) {
  return collection.allIds.map(id => collection.byId[id])
}

export function updateInCollection<T extends {id: number}>(collection: ModelCollection<T>, model: T): ModelCollection<T> {
  return {
    ...collection,
    byId: {
      ...collection.byId,
      [model.id]: model
    }
  }
}

export function addToCollection<T extends {id: number}>(collection: ModelCollection<T>, model: T): ModelCollection<T> {
  return {
    allIds: [...collection.allIds, model.id],
    byId: {
      ...collection.byId,
      [model.id]: model
    }
  }
}

export function deleteFromCollection<T extends {id: number}>(collection: ModelCollection<T>, model: T): ModelCollection<T> {
  return {
    ...collection,
    allIds: collection.allIds.filter(id => id !== model.id)
  }
}