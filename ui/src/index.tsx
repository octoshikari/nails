import { render } from 'solid-js/web'
import { App } from './app'
import { useUnit } from 'effector-solid'
import { $isAuthReady, AuthState, userInfoGet } from './models/auth'
import { HopeProvider, Spinner } from '@hope-ui/solid'
import { onMount, Switch, Match } from 'solid-js'
import { LoginPage } from './pages/auth/login'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?'
  )
}

const RootApp = () => {
  const [authState, userInfo] = useUnit([$isAuthReady, userInfoGet])

  onMount(() => { userInfo() })

  return <HopeProvider>
        <Switch>
            <Match when={authState() === AuthState.Init} keyed>
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="$neutral4"
                        color="$info10"
                        size="xl"
                    />
            </Match>
            <Match when={authState() === AuthState.NeedLogin} keyed>
                <LoginPage />
            </Match>
            <Match when={authState() === AuthState.Ok} keyed>
                <App />
            </Match>
        </Switch>
  </HopeProvider>
}

render(() => <RootApp/>, root!)
