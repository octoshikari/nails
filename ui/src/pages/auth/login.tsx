import {
  Alert,
  AlertDescription, AlertIcon,
  AlertTitle,
  Button, CloseButton,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text
} from "@hope-ui/solid";
import {useUnit} from "effector-solid";
import { Show } from "solid-js/web";
import {$form, $loginError, handleInput, login} from "../../models/auth/login";

export const LoginPage = () => {
    const [form, handle, process, error] = useUnit([$form, handleInput, login, $loginError]);
    return <div>
      <Show when={error()}>
        <Alert status="danger" variant="left-accent">
          Ошибка при входе в систему!
        </Alert>
      </Show>
        <FormControl>
            <FormLabel for="email">Email</FormLabel>
            <Input id="email" type="email" value={form().email} onInput={(e) => handle({key: "email", value: e.currentTarget.value}) }/>
        </FormControl>
        <FormControl>
            <FormLabel for="password">Password</FormLabel>
            <Input id="password" type="password" value={form().password} onInput={(e) => handle({key: "password", value: e.currentTarget.value}) }/>
        </FormControl>
        <Button marginTop="10px" onClick={() => process()} colorScheme="success">Войти</Button>
    </div>
}
