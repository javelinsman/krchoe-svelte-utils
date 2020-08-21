import { GET, POST, PUT, DELETE } from "./api-utils"
import { collectionFromModels } from "../model-collection"

type Deleted = { id: number }

export function makeCRUD<
  UrlGetArgs extends any[],
  UrlPostArgs extends any[],
  Model extends { id: number },
  ModelRaw extends { pk: number },
  ModelRawSend extends { pk: number, fields: any },
>(
  makeUrlGet: (...args: UrlGetArgs) => string,
  makeUrlPost: (...args: UrlPostArgs) => string,
  translate: (modelRaw: ModelRaw) => Model,
  translateBack: (model: Model) => ModelRawSend,
) {
  interface PropsCRU { payload: ModelRaw }
  interface PropsD { payload: Deleted }
  return {

    get: async (...urlArgs: UrlGetArgs) => {
      const { payload: modelRaw } = await GET<PropsCRU>({
        url: makeUrlGet(...urlArgs)
      })
      const model = translate(modelRaw)
      return model
    },

    create: async (model: Model, ...urlArgs: UrlPostArgs) => {
      const { payload: modelRaw } = await POST<PropsCRU>({
        url: makeUrlPost(...urlArgs),
        data: translateBack(model).fields
      })
      return translate(modelRaw)
    },

    update: async (model: Model, ...urlArgs: UrlGetArgs) => {
      const { payload: modelRaw } = await PUT<PropsCRU>({
        url: makeUrlGet(...urlArgs),
        data: translateBack(model).fields
      })
      return translate(modelRaw)
    },

    delete: async (...urlArgs: UrlGetArgs) => {
      const { payload: { id } } = await DELETE<PropsD>({
        url: makeUrlGet(...urlArgs)
      })
      return id
    },
  }
}

export function makeList<
  UrlAllArgs extends any[],
  Model extends { id: number },
  ModelRaw extends { pk: number },
> (
  makeUrlAll: (...args: UrlAllArgs) => string,
  translate: (modelRaw: ModelRaw) => Model,
) {
  interface PropsL { payload: ModelRaw[] }
  return {
    all: async (...urlArgs: UrlAllArgs) => {
      const { payload: modelRaws} = await GET<PropsL>({
        url: makeUrlAll(...urlArgs)
      })
      const models = modelRaws.map(model => translate(model))
      return collectionFromModels(models)
    },
  }
}

export function makeGet<
  UrlAllArgs extends any[],
  Model extends { id: number },
  ModelRaw extends { pk: number },
> (
  makeUrlGet: (...args: UrlAllArgs) => string,
  translate: (modelRaw: ModelRaw) => Model,
) {
  interface PropsG { payload: ModelRaw }
  return {
    get: async (...urlArgs: UrlAllArgs) => {
      const { payload: model} = await GET<PropsG>({
        url: makeUrlGet(...urlArgs)
      })
      return translate(model)
    },
  }
}

export function makeCRUDList<
  UrlGetArgs extends any[],
  UrlPostArgs extends any[],
  UrlAllArgs extends any[],
  Model extends { id: number },
  ModelRaw extends { pk: number },
  ModelRawSend extends { pk: number, fields: any },
> (
  makeUrlGet: (...args: UrlGetArgs) => string,
  makeUrlPost: (...args: UrlPostArgs) => string,
  makeUrlAll: (...args: UrlAllArgs) => string,
  translate: (modelRaw: ModelRaw) => Model,
  translateBack: (model: Model) => ModelRawSend,
) {
  return {
    ...makeCRUD(
      makeUrlGet, makeUrlPost, translate, translateBack
    ),
    ...makeList(
      makeUrlAll, translate
    )
  }
}