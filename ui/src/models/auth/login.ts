import {createEffect, createEvent, createStore, sample} from 'effector'
import {$isAuthReady, $user, AuthState, type User} from './index'

export interface LoginData {
    email: string
    password: string
}

export const handleInput = createEvent<{ key: keyof LoginData, value: string }>()
export const login = createEvent()
export const loginFx = createEffect<LoginData, User>(async (data: LoginData) => {
    //fetch('/auth/login', {method: 'POST', body: JSON.stringify(data)}).then(r => r.json()))
    if (data.email === 'h@gmail.com' && data.password === '123') {
        return {id: "1", firstName: "Test", lastName: "Test", email: "h@gmail.com", phone: "71111111111", instagram: "mega_instagram"}
    }else{
        throw Error("Wrong credentials")
    }
})
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
sample({clock: loginFx.doneData, fn: () => AuthState.Ok, target: $isAuthReady})
