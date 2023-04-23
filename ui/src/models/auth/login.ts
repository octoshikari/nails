import {createEffect, createEvent, createStore, sample} from 'effector'
import {$user, type User} from './index'

export interface LoginData {
    email: string
    password: string
}

export const handleInput = createEvent<{ key: keyof LoginData, value: string }>()
export const login = createEvent()
export const loginFx = createEffect<LoginData, User>(async (data: LoginData) =>
    await fetch('/auth/login', {method: 'POST', body: JSON.stringify(data)}).then(async r => await r.json()))
export const $form = createStore<LoginData>({email: '', password: ''})
export const $loginError = createStore<boolean>(false).reset(loginFx);

sample({clock: handleInput, source: $form, fn: (source, data) => ({...source, [data.key]: data.value}), target: $form})

sample({clock: login, source: $form, target: loginFx})
sample({
    clock: loginFx.failData, fn: (err) => {
        console.log(err);
        return true
    }, target: $loginError
})
sample({clock: loginFx.doneData, target: $user})
