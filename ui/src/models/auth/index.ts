import { createEffect, createEvent, createStore, sample } from 'effector'

export const enum AuthState {
  Init,
  NeedLogin,
  Ok
}

export interface User {
  id: string
  email: string
  instagram: string
  phone: string
  firstName: string
  lastName: string
}

export const userInfoGet = createEvent()
export const userInfoGetFx = createEffect<void, User>(async () =>
  await fetch('/auth/userinfo').then(async r => await r.json())
)

export const $isAuthReady = createStore<AuthState>(AuthState.Init)
export const $user = createStore<User>({ email: '', firstName: '', id: '', instagram: '', lastName: '', phone: '' })

sample({ clock: userInfoGet, target: userInfoGetFx })
sample({ clock: userInfoGetFx.fail, fn: () => AuthState.NeedLogin, target: $isAuthReady })
sample({ clock: userInfoGetFx.doneData, target: $user })
sample({ clock: userInfoGetFx.doneData, fn: () => AuthState.Ok, target: $isAuthReady })
