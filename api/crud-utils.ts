import { GET, POST, PUT, DELETE } from "./api-utils"
import { collectionFromModels } from "../model-collection"

type Deleted = { id: number }

export function makeCRUD<
  UrlGetArgs extends any[],
  UrlPostArgs extends any[],
  Model extends {id: number}, ModelReceive, ModelSend,
  PartialModel extends Partial<Model>,
>(
  makeUrlGet: (...args: UrlGetArgs) => string,
  makeUrlPost: (...args: UrlPostArgs) => string,
  translate: (modelRaw: ModelReceive) => Model,
  translateBack: (model: PartialModel) => ModelSend,
) {
  interface PropsCRU { payload: ModelReceive }
  interface PropsD { payload: Deleted }
  return {

    get: async (...urlArgs: UrlGetArgs) => {
      const { payload: modelRaw } = await GET<PropsCRU>({
        url: makeUrlGet(...urlArgs)
      })
      const model = translate(modelRaw)
      return model
    },

    create: async (model: PartialModel, ...urlArgs: UrlPostArgs) => {
      const { payload: modelRaw } = await POST<PropsCRU>({
        url: makeUrlPost(...urlArgs),
        data: translateBack(model)
      })
      return translate(modelRaw)
    },

    update: async (model: PartialModel, ...urlArgs: UrlGetArgs) => {
      const { payload: modelRaw } = await POST<PropsCRU>({
        // temporarily, post with pk is treated as put
        url: makeUrlGet(...urlArgs),
        data: translateBack(model)
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
  Model extends {id: number}, ModelReceive,
> (
  makeUrlAll: (...args: UrlAllArgs) => string,
  translate: (modelRaw: ModelReceive) => Model,
) {
  interface PropsL { payload: ModelReceive[] }
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
  Model extends {id: number}, ModelReceive,
> (
  makeUrlGet: (...args: UrlAllArgs) => string,
  translate: (modelRaw: ModelReceive) => Model,
) {
  interface PropsG { payload: ModelReceive }
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
  Model extends {id: number}, 
  ModelReceive, ModelSend,
  PartialModel extends Partial<Model>,
> (
  makeUrlGet: (...args: UrlGetArgs) => string,
  makeUrlPost: (...args: UrlPostArgs) => string,
  makeUrlAll: (...args: UrlAllArgs) => string,
  translate: (modelRaw: ModelReceive) => Model,
  translateBack: (model: PartialModel) => ModelSend,
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